# routers/s3_router.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
import logging
from typing import Optional

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
):
    try:
        s3_key = await upload_file_to_s3(file, store_id)
        
        # 업로드 성공 시 S3 키와 URL 반환
        return {
            "status": "success",
            "message": "파일이 성공적으로 업로드되었습니다.",
            "s3_key": s3_key,
            "url": get_s3_presigned_url(s3_key)
        }
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
