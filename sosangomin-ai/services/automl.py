from fastapi import UploadFile, File
import pandas as pd
import numpy as np
import pickle
import shutil
import os
from pycaret.regression import *
# from pycaret.clustering import *
# from pycaret.time_series import *
from datetime import datetime, timedelta

SALES_MODEL_PATH = "sales_forecast.pkl"
CLUSTER_MODEL_PATH = "store_clustering.pkl"

async def predict_next_month_sales(): #file: UploadFile = File(...)
    try:
        # # 확장자 구분 및 파일 저장
        # filename = file.filename
        # ext = os.path.splitext(filename)[1].lower()

        # temp_file = f"uploaded_data{ext}"
        # with open(temp_file, "wb") as buffer:
        #     shutil.copyfileobj(file.file, buffer)        

        # # 파일 읽기
        # if ext == ".csv":
        #     df = pd.read_csv(temp_file, header=None)
        # elif ext in [".xls", ".xlsx"]:
        #     df = pd.read_excel(temp_file, header=None)
        # else:
        #     return {"error": "지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드하세요."}


        # 파일 경로 설정 및 데이터 로드
        # script_dir = os.path.dirname(os.path.abspath(__file__))  
        # file_path = os.path.join(script_dir, "영수증 내역.xlsx") 
        # df = pd.read_excel(file_path, header=2)  # 세 번째 행을 컬럼명으로 설정

        # 데이터 전처리
        df = df.dropna(axis=1, how='all')  # 모든 값이 NaN인 열 제거
        df = df.loc[:, df.nunique() > 1]   # 고유값 개수가 1개 이하인 열 제거
        df = df.T.drop_duplicates().T      # 중복된 열 제거

        # 날짜 컬럼 자동 탐색 및 변환
        date_col = None
        for col in df.columns:
            if '날짜' in col or '일자' in col:
                try:
                    df[col] = pd.to_datetime(df[col], errors='coerce')  # 날짜 변환 시도
                    if df[col].notna().sum() > 0:
                        date_col = col
                        break
                except:
                    continue
        if date_col is None:
            raise ValueError("날짜 데이터를 찾을 수 없습니다. 날짜 컬럼을 포함한 데이터를 업로드하세요.")
        
        # 날짜 컬럼을 인덱스로 설정 및 정렬
        df = df.dropna(subset=[date_col])
        df.set_index(date_col, inplace=True)

        # 날짜 데이터를 연도, 월, 일로 분리하여 새로운 변수 생성
        df["year"] = df.index.year.astype(int).astype(str)
        df["month"] = df.index.month.astype(str).str.zfill(2)
        df["day"] = df.index.day.astype(str).str.zfill(2)
        df.reset_index(drop=True, inplace=True)  # 기존 날짜 컬럼 삭제

        # "매출"이 포함된 컬럼 리스트 추출
        sales_cols_ = [col for col in df.columns if "매출" in col]

        # sales_cols 중에서 숫자로 변환 가능한 컬럼만 선택
        sales_cols = []
        for col in sales_cols_:
            try:
                df[col] = df[col].astype(str).str.replace(",", "", regex=True)  # 쉼표 제거 후 문자열로 변환
                df[col] = pd.to_numeric(df[col], errors='coerce')  # 숫자로 변환 시도
                if df[col].notna().sum() > 0:  # 변환 후 NaN이 아닌 값이 하나라도 있는 경우 유효한 숫자형 컬럼
                    sales_cols.append(col)
            except:
                continue  # 변환 실패 시 무시

        # 여러 개의 매출 컬럼이 있다면 평균값이 가장 큰 컬럼 선택
        target_column = df[sales_cols].mean().idxmax()

        # 날짜별 데이터 그룹화 (숫자형 변수는 평균, 문자형 변수는 최빈값 사용)
        numeric_cols = df.select_dtypes(include=['number']).columns
        categorical_cols = df.select_dtypes(exclude=['number']).columns.difference(["year", "month", "day"])

        grouped_df = df.groupby(["year", "month", "day"]).agg(
            {col: "mean" for col in numeric_cols} | 
            {col: (lambda x: x.mode()[0] if not x.mode().empty else None) for col in categorical_cols}
        ).reset_index()

        # year, month, day 기준으로 정렬
        grouped_df = grouped_df.sort_values(by=["year", "month", "day"])
        grouped_df = grouped_df.dropna(axis=1, how='all')  # 모든 값이 NaN인 열 제거
        # grouped_df = grouped_df.loc[:, grouped_df.nunique() > 1]

        # PyCaret 설정
        exp = setup(data=grouped_df, target=target_column, session_id=42)

        # 최적 모델 선택 및 튜닝
        best_model = compare_models()
        tuned_model = tune_model(best_model)

        # 미래 날짜(다음 달) 생성
        last_date = grouped_df[["year", "month", "day"]].max()
        next_month_start = datetime(int(last_date.year), int(last_date.month), int(last_date.day)) + timedelta(days=1)
        next_month_end = next_month_start + pd.DateOffset(months=1) - timedelta(days=1)
        future_dates = pd.date_range(start=next_month_start, end=next_month_end, freq="D")

        # 미래 데이터 생성
        future_data = pd.DataFrame({
            "year": future_dates.year,
            "month": future_dates.month.astype(str).str.zfill(2),
            "day": future_dates.day.astype(str).str.zfill(2)
        })

        # 예측 기간 
        window_size = len(future_data)

        # 기존 데이터와 붙이기
        total_data = pd.concat([grouped_df.drop(columns=target_column), future_data]).reset_index(drop=True)

        # 예측 기간 동안 독립변수 롤링 
        for i, col in enumerate(total_data.columns):
            if col not in ["year", "month", "day", target_column]:
                if pd.api.types.is_numeric_dtype(total_data[col]):
                    # 숫자형 변수는 마지막 window_size만 이동 평균 적용
                    total_data.iloc[len(total_data)-window_size:, i] = (total_data[col].rolling(window=window_size, min_periods=1).mean().iloc[-window_size:].fillna(method="ffill"))
                else :
                    # 범주형 변수는 우선 최빈값 적용 : 동일 날짜(1일은 1일별로)에 대해서는 같은 값이 나오게 하든 다른 방식 고려해보기
                    # 범주형 변수는 마지막 window_size만 이동 최빈값 적용
                    for j in range(window_size):
                        past_values = total_data.iloc[:len(total_data)-window_size+j, i].dropna().tail(window_size)
                        most_frequent = past_values.mode()
                        total_data.loc[len(total_data)-window_size+j, col] = most_frequent[0] if not most_frequent.empty else None
        
        # 다음 달 일별 매출 예측
        future_data = total_data.iloc[-window_size:, :]
        predictions = predict_model(tuned_model, data=future_data)
        future_data["predicted_sales"] = predictions["prediction_label"]

        # 예측 결과 JSON 반환
        return {
            "message": "다음 달 일별 매출 예측 완료",
            "target_variable": target_column,
            "predictions": future_data.to_dict(orient="records")
        }
    
    except Exception as e:
        return {"error": str(e)}


# async def perform_clustering(file: UploadFile = File(...)):
#     try:
#         # 확장자 구분
#         filename = file.filename
#         ext = os.path.splitext(filename)[1].lower()

#         # 파일 저장
#         temp_file = f"uploaded_store_data{ext}"
#         with open(temp_file, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         # 파일 읽기
#         if ext == ".csv":
#             df = pd.read_csv(temp_file)
#         elif ext in [".xls", ".xlsx"]:
#             df = pd.read_excel(temp_file)
#         else:
#             return {"error": "지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드하세요."}

#         df.drop(columns=["date"], errors="ignore", inplace=True)  # 날짜 컬럼 제거

#         # PyCaret 클러스터링 설정
#         exp = setup(data=df, silent=True)

#         # 최적의 클러스터링 모델 선택
#         best_model = create_model('kmeans')

#         # 클러스터 할당
#         df_clustered = assign_model(best_model)
#         df_clustered["Cluster"] = df_clustered["Cluster"].astype(str)

#         # 클러스터별 통계 요약
#         cluster_summary = df_clustered.groupby("Cluster").mean().reset_index().to_dict(orient="records")

#         # 모델 저장
#         with open(CLUSTER_MODEL_PATH, "wb") as model_file:
#             pickle.dump(best_model, model_file)

#         return {"clusters": cluster_summary}
#     except Exception as e:
#         return {"error": str(e)}