# routers/s3_router.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
import logging
from typing import Optional

import os

from database.mongo_connector import mongo_instance

from datetime import datetime
from bson import ObjectId

from services.s3_service import (
    upload_file_to_s3, 
    get_s3_presigned_url, 
    download_file_from_s3, 
    delete_file_from_s3, 
    test_s3_connection,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/s3",
    tags=["S3 스토리지"],
    responses={404: {"description": "찾을 수 없음"}},
)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    store_id: int = Form(...),
    start_month: str = Form(..., description="시작 월 (YYYY-MM 형식)"),
    end_month: str = Form(..., description="종료 월 (YYYY-MM 형식)")
):
    try:
        s3_key = await upload_file_to_s3(file, store_id)
        
        try:
            file_extension = os.path.splitext(file.filename)[1].lower().lstrip('.')
            
            base_name = os.path.splitext(file.filename)[0]
            
            source_name = f"{base_name} ({start_month}~{end_month})"
            
            data_sources = mongo_instance.get_collection("DataSources")
            
            document = {
                "_id": ObjectId(),
                "store_id": store_id,
                "source_name": source_name,
                "original_filename": file.filename,
                "file_path": s3_key,
                "file_size": file.size if hasattr(file, "size") else None,
                "file_type": file_extension,
                "content_type": file.content_type if hasattr(file, "content_type") else None,
                "upload_date": datetime.now(),
                "status": "active",
                "date_range": {
                    "start_month": start_month,
                    "end_month": end_month
                },
                "last_accessed": datetime.now()
            }
            
            result = data_sources.insert_one(document)
            source_id = str(result.inserted_id)
            
            return {
                "status": "success",
                "message": "파일이 성공적으로 업로드되었습니다.",
                "source_id": source_id,
                "source_name": source_name,
                "date_range": {
                    "start_month": start_month,
                    "end_month": end_month
                },
                "s3_key": s3_key,
                "url": get_s3_presigned_url(s3_key)
            }
            
        except Exception as db_error:
            delete_file_from_s3(s3_key)
            logger.error(f"MongoDB 저장 중 오류: {str(db_error)}")
            raise HTTPException(status_code=500, detail=f"파일 메타데이터 저장 실패: {str(db_error)}")
            
    except Exception as e:
        logger.error(f"파일 업로드 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/url")
async def get_file_url(
    s3_key: str = Query(..., description="S3 객체 키"),
    expiration: Optional[int] = Query(3600, description="URL 만료 시간(초)")
):
    try:
        url = get_s3_presigned_url(s3_key, expiration)
        
        return {
            "status": "success",
            "url": url,
            "expiration_seconds": expiration
        }
    except Exception as e:
        logger.error(f"URL 생성 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/delete")
async def delete_file(
    s3_key: str = Query(..., description="삭제할 S3 객체 키")
):
    try:
        result = delete_file_from_s3(s3_key)
        
        return {
            "status": "success",
            "message": "파일이 성공적으로 삭제되었습니다."
        }
    except Exception as e:
        logger.error(f"파일 삭제 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/test-connection")
async def test_connection():
    try:
        result = test_s3_connection()
        return result
    except Exception as e:
        logger.error(f"S3 연결 테스트 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
