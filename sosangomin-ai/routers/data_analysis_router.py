# routers/data_analysis_router.py

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional
import os
import tempfile
import shutil
from datetime import datetime

from services.s3_service import (
    upload_file_to_s3, 
    download_file_from_s3, 
    get_s3_presigned_url,
)
from services.automl import predict_next_month_sales, perform_clustering, preprocess_data
import pandas as pd
import numpy as np
from database.mongo_connector import mongo_instance
from bson import ObjectId

router = APIRouter(
    prefix="/api/data-analysis",
    tags=["데이터 분석"]
)

TEMP_DIR = "temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/analyze-from-s3")
async def analyze_from_source_id(
    store_id: int = Form(...),
    source_id: str = Form(...), 
    analysis_type: str = Form(...),  # "sales_prediction" 또는 "clustering"
):
    """
    업로드된 파일의 source_id를 기준으로 S3 파일을 찾아 데이터 분석을 수행.
    """

    try:
        # 데이터 소스 정보 조회
        data_sources = mongo_instance.get_collection("DataSources")
        document = data_sources.find_one({"_id": ObjectId(source_id), "store_id": store_id, "status": "active"})

        if not document:
            raise HTTPException(status_code=404, detail="해당 store_id와 source_id에 해당하는 파일을 찾을 수 없습니다.")
        
        s3_key = document["file_path"]
        filename = document["original_filename"]

        # 파일 확장자 검사
        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".csv", ".xls", ".xlsx"]:
            raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일만 분석 가능합니다.")
        
        # S3에서 파일 다운로드
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_filename = f"{TEMP_DIR}/{timestamp}_{filename}"
        
        local_file_path = await download_file_from_s3(s3_key, temp_filename)

        # 분석 수행
        result = {}
        
        if analysis_type == "sales_prediction":
            result = await predict_next_month_sales(local_file_path)  
        
        elif analysis_type == "clustering":
            result = await perform_clustering(local_file_path)  

        else:
            raise HTTPException(status_code=400, detail="유효하지 않은 분석 유형입니다. 'sales_prediction' 또는 'clustering'을 선택하세요.")
        
        # 분석 결과 저장
        analysis_results = mongo_instance.get_collection("AnalysisResults")

        status = "fail" if "error" in result else "complete"

        analysis_document = {
            "source_id": ObjectId(source_id),
            "store_id": store_id,
            "analysis_type": analysis_type,
            "status": status,
            "result": result,
            "created_at": datetime.now()
        }

        analysis_results.insert_one(analysis_document)
        
        return {
            "message": "파일 분석이 완료되었습니다.",
            "store_id": store_id,
            "source_id": source_id,
            "s3_key": s3_key,
            "presigned_url": get_s3_presigned_url(s3_key),
            "analysis_type": analysis_type,
            "result": result
        }
    
    except Exception as e:        
        raise HTTPException(status_code=500, detail=f"데이터 분석 중 오류가 발생했습니다: {str(e)}")
    
    finally:
        # 임시 파일 삭제
        if local_file_path and os.path.exists(local_file_path):
            os.remove(local_file_path)