# routers/data_analysis_router.py

from fastapi import APIRouter, Form, HTTPException
import os
import pandas as pd
from datetime import datetime
from bson import ObjectId
from typing import List
from database.mongo_connector import mongo_instance
from services.s3_service import (
    download_file_from_s3, 
    get_s3_presigned_url,
)
from services.automl import (
    read_file, 
    preprocess_data, 
    predict_next_30_sales, 
    cluster_items
)


router = APIRouter(
    prefix="/api/data-analysis",
    tags=["데이터 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)


TEMP_DIR = "temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)


@router.post("/analyze-from-s3")
async def analyze_from_source_id(
    store_id: int = Form(...),
    source_ids: List[str] = Form(...),  
    # analysis_type: str = Form(...),  # "sales_prediction" 또는 "clustering"
):
    """
     여러 개의 source_id를 기준으로 S3 파일을 찾아 데이터 분석을 수행.
    """

    try:
        # 데이터 소스 정보 조회
        data_sources = mongo_instance.get_collection("DataSources")
        
        preprocessed_data = []
        local_files = []
        s3_keys = []
        presigned_urls = []

        for source_id in source_ids:
            document = data_sources.find_one({"_id": ObjectId(source_id), "store_id": store_id, "status": "active"})

            if not document:
                raise HTTPException(status_code=404, detail="해당 store_id와 source_id에 해당하는 파일을 찾을 수 없습니다.")
        
            s3_key = document["file_path"]
            s3_keys.append(s3_key)

            filename = document["original_filename"]
            presigned_urls.append(get_s3_presigned_url(s3_key))

            # 파일 확장자 검사
            ext = os.path.splitext(filename)[1].lower()
            if ext not in [".csv", ".xls", ".xlsx"]:
                raise HTTPException(status_code=400, detail="지원되지 않는 파일 형식입니다. CSV 또는 Excel 파일만 분석 가능합니다.")
        
            # S3에서 파일 다운로드
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            temp_filename = f"{TEMP_DIR}/{timestamp}_{filename}"
        
            local_file_path = await download_file_from_s3(s3_key, temp_filename)
            local_files.append(local_file_path)

            # 파일 읽기 및 전처리
            df = await read_file(local_file_path)
            df = await preprocess_data(df)
            preprocessed_data.append(df) 

        # 여러 개의 DataFrame을 하나로 합치기
        combined_df = pd.concat(preprocessed_data, ignore_index=True)
        
        # 분석 수행
        predict_result = await predict_next_30_sales(combined_df)  
        cluster_result = await cluster_items(combined_df)  

        status = "fail" if ("error" in predict_result or "error" in cluster_result) else "complete"

        # 분석 결과 저장
        analysis_results = mongo_instance.get_collection("AnalysisResults")       
        analysis_document = {
            "_id": ObjectId(),
            "store_id": store_id,
            "source_ids": ObjectId(source_id), # @@@@@@@@@@@@ 오빠한테 물어보기
            "status": status,
            "results": {
                "predict": predict_result,
                "cluster": cluster_result
            },
            "created_at": datetime.now()
        }

        result = analysis_results.insert_one(analysis_document)
        result_id = str(result.inserted_id)
        
        return {
            "message": "파일 분석이 완료되었습니다.",
            "status": status,
            "store_id": store_id,
            "result_id": result_id,
            "source_ids": source_ids,  
            "s3_keys": s3_keys,
            "presigned_urls": presigned_urls,
            "presigned_url": get_s3_presigned_url(s3_key),
            "results": {
                "predict": predict_result,
                "cluster": cluster_result
            },
            # "summary":
        }
    
    except Exception as e:        
        raise HTTPException(status_code=500, detail=f"데이터 분석 중 오류가 발생했습니다: {str(e)}")
    
    finally:
        # 임시 파일 삭제
        for file_path in local_files:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)