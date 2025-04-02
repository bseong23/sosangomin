# services/eda_service.py

import os
import logging
import pandas as pd
import numpy as np
import json
from datetime import datetime
from bson import ObjectId

from database.mongo_connector import mongo_instance
from services.s3_service import download_file_from_s3
from services.auto_analysis import autoanalysis_service
from services.auto_analysis_chat_service import autoanalysis_chat_service
from services.eda_chat_service import eda_chat_service

logger = logging.getLogger(__name__)

class EdaService:
    def __init__(self):
        self.temp_dir = "temp_files"
        os.makedirs(self.temp_dir, exist_ok=True)
    
    def generate_chart_data(self, df):
        """Chart.js에 적합한 데이터 구조 생성"""

        chart_data = {}
        
        # 1. 기본 통계량 계산
        total_sales = df['매출'].sum() if '매출' in df.columns else 0
        avg_transaction = df['매출'].mean() if '매출' in df.columns else 0
        total_transactions = len(df)
        unique_products = df['상품 명칭'].nunique() if '상품 명칭' in df.columns else 0
        
        # 기본 통계량
        chart_data["basic_stats"] = {
            "total_sales": float(total_sales),
            "avg_transaction": float(avg_transaction),
            "total_transactions": total_transactions,
            "unique_products": unique_products
        }
        
        # 2. 요일별 매출
        if '요일' in df.columns and '매출' in df.columns:
            day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            
            available_days = df['요일'].unique().tolist()
            logger.info(f"데이터에 존재하는 요일: {available_days}")
            
            weekday_sales = df.groupby('요일')['매출'].sum()
            
            weekday_sales_dict = {day: float(weekday_sales[day]) if day in weekday_sales else 0 for day in day_order}
            chart_data["weekday_sales"] = weekday_sales_dict
        
        # 3. 시간대별 매출
        if '시간대' in df.columns and '매출' in df.columns:
            time_period_dict = df.groupby('시간대')['매출'].sum().to_dict()
            chart_data["time_period_sales"] = time_period_dict
        
        # 4. 시간별 매출
        if '시' in df.columns and '매출' in df.columns:
            hourly_dict = df.groupby('시')['매출'].sum().to_dict()
            chart_data["hourly_sales"] = {str(k): float(v) for k, v in hourly_dict.items()}
        
        # 5. 상위 상품
        if '상품 명칭' in df.columns and '매출' in df.columns:
            top_products_dict = df.groupby('상품 명칭')['매출'].sum().sort_values(ascending=False).head(5).to_dict()
            chart_data["top_products"] = top_products_dict
        
        # 6. 평일/휴일 매출
        if '공휴일' in df.columns and '매출' in df.columns:
            holiday_dict = df.groupby('공휴일')['매출'].sum().to_dict()
            chart_data["holiday_sales"] = holiday_dict
        
        # 7. 계절별 매출
        if '계절' in df.columns and '매출' in df.columns:
            season_dict = df.groupby('계절')['매출'].sum().to_dict()
            chart_data["season_sales"] = season_dict
        
        # 9. 고객당 평균 매출
        if '고객 수' in df.columns and '매출' in df.columns and df['고객 수'].sum() > 0:
            customer_avg = df['매출'].sum() / df['고객 수'].sum()
            chart_data["basic_stats"]["customer_avg"] = float(customer_avg)
        
        # 11. 날씨와 매출의 상관관계
        if all(col in df.columns for col in ['매출', '기온', '강수량', '습도']):
            # 기온별 매출 분석 (5도 단위로 구간화)
            df['기온_구간'] = (df['기온'] // 5) * 5
            temp_sales_dict = df.groupby('기온_구간')['매출'].sum().to_dict()
            chart_data["temperature_sales"] = {f"{int(k)}~{int(k)+5}°C": float(v) for k, v in temp_sales_dict.items()}
            
            # 강수량 유무에 따른 매출 분석
            df['비_여부'] = df['강수량'].apply(lambda x: '비/눈' if x > 0 else '맑음')
            rain_sales_dict = df.groupby('비_여부')['매출'].sum().to_dict()
            chart_data["weather_sales"] = rain_sales_dict
        
        # 12. 요일 + 시간대 교차 분석
        if all(col in df.columns for col in ['요일', '시간대', '매출']):
            cross_dict = df.pivot_table(index='요일', columns='시간대', values='매출', aggfunc='sum').fillna(0).to_dict()
            chart_data["weekday_time_sales"] = {k: {str(inner_k): float(inner_v) for inner_k, inner_v in v.items()} 
                                            for k, v in cross_dict.items()}
        
        # 13. 월별 매출 추세
        if '월' in df.columns and '매출' in df.columns:
            month_order = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
            monthly_sales = df.groupby('월')['매출'].sum()
            monthly_dict = {month: float(monthly_sales[month]) if month in monthly_sales else 0 for month in month_order}
            chart_data["monthly_sales"] = monthly_dict
        
        # 14. 상품별 판매 비중
        if '상품 명칭' in df.columns and '수량' in df.columns:
            product_qty = df.groupby('상품 명칭')['수량'].sum()
            total_qty = product_qty.sum()
            
            # 상위 10개 품목과 기타로 분류
            top_products = product_qty.sort_values(ascending=False).head(10)
            others = pd.Series([product_qty.sum() - top_products.sum()], index=['기타 상품'])
            
            product_share = pd.concat([top_products, others]) / total_qty * 100
            product_share_dict = product_share.to_dict()
            chart_data["product_share"] = {str(k): float(v) for k, v in product_share_dict.items()}
        
        # 15. 구매 금액대별 거래 건수
        if '매출' in df.columns:
            # 거래별 합계를 계산 (같은 전표 번호끼리 합산)
            if '전표 번호' in df.columns:
                transaction_amounts = df.groupby('전표 번호')['매출'].sum()
                
                # 금액대별 분류
                bins = [0, 10000, 20000, 30000, 50000, 100000, float('inf')]
                labels = ['1만원 미만', '1~2만원', '2~3만원', '3~5만원', '5~10만원', '10만원 이상']
                
                transaction_ranges = pd.cut(transaction_amounts, bins=bins, labels=labels)
                transaction_counts = transaction_ranges.value_counts().to_dict()
                
                chart_data["transaction_amounts"] = {str(k): int(v) for k, v in transaction_counts.items()}
        
        return chart_data
    
    async def perform_eda(self, store_id, source_ids, pos_type="키움"):
        """여러 데이터소스에 대한 EDA 및 자동 분석을 수행하고 결과를 MongoDB에 저장"""
        try:
            data_sources = mongo_instance.get_collection("DataSources")
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            
            preprocessed_data = []
            local_files = []
            
            for source_id in source_ids:
                source = data_sources.find_one({"_id": ObjectId(source_id), "store_id": store_id, "status": "active"})
                
                if not source:
                    raise ValueError(f"ID가 {source_id}인 유효한 데이터소스를 찾을 수 없습니다.")
                
                s3_key = source.get("file_path")
                if not s3_key:
                    raise ValueError(f"소스 {source_id}의 파일 경로 정보가 없습니다.")
                
                filename = source.get("original_filename") or s3_key.split("/")[-1]
                    
                temp_path = os.path.join(self.temp_dir, f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}")
                
                local_path = await download_file_from_s3(s3_key, temp_path)
                local_files.append(local_path)
                
                try:
                    file_ext = os.path.splitext(filename)[1].lower()
                    if file_ext == '.xlsx' or file_ext == '.xls':
                        df = pd.read_excel(local_path, header=2, engine='openpyxl')
                    elif file_ext == '.csv':
                        df = pd.read_csv(local_path, header=2)
                    else:
                        raise ValueError(f"지원하지 않는 파일 형식입니다: {file_ext}")

            
                    df = await autoanalysis_service.preprocess_data(df, pos_type)
                    logger.info(f"전처리 완료: 행 수={df.shape[0]}, 열 수={df.shape[1]}")
                    logger.info(f"전처리 후 열: {df.columns.tolist()}")
                    logger.info(f"'매출' 열 존재 여부: {'매출' in df.columns}")
                    df['source_id'] = source_id
                    
                    preprocessed_data.append(df)
                    
                except Exception as e:
                    raise ValueError(f"파일 {filename} 처리 중 오류 발생: {str(e)}")
            
            if not preprocessed_data:
                raise ValueError("처리할 유효한 데이터 소스가 없습니다.")
            
            combined_df = pd.concat(preprocessed_data, ignore_index=True)
            print(combined_df)
            chart_data = self.generate_chart_data(combined_df)
            
            eda_result_data = {}
            for chart_type, data in chart_data.items():
                if not data:  
                    continue
                
                summary = await eda_chat_service.generate_chart_summary(chart_type, data)
                
                eda_result_data[chart_type] = {
                    "data": data,
                    "summary": summary
                }
            
            overall_summary = await eda_chat_service.generate_overall_summary(chart_data)
            
            predict_result = await autoanalysis_service.predict_next_30_sales(combined_df)
            raw_predictions = predict_summary.get("predictions", [])
            predict_value = {
                "날짜": [item["날짜"] for item in raw_predictions],
                "예측 매출": [item["예측 매출"] for item in raw_predictions]
            }
            cluster_result = await autoanalysis_service.cluster_items(combined_df)
            cluster_value = cluster_result["clusters"]
            
            predict_summary = await autoanalysis_chat_service.generate_sales_predict_summary(predict_result)
            cluster_summary = await autoanalysis_chat_service.generate_cluster_summary(cluster_result)
            
            result_doc = {
                "_id": ObjectId(),
                "store_id": store_id,
                "source_ids": [ObjectId(sid) for sid in source_ids],
                "analysis_type": "combined_analysis",  
                "created_at": datetime.now(),
                "status": "completed",
                "eda_result": {
                    "result_data": eda_result_data,
                    "summary": overall_summary
                },
                "auto_analysis_results": {
                    "predict": predict_value,
                    "cluster": cluster_value,
                    "summaries": {
                        "predict_summary": predict_summary,
                        "cluster_summary": cluster_summary
                    }
                }
            }
            
            result_id = analysis_results.insert_one(result_doc).inserted_id
            
            data_sources.update_many(
                {"_id": {"$in": [ObjectId(sid) for sid in source_ids]}},
                {"$set": {"last_analyzed": datetime.now()}}
            )
            
            return {
                "status": "success",
                "store_id": store_id,
                "message": "종합 분석이 완료되었습니다.",
                "analysis_id": str(result_id),
                "source_ids": source_ids,
                "eda_results": {
                    "result_data": eda_result_data,
                    "summary": overall_summary
                },
                "auto_analysis_results": {
                    "predict": predict_value,
                    "cluster": cluster_value,
                    "summaries": {
                        "predict_summary": predict_summary,
                        "cluster_summary": cluster_summary
                    }
                }
            }
            
        except Exception as e:
            logger.error(f"종합 분석 중 오류: {str(e)}")
            raise ValueError(f"종합 분석에 실패했습니다: {str(e)}")
        
        finally:
            for path in local_files:
                if os.path.exists(path):
                    os.remove(path)
    # async def perform_eda(self,store_id, source_id):
    #     """데이터소스에 대한 EDA를 수행하고 결과를 MongoDB에 저장"""
    #     try:
    #         data_sources = mongo_instance.get_collection("DataSources")
    #         source = data_sources.find_one({"_id": ObjectId(source_id)})
            
    #         if not source:
    #             raise ValueError(f"ID가 {source_id}인 데이터소스를 찾을 수 없습니다.")
            
    #         s3_key = source.get("file_path")
    #         if not s3_key:
    #             raise ValueError("파일 경로 정보가 없습니다.")
            
    #         filename = source.get("original_filename")
    #         if not filename:
    #             filename = s3_key.split("/")[-1]
                
    #         temp_path = os.path.join(self.temp_dir, f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}")
            
    #         local_path = await download_file_from_s3(s3_key, temp_path)
            
    #         try:
    #             file_ext = os.path.splitext(filename)[1].lower()
    #             if file_ext == '.xlsx' or file_ext == '.xls':
    #                 df = pd.read_excel(local_path, header=2)
    #             elif file_ext == '.csv':
    #                 df = pd.read_csv(local_path, header=2)
    #             else:
    #                 raise ValueError(f"지원하지 않는 파일 형식입니다: {file_ext}")

    #             df = AutoAnalysisService.preprocess_data(df)

    #             chart_data = self.generate_chart_data(df)
                
    #             result_data = {}
    #             for chart_type, data in chart_data.items():
    #                 if not data:  
    #                     continue
                    
    #                 summary = await eda_chat_service.generate_chart_summary(chart_type, data)
                    
    #                 result_data[chart_type] = {
    #                     "data": data,
    #                     "summary": summary
    #                 }
                
    #             overall_summary = await eda_chat_service.generate_overall_summary(chart_data)
                
    #             analysis_results = mongo_instance.get_collection("AnalysisResults")
                
    #             result_doc = {
    #                 "_id": ObjectId(),
    #                 'store_id': store_id,
    #                 "source_id": ObjectId(source_id),
    #                 "analysis_type": "eda",  
    #                 "created_at": datetime.now(),
    #                 "status": "completed",
    #                 "result_data": result_data,  
    #                 "summary": overall_summary   
    #             }
                
    #             result_id = analysis_results.insert_one(result_doc).inserted_id
                
    #             data_sources.update_one(
    #                 {"_id": ObjectId(source_id)},
    #                 {"$set": {"last_analyzed": datetime.now()}}
    #             )
                
    #             return {
    #                 "status": "success",
    #                 'store_id': store_id,
    #                 "message": "EDA 분석이 완료되었습니다.",
    #                 "analysis_id": str(result_id),
    #                 "source_id": source_id,
    #                 "result_data": result_data,
    #                 "summary": overall_summary
    #             }
                
    #         finally:
    #             if os.path.exists(local_path):
    #                 os.remove(local_path)
        
    #     except Exception as e:
    #         logger.error(f"EDA 분석 중 오류: {str(e)}")
    #         raise ValueError(f"EDA 분석에 실패했습니다: {str(e)}")
    
    async def get_eda_result(self, analysis_id):
        """특정 분석 결과를 조회"""
        try:
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            result = analysis_results.find_one({
                "_id": ObjectId(analysis_id),
                "analysis_type": "combined_analysis" 
            })
            
            if not result:
                raise ValueError(f"ID가 {analysis_id}인 EDA 결과를 찾을 수 없습니다.")
            
            result["_id"] = str(result["_id"])
            result["source_ids"] = str(result["source_ids"])
            
            return {
                "status": "success",
                "analysis_result": result
            }
        
        except Exception as e:
            logger.error(f"EDA 결과 조회 중 오류: {str(e)}")
            raise ValueError(f"EDA 결과 조회에 실패했습니다: {str(e)}")
    
    async def get_eda_results_by_source(self, source_id):
        """특정 데이터소스의 모든 분석석 결과를 조회"""
        try:
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            cursor = analysis_results.find({
                "source_id": ObjectId(source_id)
            }).sort("created_at", -1)
            
            results = []
            for result in cursor:
                result["_id"] = str(result["_id"])
                result["source_ids"] = str(result["source_ids"])
                results.append(result)
            
            return {
                "status": "success",
                "count": len(results),
                "eda_results": results
            }
        
        except Exception as e:
            logger.error(f"EDA 결과 목록 조회 중 오류: {str(e)}")
            raise ValueError(f"EDA 결과 목록 조회에 실패했습니다: {str(e)}")

eda_service = EdaService()