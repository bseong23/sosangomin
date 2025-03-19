# sevices/automl.py

import pandas as pd
import numpy as np
import os
import holidays  
# from datetime import datetime, timedelta 
from darts import TimeSeries
from darts.models import AutoARIMA, Prophet
from darts.utils.statistics import plot_residuals
from darts.utils.timeseries_generation import datetime_attribute_timeseries
from darts.metrics import mape, rmse
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
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

async def preprocess_data(df) :
    """데이터 전처리 및 시간 변수 생성"""
    # TODO : 현재 직접적인 변수명을 사용한 부분이 있는데 일반화를 할지 고민

    # 헤더의 변수명과 같은 값을 가지는 열을 삭제 
    header_values = set(df.columns.tolist()) 
    columns_to_drop = [col for col in df.columns if any(df[col].astype(str).isin(header_values))]
    df = df.drop(columns=columns_to_drop)

    # 결측 및 중복 처리 
    df = (
        df.dropna(axis=0, how='all')  # 모든 값이 NaN인 행 제거
          .dropna(axis=1, how='all')  # 모든 값이 NaN인 열 제거
          .loc[:, df.nunique() > 1]  # 고유값 1개 이하인 열 제거
          .T.drop_duplicates().T    # 중복 열 제거
    )

    # 'Unnamed'가 포함되지 않은 열 중복
    cols_to_fill = [col for col in df.columns if 'Unnamed' not in str(col)]
    df[cols_to_fill] = df[cols_to_fill].ffill() 

    # 동일 속성이 여러 다른 칼럼에 존재하는 경우, 이를 하나의 칼럼으로 정리
    dup_val = ['단가', '수량', '원가']
    for val in dup_val :
        columns = [col for col in df.columns if df[col].astype(str).str.contains(val, na=False).any()]
        # print(val, columns)
        if columns:
            df[val] = df[columns].bfill(axis=1).iloc[:, 0]
            df = df.drop(columns=columns)

    # TODO: 결제 수단 이용할건지?

    df = df.dropna(axis=0, how='any') # 결측값이 있는 행 제거

    # 컬럼명 수정
    new_columns = [df.iloc[0, i] if 'Unnamed' in str(col) else col for i, col in enumerate(df.columns)]
    df.columns = new_columns
    df = df[~df.apply(lambda row: any(row.astype(str).isin(new_columns)), axis=1)]
    df = df.loc[:, df.nunique() > 1]  
    
    # 파생변수 생성
    kr_holidays = holidays.KR()

    df['매출 일시'] = pd.to_datetime(df['매출 일시'])
    df['년'] = df['매출 일시'].dt.year.astype(str)  
    df['월'] = df['매출 일시'].dt.month.astype(str).str.zfill(2)
    df['일'] = df['매출 일시'].dt.day.astype(str).str.zfill(2)
    df['시'] = df['매출 일시'].dt.hour.astype(str).str.zfill(2)
    df['분'] = df['매출 일시'].dt.minute.astype(str).str.zfill(2)
    df['요일'] = df['매출 일시'].dt.day_name()  
    df['시간대'] = df['시'].astype(int).apply(lambda x: '점심' if 11 <= x <= 15 else ('저녁' if 17 <= x <= 21 else '기타')) # 시간대 (점심, 저녁, 기타)
    df['계절'] = df['월'].astype(int).apply(lambda x: '봄' if 3 <= x <= 5 else
                                        '여름' if 6 <= x <= 8 else
                                        '가을' if 9 <= x <= 11 else '겨울')
    df['공휴일'] = df['매출 일시'].dt.date.apply(lambda x: '휴일' if x in kr_holidays or x.weekday() >= 5 else '평일')
    
    # 외부 데이터 불러오기
    min_date, max_date = df['매출 일시'].min(), df['매출 일시'].max()
    start_date, end_date = min_date.strftime('%Y%m%d%H'), max_date.strftime('%Y%m%d%H')

    # 날씨
    weather_df = await weather_service.process_weather(start_date, end_date, "서울") # TODO : 장소 받아오는 로직 짜기

    merged_df = pd.merge(
        df, 
        weather_df, 
        left_on=['년', '월', '일', '시'],
        right_on=['year', 'month', 'day', 'hour'],
        how='left'
    ).drop(columns=['year', 'month', 'day', 'hour'])
    
    merged_df = merged_df.rename(columns={
        'ta': '기온',
        'ws': '풍속',
        'hm': '습도',
        'rn': '강수량'
    })
    merged_df['강수량'] = merged_df['강수량'].fillna(0)
    # df['미세먼지']
    # df['유동인구']


    # df.drop('매출 일시', axis=1, inplace=True)
    merged_df.columns = ['매출' if col in ['총매출', '실매출'] else col for col in merged_df.columns]

    return merged_df

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

async def predict_next_30_sales(df: pd.DataFrame): # predict_next_30_sales(temp_file: str):
    """향후 30일 매출 예측"""
    try:
        # df = await read_file(temp_file)
        # df = await preprocess_data(df)

        # 날짜, 매출만 추출
        df['매출 일시'] = pd.to_datetime(df['매출 일시'])
        sales_df = df[['매출 일시', '매출']].copy()

        # 일별 매출 집계 
        daily_sales_df = sales_df.groupby(sales_df['매출 일시'].dt.date).agg({'매출': 'sum'}).reset_index()
        daily_sales_df.rename(columns={'매출 일시': '날짜'}, inplace=True)

        # 누락된 날짜 채우기
        date_range = pd.date_range(daily_sales_df['날짜'].min(), daily_sales_df['날짜'].max(), freq='D')
        daily_sales_df = daily_sales_df.set_index('날짜').reindex(date_range, fill_value=1000).rename_axis('날짜').reset_index()

        # TimeSeries로 변환
        ts = TimeSeries.from_dataframe(daily_sales_df, '날짜', '매출')

        # 모델 학습 
        model = Prophet()  
        # model = AutoARIMA()
        model.fit(ts) # TODO : 외부 요인 반영 future_covariates [날씨, 공휴일, 유동인구, 등]

        # Backtesting 방식으로 성능 평가 (마지막 30일)
        forecast_test = model.historical_forecasts(
            ts,
            start=-30,  # 끝에서 30개
            forecast_horizon=1,  # 하루 단위 예측
            retrain=True,
            verbose=True
        )

        # 평가
        mape_score = float(mape(ts[-30:], forecast_test))
        rmse_score = float(rmse(ts[-30:], forecast_test))

        # 향후 30일 예측
        forecast = model.predict(30)

        # 결과 포맷팅
        forecast_df = forecast.pd_dataframe().reset_index().rename(columns={'time': '날짜', '매출': '예측 매출'})
        forecast_df['날짜'] = forecast_df['날짜'].dt.strftime('%Y%m%d')
        forecast_df['예측 매출'] = forecast_df['예측 매출'].round(2)

        return {
            "message": "향후 30일 매출 예측 완료",
            "predictions": forecast_df.to_dict(orient='records'),
            "performance": {
                "MAPE": mape_score,
                "RMSE": rmse_score
            }
        }

    except Exception as e:
        return {"error": str(e)}


async def cluster_items(df: pd.DataFrame):
    """상품 클러스터링"""
    try:
        # df = await read_file(temp_file)
        # df = await preprocess_data(df)

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

         # 상품명 제거 후 정규화
        X = final_df.drop(columns=['상품 명칭'])
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # 최적의 k 찾기 
        best_k = find_best_k(X_scaled)

        # KMeans 클러스터링 수행
        kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
        final_df['Cluster'] = kmeans.fit_predict(X_scaled)
        cluster_data = final_df.to_dict(orient="records")

        # 클러스터별 통계 요약 # TODO: 범주형 변수때문에 통계 요약을 보낼지 고민해보기
        # cluster_summary = df_clustered.groupby("Cluster").mean().reset_index().to_dict(orient="records")

        # OpenAI API를 활용하여 클러스터링 분석 요청
        # openai_analysis = analyze_clusters_json(cluster_data)

        return {
            "message": "상품 클러스터링 완료",
            "optimal_k": best_k,
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

async def test_cluster_items():
        
    # 파일 경로 설정 및 데이터 로드
    script_dir = os.path.dirname(os.path.abspath(__file__))  
    temp_file = os.path.join(script_dir, "영수증 내역(1월~).xlsx") 
    result = await cluster_items(temp_file)

    # 결과 출력
    print("[TEST] 클러스터링 결과:", result)

async def test_preprocess():
    """preprocess_data 함수 테스트"""
    # 테스트용 파일 경로 설정
    script_dir = os.path.dirname(os.path.abspath(__file__))  
    temp_file = os.path.join(script_dir, "영수증 내역(1월~).xlsx") 

    # 데이터 읽기
    df = await read_file(temp_file)

    print("원본 데이터 샘플 (상위 5개):")
    print(df.head())

    # 데이터 전처리
    processed_df = await preprocess_data(df)

    print("\n전처리된 데이터 샘플 (상위 5개):")
    print(processed_df.head())

    print("\n전처리된 데이터 컬럼 목록:")
    print(processed_df.columns.tolist())

    print("\n전처리된 데이터 형태 (행, 열):", processed_df.shape)

# (python -m services.automl)
if __name__ == "__main__":
    asyncio.run(test_predict_sales())
    asyncio.run(test_cluster_items())
    # asyncio.run(test_preprocess())
    

