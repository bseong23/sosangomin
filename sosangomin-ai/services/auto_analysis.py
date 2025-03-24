# sevices/auto_analysis.py

import os
import sys
import logging
import pandas as pd
import numpy as np
from datetime import datetime
from bson import ObjectId
import holidays  
from prophet import Prophet
from pmdarima import auto_arima
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error, silhouette_score
from weather_service import weather_service

from database.mongo_connector import mongo_instance
from services.s3_service import download_file_from_s3
from services.auto_analysis_chat_service import autoanalysis_chat_service

# 우선 키움 페이 포스기 데이터를 기준으로 작성하였음.
logger = logging.getLogger(__name__)

class AutoAnalysisService: 
    def __init__(self): 
        self.temp_dir = "temp_files"
        os.makedirs(self.temp_dir, exist_ok=True)

    async def read_file(self, temp_file: str, pos_type: str = "키움") -> pd.DataFrame:
        """파일 확장자에 따른 데이터 읽기"""
        ext = os.path.splitext(temp_file)[1].lower()
        start = 2 if pos_type == "키움" else 0
        if ext == ".csv":
            return pd.read_csv(temp_file, header=start)
        elif ext in [".xls", ".xlsx"]:
            return pd.read_excel(temp_file, header=start)
        else:
            raise ValueError("지원되지 않는 파일 형식입니다. CSV 또는 Excel만 가능합니다.")

    async def preprocess_data(self, df: pd.DataFrame, pos_type: str = "키움") -> pd.DataFrame:
        """데이터 전처리 및 시간 변수 생성"""
        try:
            # TODO : 현재 직접적인 변수명을 사용한 부분이 있는데 일반화를 할지 고민
            
            if pos_type == "키움":

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
            
            elif pos_type == "토스":

                # 필요 변수 추출 및 변수명 통일 
                df = df[['주문시작시각', '상품명', '수량', '상품가격']]
                df = df.rename(columns={'주문시작시각':'매출 일시', '상품명':'상품 명칭', '상품가격':'단가'})
                df['매출'] = df['수량'] * df['단가']
                df = df.drop(index=0).reset_index(drop=True)

                # 전처리 
                df = (
                    df.dropna(axis=0, how='all')  # 모든 값이 NaN인 행 제거
                    .dropna(axis=1, how='all')  # 모든 값이 NaN인 열 제거
                    .loc[:, df.nunique() > 1]  # 고유값 1개 이하인 열 제거
                    .T.drop_duplicates().T    # 중복 열 제거
                )

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
        
        except Exception as e:
            return {"message": "데이터 전처리 중 오류 발생",
                    "error": str(e)}

    def find_best_k(self, data: pd.DataFrame, k_min: int = 2, k_max: int = 10) -> int:
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

    def find_best_k_elbow(self, data: pd.DataFrame, k_min: int = 2, k_max: int = 10) -> int:
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

    async def predict_next_30_sales(self, df: pd.DataFrame, model_type="Prophet"): # predict_next_30_sales(temp_file: str):
        """향후 30일 매출 예측"""
        try:
            # 날짜, 매출만 추출
            df['매출 일시'] = pd.to_datetime(df['매출 일시'])
            sales_df = df[['매출 일시', '매출']].copy()

            # 일별 매출 집계 
            daily_sales_df = sales_df.groupby(sales_df['매출 일시'].dt.date).agg({'매출': 'sum'}).reset_index()
            daily_sales_df = daily_sales_df.rename(columns={'매출 일시': '날짜'})

            # 누락된 날짜 채우기
            date_range = pd.date_range(daily_sales_df['날짜'].min(), daily_sales_df['날짜'].max(), freq='D')
            daily_sales_df = daily_sales_df.set_index('날짜').reindex(date_range, fill_value=1000).rename_axis('날짜').reset_index()

            # 요일 변수 추가 (One-Hot Encoding)
            # daily_sales_df['요일'] = daily_sales_df['날짜'].dt.day_name()
            # enc = OneHotEncoder(sparse_output=False, drop='first') 
            # weekday_encoded = enc.fit_transform(daily_sales_df[['요일']])
            # weekday_df = pd.DataFrame(weekday_encoded, columns=enc.get_feature_names_out(['요일']))
            # daily_sales_df = pd.concat([daily_sales_df, weekday_df], axis=1).drop(columns=['요일'])

            # # 공휴일 변수 추가
            # kr_holidays = holidays.KR()
            # daily_sales_df['공휴일'] = daily_sales_df['날짜'].apply(lambda x: 1 if x in kr_holidays else 0)

            # 학습 데이터 분할 (성능 평가용)
            train_df = daily_sales_df.iloc[:-30]  # 학습 데이터
            test_df = daily_sales_df.iloc[-30:]   # 테스트 데이터 (성능 평가용)

            ### 모델 학습 & 성능 평가 ###
            if model_type.lower() == "prophet":
                df_prophet = train_df.rename(columns={'날짜': 'ds', '매출': 'y'})
                test_df_prophet = test_df.rename(columns={'날짜': 'ds'})

                model = Prophet()
                # model = Prophet(yearly_seasonality=True, weekly_seasonality=True) # seasonality_mode='multiplicative')
                
                # 추가 요인 반영
                # for col in weekday_df.columns: 
                #     model.add_regressor(col)
                # model.add_regressor('공휴일')

                model.fit(df_prophet)

                # 성능 평가용 예측 (마지막 30일)
                test_future = test_df_prophet.copy()
                predict_test = model.predict(test_future)
                test_predictions = predict_test[['ds', 'yhat']].rename(columns={'ds': '날짜', 'yhat': '예측 매출'})
                
                # 성능 평가 (MAPE, RMSE)
                y_true = test_df['매출'].values
                y_pred = test_predictions.loc[test_predictions['날짜'].isin(test_df['날짜'])]['예측 매출'].values
                mape_score = mean_absolute_percentage_error(y_true, y_pred)
                rmse_score = mean_squared_error(y_true, y_pred) ** 0.5 

            elif model_type.lower() == "autoarima":
                train_data = train_df.set_index('날짜')['매출']
                test_data = test_df.set_index('날짜')['매출']

                model = auto_arima(train_data, seasonal=False, stepwise=True, trace=True)
                predict_test = model.predict(n_periods=30)

                # 성능 평가 (MAPE, RMSE)
                y_true = test_data.values
                y_pred = predict_test
                mape_score = mean_absolute_percentage_error(y_true, y_pred)
                rmse_score = mean_squared_error(y_true, y_pred) ** 0.5 

            else:
                raise ValueError("지원되지 않는 모델 유형입니다. 'Prophet' 또는 'AutoARIMA'를 선택하세요.")

            ### 모든 데이터 사용하여 30일 예측 ###
            full_train_df = daily_sales_df.copy()  # 모든 데이터를 학습에 사용

            if model_type.lower() == "prophet":
                full_df_prophet = full_train_df.rename(columns={'날짜': 'ds', '매출': 'y'})
                
                final_model = Prophet()
                # final_model = Prophet(yearly_seasonality=True, weekly_seasonality=True) # seasonality_mode='multiplicative')
                # for col in weekday_df.columns:
                #     final_model.add_regressor(col)
                # final_model.add_regressor('공휴일')

                final_model.fit(full_df_prophet)

                # 향후 30일 예측
                future = final_model.make_future_dataframe(periods=30)
                print("학습 데이터 시작")
                print(full_df_prophet.head())
                print(full_df_prophet.tail())
                print(future)
                # future['요일'] = future['ds'].dt.day_name()
                # weekday_encoded_future = enc.transform(future[['요일']]) 
                # weekday_df_future = pd.DataFrame(weekday_encoded_future, columns=enc.get_feature_names_out(['요일']))
                # future = pd.concat([future, weekday_df_future], axis=1).drop(columns=['요일'])
                # future['공휴일'] = future['ds'].apply(lambda x: 1 if x in kr_holidays else 0) 

                final_predict = final_model.predict(future)
                predict_df = final_predict[['ds', 'yhat']].rename(columns={'ds': '날짜', 'yhat': '예측 매출'})
                # last_train_date = full_df_prophet['ds'].max()
                # predict_df = predict_df[predict_df['날짜'] > last_train_date]

                seasonal_effects = final_predict[['ds', 'trend']] #, 'yearly', 'weekly']]
                seasonal_effects = seasonal_effects.rename(columns={'ds': '날짜'})
                
            
            elif model_type.lower() == "autoarima":
                full_train_data = full_train_df.set_index('날짜')['매출']

                final_model = auto_arima(full_train_data, seasonal=False, stepwise=True, trace=True)
                final_predict = final_model.predict(n_periods=30)

                # 최종 예측 데이터프레임 생성
                predict_df = pd.DataFrame({
                    '날짜': pd.date_range(start=full_train_df['날짜'].max() + pd.Timedelta(days=1), periods=30, freq='D'),
                    '예측 매출': final_predict
                })

            # 날짜 형식 변환
            predict_df['날짜'] = predict_df['날짜'].dt.strftime('%Y%m%d')
            predict_df['예측 매출'] = predict_df['예측 매출'].round(2)

            # 예측 전 30일 실제 매출 데이터
            recent_30_df = predict_df.iloc[-60:-30]

            # 예측 마지막 30일만 분리
            forecast_30 = predict_df.tail(30)

            # 요약 계산
            total_sales = forecast_30["예측 매출"].sum()
            max_row = forecast_30.loc[forecast_30["예측 매출"].idxmax()]
            min_row = forecast_30.loc[forecast_30["예측 매출"].idxmin()]

            return {
                "message": "향후 30일 매출 예측 완료",

                "previous_30_days": recent_30_df.to_dict(orient='records'), # 예측 전 30일 실제 매출 데이터 (날짜, 매출)

                "predictions": forecast_30.to_dict(orient='records'),  # 날짜별 예측값 (LLM이 추세 파악 가능)

                "summary": {
                    "total_sales": float(total_sales),
                    "average_daily_sales": round(total_sales / 30, 2),
                    "max_sales": {
                        "date": str(max_row["날짜"]),
                        "value": float(max_row["예측 매출"])
                    },
                    "min_sales": {
                        "date": str(min_row["날짜"]),
                        "value": float(min_row["예측 매출"])
                    }
                },

                "performance": {
                    "mape": round(mape_score, 4),
                    "rmse": round(rmse_score, 4)
                },

                "seasonal_trend": seasonal_effects.to_dict(orient='records')  # trend column은 그대로
            }
        except Exception as e:
            return {"error": str(e)}

    async def cluster_items(self, df: pd.DataFrame):
        """상품 클러스터링"""
        try:
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
            best_k = self.find_best_k(X_scaled)

            # KMeans 클러스터링 수행
            kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
            final_df['Cluster'] = kmeans.fit_predict(X_scaled)

            # 클러스터별 통계 요약 + 대표 상품 추출 # TODO: 범주형 변수때문에 통계 요약을 보낼지 고민해보기
            cluster_summary_df = final_df.groupby("Cluster").agg({
                    "매출": "mean",
                    "수량": "mean",
                    "단가": "mean"
                }).reset_index()
            
            representative_items = (
                final_df.groupby("Cluster")
                .apply(lambda x: x.sort_values("매출", ascending=False)["상품 명칭"].head(3).tolist())
                .reset_index()
                .rename(columns={0: "representative_items"})
            )
            cluster_summary = pd.merge(cluster_summary_df, representative_items, on="Cluster")
            cluster_output = cluster_summary.to_dict(orient="records")

            # 클러스터링 결과 데이터
            clusters = final_df[['상품 명칭', 'Cluster']].to_dict(orient="records")
            clusters_full = final_df.to_dict(orient="records")

            # OpenAI API를 활용하여 클러스터링 분석 요청
            # openai_analysis = analyze_clusters_json(cluster_data)

            return {
                "message": "상품 클러스터링 완료",
                "optimal_k": best_k,
                "clusters": clusters,
                "cluster_summary": cluster_output,
                "clusters_full": clusters_full,
            }
        
        except Exception as e:
            return {"error": str(e)}

    async def perform_analyze_local(self, local_file_paths: list, store_id: int = 9999):
        """
        로컬 엑셀 파일 리스트를 받아서 S3 없이 자동 분석 수행 (테스트용)
        """
        try:
            preprocessed_data = []

            for path in local_file_paths:
                script_dir = os.path.dirname(os.path.abspath(__file__))  
                path = os.path.join(script_dir, path)
                df = await self.read_file(path)
                df = await self.preprocess_data(df)
                preprocessed_data.append(df)

            combined_df = pd.concat(preprocessed_data, ignore_index=True)

            # 예측 & 클러스터링
            predict_result = await self.predict_next_30_sales(combined_df)
            cluster_result = await self.cluster_items(combined_df)

            # 요약
            predict_summary = await autoanalysis_chat_service.generate_sales_predict_summary(predict_result)
            cluster_summary = await autoanalysis_chat_service.generate_cluster_summary(cluster_result)

            return {
                "status": "success",
                "store_id": store_id,
                "results": {
                    "predict": predict_result,
                    "cluster": cluster_result
                },
                "summaries": {
                    "predict_summary": predict_summary,
                    "cluster_summary": cluster_summary
                }
            }
        
        except Exception as e:
            logger.error(f"분석 중 오류 발생: {str(e)}")
            raise ValueError(f"분석 실패: {str(e)}")

    
    async def perform_analyze(self, store_id, source_ids, pos_type):
        """여러 source_id의 파일을 분석하여 예측 + 클러스터링 결과를 반환 및 저장"""
        try:
            data_sources = mongo_instance.get_collection("DataSources")
            analysis_results = mongo_instance.get_collection("AnalysisResults")

            preprocessed_data = []
            local_files = []
            s3_keys = []

            for source_id in source_ids:
                source = data_sources.find_one({"_id": ObjectId(source_id), "store_id": store_id, "status": "active"})

                if not source:
                    raise ValueError(f"ID가 {source_id}인 유효한 데이터소스를 찾을 수 없습니다.")

                s3_key = source.get("file_path")
                filename = source.get("original_filename") or s3_key.split("/")[-1]
                s3_keys.append(s3_key)

                temp_path = os.path.join(self.temp_dir, f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}")
                local_path = await download_file_from_s3(s3_key, temp_path)
                local_files.append(local_path)

                df = await self.read_file(local_path, pos_type)
                df = await self.preprocess_data(df, pos_type)
                preprocessed_data.append(df)

            # 모든 전처리된 데이터 병합
            combined_df = pd.concat(preprocessed_data, ignore_index=True)

            # 분석 실행
            predict_result = await self.predict_next_30_sales(combined_df)
            cluster_result = await self.cluster_items(combined_df)

            # 요약 생성 추가
            predict_summary = await autoanalysis_chat_service.generate_sales_predict_summary(predict_result)
            cluster_summary = await autoanalysis_chat_service.generate_cluster_summary(cluster_result)

            status = "fail" if ("error" in predict_result or "error" in cluster_result) else "completed"

            result_doc = {
                "_id": ObjectId(),
                "store_id": store_id,
                "source_ids": [ObjectId(sid) for sid in source_ids],
                "analysis_type": "autoanalysis",
                "status": status,
                "created_at": datetime.now(),
                "results": {
                    "predict": predict_result,
                    "cluster": cluster_result
                },
                "summaries": {
                    "predict_summary": predict_summary,
                    "cluster_summary": cluster_summary
                }
            }

            result_id = analysis_results.insert_one(result_doc).inserted_id

            data_sources.update_many(
                {"_id": {"$in": [ObjectId(sid) for sid in source_ids]}},
                {"$set": {"last_analyzed": datetime.now()}}
            )

            print()

            return {
                "status": "success",
                "message": "AutoAnalysis 분석이 완료되었습니다.",
                "result_id": str(result_id),
                "store_id": store_id,
                "source_ids": source_ids,
                "s3_keys": s3_keys,
                "results": {
                    "predict": predict_result,
                    "cluster": cluster_result
                },
                "summaries": {
                    "predict_summary": predict_summary,
                    "cluster_summary": cluster_summary
                }
            }

        except Exception as e:
            logger.error(f"분석 중 오류 발생: {str(e)}")
            raise ValueError(f"분석 실패: {str(e)}")

        finally:
            for path in local_files:
                if os.path.exists(path):
                    os.remove(path)

autoanalysis_service = AutoAnalysisService()


import asyncio
# from services.automl import AutoAnalysisService

async def test_local_auto_analysis():
    service = AutoAnalysisService()

    # 파일 경로 설정 및 데이터 로드
    # script_dir = os.path.dirname(os.path.abspath(__file__))  
    # temp_file = os.path.join(script_dir, "영수증 내역(1월~).xlsx")

    # 테스트할 로컬 파일 리스트
    local_file_paths = [
        "영수증 내역(1월~).xlsx"
    ]
    

    result = await service.perform_analyze_local(local_file_paths)
    
    print("✅ 자동 분석 수행 완료")
    print("🔸 예측 요약:", result["summaries"]["predict_summary"])
    print("🔸 클러스터 요약:", result["summaries"]["cluster_summary"])
    print("🔸 예측 결과 일부:", result["results"]["predict"]["predictions"][:3])
    print("🔸 클러스터 결과 일부:", result["results"]["cluster"]["clusters"][:3])

if __name__ == "__main__":
    asyncio.run(test_local_auto_analysis())
