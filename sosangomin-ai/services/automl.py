# sevices/automl.py

# from fastapi import UploadFile, File
# import re
# import pickle
# import shutil
import pandas as pd
import numpy as np
import os
import holidays  # type: ignore
from datetime import datetime, timedelta 
from pycaret.regression import *
from pycaret.clustering import *
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from services.weather_service import weather_service

# 우선 키움 페이 포스기 데이터를 기준으로 작성하였음.

async def read_file(temp_file: str) -> pd.DataFrame:
    """파일 확장자에 따른 데이터 읽기"""
    ext = os.path.splitext(temp_file)[1].lower()
    if ext == ".csv":
        return pd.read_csv(temp_file, header=2)
    elif ext in [".xls", ".xlsx"]:
        return pd.read_excel(temp_file, header=2)
    else:
        raise ValueError("지원되지 않는 파일 형식입니다. CSV 또는 Excel만 가능합니다.")

def preprocess_data(df) :
    """데이터 전처리 및 시간 변수 생성"""
    # TODO : 현재 직접적인 변수명을 사용한 부분이 있는데 일반화를 할지 고민

    # 헤더의 변수명과 같은 값을 가지는 열을 삭제 
    header_values = set(df.columns.tolist()) 
    columns_to_drop = [col for col in df.columns if any(df[col].astype(str).isin(header_values))]
    df = df.drop(columns=columns_to_drop)

    df = df.dropna(axis=0, how='all')  # 모든 값이 NaN인 행 제거
    df = df.dropna(axis=1, how='all')  # 모든 값이 NaN인 열 제거
    df = df.loc[:, df.nunique() > 1]   # 고유값 개수가 1개 이하인 열 제거
    df = df.T.drop_duplicates().T      # 중복된 열 제거  

    # 'Unnamed'가 포함되지 않은 열 중복
    cols_to_fill = [col for col in df.columns if 'Unnamed' not in str(col)]
    df[cols_to_fill] = df[cols_to_fill].fillna(method='ffill') # 해당 열에서 결측값을 이전 행 값으로 채우기

    # 동일 속성이 여러 다른 칼럼에 존재하는 경우, 이를 하나의 칼럼으로 정리
    dup_val = ['단가', '수량', '원가']
    for val in dup_val :
        columns = [col for col in df.columns if df[col].astype(str).str.contains(val, na=False).any()]
        # print(val, columns)
        df[val] = df[columns].bfill(axis=1).iloc[:, 0]
        df = df.drop(columns=columns)

    # TODO: 결제 수단 이용할건지?

    df = df.dropna(axis=0, how='any') # 결측값이 있는 행 제거

    # 컬럼명 수정
    new_columns = [df.iloc[0, i] if 'Unnamed' in str(col) else col for i, col in enumerate(df.columns)]
    df.columns = new_columns  # 새로운 열 이름 설정
    df = df[~df.apply(lambda row: any(row.astype(str).isin(new_columns)), axis=1)]
    df = df.loc[:, df.nunique() > 1]   # 고유값 개수가 1개 이하인 열 제거
    
    # 파생변수 생성
    kr_holidays = holidays.KR()

    df['매출 일시'] = pd.to_datetime(df['매출 일시'])
    df['년'] = df['매출 일시'].dt.year
    df['월'] = df['매출 일시'].dt.month
    df['일'] = df['매출 일시'].dt.day
    df['시'] = df['매출 일시'].dt.hour
    df['분'] = df['매출 일시'].dt.minute
    df['요일'] = df['매출 일시'].dt.day_name()  
    df['시간대'] = df['시'].apply(lambda x: '점심' if 11 <= x <= 15 else ('저녁' if 17 <= x <= 21 else '기타')) # 시간대 (점심, 저녁, 기타)
    df['계절'] = df['월'].apply(lambda x: '봄' if 3 <= x <= 5 else
                                        '여름' if 6 <= x <= 8 else
                                        '가을' if 9 <= x <= 11 else '겨울')
    df['공휴일'] = df['매출 일시'].dt.date.apply(lambda x: '휴일' if x in kr_holidays or x.weekday() >= 5 else '평일')
    
    # 외부 데이터 불러오기
    # weather_df = weather_service.get_weather_range_with_fallback(start_date, end_date, location='서울')
    # df = df.merge(weather_df, left_on='날짜', right_on='date', how='left').drop(columns=['날짜', 'date'])
    # df['기온']
    # df['강수량']
    # df['미세먼지']
    # df['유동인구']


    df.drop('매출 일시', axis=1, inplace=True)
    df.columns = ['매출' if col in ['총매출', '실매출'] else col for col in df.columns]

    return df

def find_best_k(data: pd.DataFrame, k_min: int = 2, k_max: int = 10) -> int:
    """Silhouette Score로 최적 k 찾기"""
    best_k = k_min
    best_score = -1

    for k in range(k_min, k_max + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
        labels = kmeans.fit_predict(data)
        score = silhouette_score(data, labels)
        print(f"[K={k}] Silhouette Score: {score:.4f}")

        if score > best_score:
            best_score = score
            best_k = k

    print(f"최적 클러스터 수: {best_k}")
    return best_k

def find_best_k_elbow(data: pd.DataFrame, k_min: int = 2, k_max: int = 10) -> int:
    """엘보우 방법(WCSS 기반)으로 최적 k 찾기"""
    wcss = []

    for k in range(k_min, k_max + 1):
        kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
        kmeans.fit(data)
        wcss.append(kmeans.inertia_)
        print(f"[K={k}] WCSS (군집 내 제곱합): {kmeans.inertia_:.4f}")

    # 차분을 통해 기울기 변화 확인 (자동화된 엘보우 포인트 탐색)
    deltas = np.diff(wcss)  
    delta_ratios = np.abs(np.diff(wcss) / wcss[:-1]) 

    # 변화율이 급격하게 줄어드는 지점 찾기 (가장 큰 변화 이후 k 선택)
    if len(delta_ratios) > 0:
        elbow_point = np.argmin(delta_ratios) + k_min + 1 
    else:
        elbow_point = k_min  # 데이터 적을 때

    return elbow_point

async def predict_next_30_sales(temp_file: str):
    """향후 30일 매출 예측"""
    try:
        df = await read_file(temp_file)
        df = preprocess_data(df)

        sales_df = df[['년', '월', '일', '고객 수', '매출', '수량', '요일', '계절', '공휴일']] 

        # 타겟변수 찾기 : "매출"이 포함된 컬럼 리스트 추출
        sales_cols_ = [col for col in sales_df.columns if "매출" in col]
        sales_cols = []
        for col in sales_cols_:
            try:
                sales_df[col] = sales_df[col].astype(str).str.replace(",", "", regex=True)  
                sales_df[col] = pd.to_numeric(df[col], errors='coerce') 
                if sales_df[col].notna().sum() > 0:  
                    sales_cols.append(col)
            except:
                continue 

        target_column = sales_df[sales_cols].mean().idxmax() # 여러 개의 매출 컬럼이 있다면 평균값이 가장 큰 컬럼 선택

        # 날짜별 데이터 그룹화 (숫자형 변수는 평균, 문자형 변수는 최빈값 사용)
        numeric_cols = sales_df.select_dtypes(include=['number']).columns.difference(["년", "월", "일"])
        categorical_cols = sales_df.select_dtypes(exclude=['number']).columns.difference(["년", "월", "일"])

        grouped_df = sales_df.groupby(["년", "월", "일"]).agg(
            {col: "mean" for col in numeric_cols} | 
            {col: (lambda x: x.mode()[0] if not x.mode().empty else None) for col in categorical_cols}
        ).reset_index()

        grouped_df = grouped_df.sort_values(by=["년", "월", "일"])
        # grouped_df = grouped_df.loc[:, grouped_df.nunique() > 1]

        # PyCaret 설정
        exp = RegressionExperiment()
        exp.setup(data=grouped_df, target=target_column, session_id=42)

        # 최적 모델 선택 및 튜닝
        models = exp.compare_models(exclude=['lightgbm'], n_select=5)
        # results = pull()
        best_model = models[0]
        exp.predict_model(best_model)
        # tuned_model = tune_model(best_model)
        # exp.evaluate_model(best_model) # 시각화 포함 평가 

        # 미래 데이터 생성
        last_date = grouped_df[["년", "월", "일"]].max()
        last_date_dt = datetime(int(last_date["년"]), int(last_date["월"]), int(last_date["일"]))
        future_dates = pd.date_range(start=last_date_dt + timedelta(days=1), periods=30, freq="D")

        future_df = pd.DataFrame({
            "년": future_dates.year,
            "월": future_dates.month.astype(str).str.zfill(2),
            "일": future_dates.day.astype(str).str.zfill(2)
        })

        # TODO : 독립변수 결측치 대체 방법 수정
        # 미래 데이터 독립변수 대체
        # 범주형
        kr_holidays = holidays.KR()
        future_df['날짜'] = pd.to_datetime(future_df[['년', '월', '일']].astype(str).agg('-'.join, axis=1))
        future_df['요일'] = future_df['날짜'].dt.day_name()  
        # future_df['요일'] = future_df['날짜'].dt.dayofweek.map({0:'월요일', 1:'화요일', 2:'수요일', 3:'목요일', 4:'금요일', 5:'토요일', 6:'일요일'})
        future_df['계절'] = future_df['날짜'].dt.month.astype(int).apply(
            lambda x: '봄' if 3 <= x <= 5 else '여름' if 6 <= x <= 8 else '가을' if 9 <= x <= 11 else '겨울'
        )
        future_df['공휴일'] = future_df['날짜'].dt.date.apply(lambda x: '휴일' if x in kr_holidays or x.weekday() >= 5 else '평일')
        future_df.drop('날짜', axis=1, inplace=True)

        # 수치형
        fill_values = grouped_df[['고객 수', '수량']].mean()
        for col in ['고객 수', '수량']:
            if col not in future_df.columns:
                future_df[col] = fill_values[col]

        # window_size = 30 # 예측 기간 
        # total_data = pd.concat([grouped_df.drop(columns=target_column), future_df]).reset_index(drop=True)


        # for i, col in enumerate(total_data.columns):
        #     if col not in ["년", "월", "일", target_column]:
        #         if pd.api.types.is_numeric_dtype(total_data[col]):
        #             # 숫자형 변수는 마지막 window_size만 이동 평균 적용
        #             total_data.iloc[len(total_data)-window_size:, i] = (total_data[col].rolling(window=window_size, min_periods=1).mean().iloc[-window_size:].fillna(method="ffill"))
                # else :
                #     # 범주형 변수는 우선 최빈값 적용 : 동일 날짜(1일은 1일별로)에 대해서는 같은 값이 나오게 하든 다른 방식 고려해보기
                #     # 범주형 변수는 마지막 window_size만 이동 최빈값 적용
                #     for j in range(window_size):
                #         past_values = total_data.iloc[:len(total_data)-window_size+j, i].dropna().tail(window_size)
                #         most_frequent = past_values.mode()
                #         total_data.loc[len(total_data)-window_size+j, col] = most_frequent[0] if not most_frequent.empty else None

        # 다음 달 일별 매출 예측
        # future_df = total_data.iloc[-window_size:, :]
        predictions = exp.predict_model(best_model, data=future_df)
        future_df["predicted_sales"] = predictions["prediction_label"]

        return {
            "message": "30일 매출 예측 완료",
            "target_variable": target_column,
            "predictions": future_df.to_dict(orient="records")
        }
    
    except Exception as e:
        return {"error": str(e)}


async def perform_clustering(temp_file: str):
    """상품 클러스터링"""
    try:
        df = await read_file(temp_file)
        df = preprocess_data(df)

        cluster_df = df[['상품 명칭', '매출', '단가', '수량', '월', '요일', '시간대', '계절', '공휴일']] 

        # 범주형 변수별 수량 합계 피벗 테이블 생성
        category_vars = ['월', '요일', '시간대', '계절', '공휴일']
        pivot_tables = [cluster_df.pivot_table(index='상품 명칭', columns=col, values='수량', aggfunc='sum', fill_value=0) for col in category_vars]
        agg_df = cluster_df.groupby('상품 명칭').agg({'매출': 'sum', '수량': 'sum', '단가': 'mean'}) # 매출과 수량은 sum(), 단가는 mean()으로 집계

        # 모든 피벗 테이블을 상품명 기준으로 병합
        final_df = agg_df.copy()
        for pivot in pivot_tables:
            final_df = final_df.merge(pivot, on='상품 명칭', how='left')
        final_df.reset_index(inplace=True)

        # PyCaret 클러스터링 설정
        exp = ClusteringExperiment()
        exp.setup(data=final_df.drop(columns=['상품 명칭']), session_id=42, normalize=True, n_jobs=1)

        processed_data = exp.get_config('X')
        optimal_k = 2 # find_best_k(processed_data)

        model = exp.create_model('kmeans', num_clusters=optimal_k)
        df_clustered = exp.assign_model(model)
        df_clustered['상품 명칭'] = final_df['상품 명칭'].values
        # df_clustered["Cluster"] = df_clustered["Cluster"].astype(str)
        
        cluster_data = df_clustered.to_dict(orient="records")

        # 클러스터별 통계 요약 # TODO: 범주형 변수때문에 통계 요약을 보낼지 고민해보기
        # cluster_summary = df_clustered.groupby("Cluster").mean().reset_index().to_dict(orient="records")

        # OpenAI API를 활용하여 클러스터링 분석 요청
        # openai_analysis = analyze_clusters_json(cluster_data)

        return {
            "message": "상품 클러스터링 완료",
            "optimal_k": optimal_k,
            "clusters": cluster_data,
            # "openai_analysis": openai_analysis
        }
    except Exception as e:
        return {"error": str(e)}
    


# 테스트용 함수
import asyncio

async def test_predict_sales():
        
    # 파일 경로 설정 및 데이터 로드
    script_dir = os.path.dirname(os.path.abspath(__file__))  
    temp_file = os.path.join(script_dir, "영수증 내역(1월~).xlsx") 
    result = await predict_next_30_sales(temp_file)

    # 결과 출력
    print("[TEST] 매출액 예측 결과:", result)

async def test_perform_clustering():
        
    # 파일 경로 설정 및 데이터 로드
    script_dir = os.path.dirname(os.path.abspath(__file__))  
    temp_file = os.path.join(script_dir, "영수증 내역(1월~).xlsx") 
    result = await perform_clustering(temp_file)

    # 결과 출력
    print("[TEST] 클러스터링 결과:", result)


# (python -m services.automl)
if __name__ == "__main__":
    # asyncio.run(test_predict_sales())
    asyncio.run(test_perform_clustering())

