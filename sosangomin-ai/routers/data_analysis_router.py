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

router = APIRouter(
    prefix="/api/data-analysis",
    tags=["데이터 분석"]
)

TEMP_DIR = "temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/upload-and-analyze")
async def upload_and_analyze_data(
    file: UploadFile = File(...),
    store_id: int = Form(...),
    analysis_type: str = Form(...),  # "sales_prediction" 또는 "clustering"
):
    """
    파일을 업로드하고 S3에 저장한 후 데이터 분석을 수행합니다.
    """
    try:
        filename = file.filename
        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".csv", ".xls", ".xlsx"]:
            raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일을 업로드하세요.")
        
        s3_key = await upload_file_to_s3(file, store_id)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_filename = f"{TEMP_DIR}/{timestamp}_{filename}"
        
        await file.seek(0)
        
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        
        result = {}
        
        if analysis_type == "sales_prediction":
            with open(temp_filename, "rb") as f:
                file_like = UploadFile(filename=filename, file=f)
                result = await predict_next_month_sales(file_like)
        
        elif analysis_type == "clustering":
            with open(temp_filename, "rb") as f:
                file_like = UploadFile(filename=filename, file=f)
                result = await perform_clustering(file_like)
        
        else:
            raise HTTPException(status_code=400, detail="유효하지 않은 분석 유형입니다. 'sales_prediction' 또는 'clustering'을 선택하세요.")
        
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        
        return {
            "message": "파일 업로드 및 분석이 완료되었습니다.",
            "store_id": store_id,
            "filename": filename,
            "s3_key": s3_key,
            "presigned_url": get_s3_presigned_url(s3_key),
            "analysis_type": analysis_type,
            "result": result
        }
    
    except Exception as e:
        if 'temp_filename' in locals() and os.path.exists(temp_filename):
            os.remove(temp_filename)
        
        raise HTTPException(status_code=500, detail=f"데이터 분석 중 오류가 발생했습니다: {str(e)}")


@router.post("/analyze-from-s3")
async def analyze_from_s3(
    store_id: int = Form(...),
    s3_key: str = Form(...),
    analysis_type: str = Form(...),  # "sales_prediction" 또는 "clustering"
):
    """
    이미 S3에 저장된 파일을 불러와 데이터 분석을 수행합니다.
    """
    try:
        filename = s3_key.split("/")[-1]
        ext = os.path.splitext(filename)[1].lower()
        if ext not in [".csv", ".xls", ".xlsx"]:
            raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일만 분석 가능합니다.")
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        temp_filename = f"{TEMP_DIR}/{timestamp}_{filename}"
        
        local_file_path = await download_file_from_s3(s3_key, temp_filename)
        
        result = {}
        
        if analysis_type == "sales_prediction":
            with open(local_file_path, "rb") as f:
                file_like = UploadFile(filename=filename, file=f)
                result = await predict_next_month_sales(file_like)
        
        elif analysis_type == "clustering":
            with open(local_file_path, "rb") as f:
                file_like = UploadFile(filename=filename, file=f)
                result = await perform_clustering(file_like)
        
        else:
            raise HTTPException(status_code=400, detail="유효하지 않은 분석 유형입니다. 'sales_prediction' 또는 'clustering'을 선택하세요.")
        
        if os.path.exists(local_file_path):
            os.remove(local_file_path)
        
        return {
            "message": "S3 파일 분석이 완료되었습니다.",
            "store_id": store_id,
            "s3_key": s3_key,
            "presigned_url": get_s3_presigned_url(s3_key),
            "analysis_type": analysis_type,
            "result": result
        }
    
    except Exception as e:
        if 'local_file_path' in locals() and os.path.exists(local_file_path):
            os.remove(local_file_path)
        
        raise HTTPException(status_code=500, detail=f"데이터 분석 중 오류가 발생했습니다: {str(e)}")


