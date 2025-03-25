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
from services.auto_analysis import AutoAnalysisService
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
        total_sales = df['총매출'].sum() if '총매출' in df.columns else 0
        avg_transaction = df['총매출'].mean() if '총매출' in df.columns else 0
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
        if '요일' in df.columns and '총매출' in df.columns:
            weekday_sales_dict = df.groupby('요일')['총매출'].sum().to_dict()
            chart_data["weekday_sales"] = weekday_sales_dict
        
        # 3. 시간대별 매출
        if '시간대' in df.columns and '총매출' in df.columns:
            time_period_dict = df.groupby('시간대')['총매출'].sum().to_dict()
            chart_data["time_period_sales"] = time_period_dict
        
        # 4. 시간별 매출
        if '시' in df.columns and '총매출' in df.columns:
            hourly_dict = df.groupby('시')['총매출'].sum().to_dict()
            chart_data["hourly_sales"] = {str(k): float(v) for k, v in hourly_dict.items()}
        
        # 5. 상위 상품
        if '상품 명칭' in df.columns and '총매출' in df.columns:
            top_products_dict = df.groupby('상품 명칭')['총매출'].sum().sort_values(ascending=False).head(5).to_dict()
            chart_data["top_products"] = top_products_dict
        
        # 6. 평일/휴일 매출
        if '공휴일' in df.columns and '총매출' in df.columns:
            holiday_dict = df.groupby('공휴일')['총매출'].sum().to_dict()
            chart_data["holiday_sales"] = holiday_dict
        
        # 7. 계절별 매출
        if '계절' in df.columns and '총매출' in df.columns:
            season_dict = df.groupby('계절')['총매출'].sum().to_dict()
            chart_data["season_sales"] = season_dict
        
        # 8. 일자별 매출
        if all(col in df.columns for col in ['년', '월', '일']) and '총매출' in df.columns:
            try:
                df['날짜'] = pd.to_datetime(df[['년', '월', '일']])
                daily_dict = df.groupby(df['날짜'].dt.date)['총매출'].sum().to_dict()
                chart_data["daily_sales"] = {str(k): float(v) for k, v in daily_dict.items()}
            except:
                pass
        
        # 9. 고객당 평균 매출
        if '고객 수' in df.columns and '총매출' in df.columns and df['고객 수'].sum() > 0:
            customer_avg = df['총매출'].sum() / df['고객 수'].sum()
            chart_data["basic_stats"]["customer_avg"] = float(customer_avg)
            
        return chart_data
    
    async def perform_eda(self,store_id, source_id):
        """데이터소스에 대한 EDA를 수행하고 결과를 MongoDB에 저장"""
        try:
            data_sources = mongo_instance.get_collection("DataSources")
            source = data_sources.find_one({"_id": ObjectId(source_id)})
            
            if not source:
                raise ValueError(f"ID가 {source_id}인 데이터소스를 찾을 수 없습니다.")
            
            s3_key = source.get("file_path")
            if not s3_key:
                raise ValueError("파일 경로 정보가 없습니다.")
            
            filename = source.get("original_filename")
            if not filename:
                filename = s3_key.split("/")[-1]
                
            temp_path = os.path.join(self.temp_dir, f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}")
            
            local_path = await download_file_from_s3(s3_key, temp_path)
            
            try:
                file_ext = os.path.splitext(filename)[1].lower()
                if file_ext == '.xlsx' or file_ext == '.xls':
                    df = pd.read_excel(local_path, header=2)
                elif file_ext == '.csv':
                    df = pd.read_csv(local_path, header=2)
                else:
                    raise ValueError(f"지원하지 않는 파일 형식입니다: {file_ext}")

                df = AutoAnalysisService.preprocess_data(df)

                chart_data = self.generate_chart_data(df)
                
                result_data = {}
                for chart_type, data in chart_data.items():
                    if not data:  
                        continue
                    
                    summary = await eda_chat_service.generate_chart_summary(chart_type, data)
                    
                    result_data[chart_type] = {
                        "data": data,
                        "summary": summary
                    }
                
                overall_summary = await eda_chat_service.generate_overall_summary(chart_data)
                
                analysis_results = mongo_instance.get_collection("AnalysisResults")
                
                result_doc = {
                    "_id": ObjectId(),
                    'store_id': store_id,
                    "source_id": ObjectId(source_id),
                    "analysis_type": "eda",  
                    "created_at": datetime.now(),
                    "status": "completed",
                    "result_data": result_data,  
                    "summary": overall_summary   
                }
                
                result_id = analysis_results.insert_one(result_doc).inserted_id
                
                data_sources.update_one(
                    {"_id": ObjectId(source_id)},
                    {"$set": {"last_analyzed": datetime.now()}}
                )
                
                return {
                    "status": "success",
                    'store_id': store_id,
                    "message": "EDA 분석이 완료되었습니다.",
                    "analysis_id": str(result_id),
                    "source_id": source_id,
                    "result_data": result_data,
                    "summary": overall_summary
                }
                
            finally:
                if os.path.exists(local_path):
                    os.remove(local_path)
        
        except Exception as e:
            logger.error(f"EDA 분석 중 오류: {str(e)}")
            raise ValueError(f"EDA 분석에 실패했습니다: {str(e)}")
    
    async def get_eda_result(self, analysis_id):
        """특정 EDA 결과를 조회"""
        try:
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            result = analysis_results.find_one({
                "_id": ObjectId(analysis_id),
                "analysis_type": "eda" 
            })
            
            if not result:
                raise ValueError(f"ID가 {analysis_id}인 EDA 결과를 찾을 수 없습니다.")
            
            result["_id"] = str(result["_id"])
            result["source_id"] = str(result["source_id"])
            
            return {
                "status": "success",
                "analysis_result": result
            }
        
        except Exception as e:
            logger.error(f"EDA 결과 조회 중 오류: {str(e)}")
            raise ValueError(f"EDA 결과 조회에 실패했습니다: {str(e)}")
    
    async def get_eda_results_by_source(self, source_id):
        """특정 데이터소스의 모든 EDA 결과를 조회"""
        try:
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            cursor = analysis_results.find({
                "source_id": ObjectId(source_id),
                "analysis_type": "eda"  
            }).sort("created_at", -1)
            
            results = []
            for result in cursor:
                result["_id"] = str(result["_id"])
                result["source_id"] = str(result["source_id"])
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