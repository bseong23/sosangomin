from fastapi import UploadFile, File
import pandas as pd
import pickle
import shutil
import os
from pycaret.regression import *
from pycaret.clustering import *
from datetime import datetime, timedelta

SALES_MODEL_PATH = "sales_forecast.pkl"
CLUSTER_MODEL_PATH = "store_clustering.pkl"

# 시계열모델 있다는데 그거 쓸건지지
async def predict_next_month_sales(file: UploadFile = File(...)):
    try:
        # 확장자 구분 및 파일 저장
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()

        temp_file = f"uploaded_data{ext}"
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 파일 읽기
        if ext == ".csv":
            df = pd.read_csv(temp_file)
        elif ext in [".xls", ".xlsx"]:
            df = pd.read_excel(temp_file)
        else:
            return {"error": "지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드하세요."}

         # 날짜 컬럼 자동 탐색
        date_col = None
        for col in df.columns:
            if df[col].dtype == 'object' or pd.api.types.is_datetime64_any_dtype(df[col]):
                try:
                    df[col] = pd.to_datetime(df[col])  # 날짜 변환 시도
                    date_col = col
                    break
                except:
                    continue

        if date_col is None:
            return {"error": "날짜 데이터를 찾을 수 없습니다. 날짜 컬럼을 포함한 데이터를 업로드하세요."}

        # 날짜 컬럼을 인덱스로 설정 및 정렬
        df = df.sort_values(by=date_col)
        df.set_index(date_col, inplace=True)

        # data_col 세분화

        # "매출"이 포함된 타겟 변수 자동 탐색
        sales_cols = [col for col in df.columns if "매출" in col]

        # 여러 개의 매출 컬럼이 있다면 평균값이 가장 큰 컬럼을 선택
        target_column = df[sales_cols].mean().idxmax()

        if not sales_cols:
            return {"error": "'매출'이 포함된 컬럼을 찾을 수 없습니다. 데이터를 확인하세요."}


        # 일자별 데이터 그룹화 (숫자형 변수 합계)
        grouped_df = df.groupby(date_col).sum()  # 모든 숫자형 컬럼을 합산

        # PyCaret 설정
        exp = setup(data=grouped_df, target=target_column, session_id=42, silent=True)


        # 최적 모델 선택 & 튜닝
        best_model = compare_models()
        tuned_model = tune_model(best_model)

        # 미래 날짜(다음 달) 생성
        last_date = df.index.max()
        next_month_start = last_date + timedelta(days=1)
        next_month_end = next_month_start + pd.DateOffset(months=1) - timedelta(days=1)
        future_dates = pd.date_range(start=next_month_start, end=next_month_end, freq="D")

        # 새로운 데이터 생성 (추가 변수가 있다면 평균값 입력)
        future_data = pd.DataFrame({date_col: future_dates})
        future_data.set_index(date_col, inplace=True)

        # 기존 데이터에 추가 변수가 있다면 평균값으로 채움(수정하기)
        for col in df.columns:
            if col != "sales":  # 매출 컬럼은 예측 대상이므로 제외
                future_data[col] = df[col].mean()

        # 다음 달 일별 매출 예측
        predictions = predict_model(tuned_model, data=future_data)
        future_data["predicted_sales"] = predictions["prediction_label"]

        # 예측 결과 JSON 반환
        return {
            "message": "다음 달 일별 매출 예측 완료",
            "target_variable": target_column,
            "predictions": future_data.reset_index().to_dict(orient="records")
        }

    except Exception as e:
        return {"error": str(e)}

# async def train_model(file: UploadFile = File(...)):
#     try:
#         # 확장자 구분
#         filename = file.filename
#         ext = os.path.splitext(filename)[1].lower()

#         # 파일 저장
#         temp_file = f"uploaded_train{ext}"
#         with open(temp_file, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         # 파일 읽기
#         if ext == ".csv":
#             df = pd.read_csv(temp_file)
#         elif ext in [".xls", ".xlsx"]:
#             df = pd.read_excel(temp_file)
#         else:
#             return {"error": "지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드하세요."}

        
#         # PyCaret 설정
#         exp = setup(data=df, target="sales", session_id=42, silent=True)

#         # 최적 모델 선택 & 튜닝
#         best_model = compare_models()
#         tuned_model = tune_model(best_model)

#         # 모델 저장
#         with open(SALES_MODEL_PATH, "wb") as model_file:
#             pickle.dump(tuned_model, model_file)

#         return {"message": "매출 예측 모델 학습 완료 및 저장됨"}
#     except Exception as e:
#         return {"error": str(e)}

# async def predict_sales(file: UploadFile = File(...)):
#     try:
#         # 확장자 구분
#         filename = file.filename
#         ext = os.path.splitext(filename)[1].lower()

#         # 파일 저장
#         temp_file = f"uploaded_predict{ext}"
#         with open(temp_file, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         # 파일 읽기
#         if ext == ".csv":
#             df = pd.read_csv(temp_file)
#         elif ext in [".xls", ".xlsx"]:
#             df = pd.read_excel(temp_file)
#         else:
#             return {"error": "지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드하세요."}

        
#         # 저장된 모델 불러오기
#         with open(SALES_MODEL_PATH, "rb") as model_file:
#             loaded_model = pickle.load(model_file)

#         # 예측 수행
#         predictions = predict_model(loaded_model, data=df)

#         return {"predictions": predictions["prediction_label"].tolist()}
#     except Exception as e:
#         return {"error": str(e)}

async def perform_clustering(file: UploadFile = File(...)):
    try:
        # 확장자 구분
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()

        # 파일 저장
        temp_file = f"uploaded_store_data{ext}"
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 파일 읽기
        if ext == ".csv":
            df = pd.read_csv(temp_file)
        elif ext in [".xls", ".xlsx"]:
            df = pd.read_excel(temp_file)
        else:
            return {"error": "지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드하세요."}

        df.drop(columns=["date"], errors="ignore", inplace=True)  # 날짜 컬럼 제거

        # PyCaret 클러스터링 설정
        exp = setup(data=df, silent=True)

        # 최적의 클러스터링 모델 선택
        best_model = create_model('kmeans')

        # 클러스터 할당
        df_clustered = assign_model(best_model)
        df_clustered["Cluster"] = df_clustered["Cluster"].astype(str)

        # 클러스터별 통계 요약
        cluster_summary = df_clustered.groupby("Cluster").mean().reset_index().to_dict(orient="records")

        # 모델 저장
        with open(CLUSTER_MODEL_PATH, "wb") as model_file:
            pickle.dump(best_model, model_file)

        return {"clusters": cluster_summary}
    except Exception as e:
        return {"error": str(e)}