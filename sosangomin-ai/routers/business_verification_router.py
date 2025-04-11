# routers/business_verification_router.py

from fastapi import APIRouter, HTTPException, Query, Path
from typing import Optional
import logging
from pydantic import BaseModel
from services.business_verification_service import business_verification_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/business",
    tags=["사업자인증"],
    responses={404: {"description": "찾을 수 없음"}},
)

class BusinessVerificationRequest(BaseModel):
    business_number: str

@router.post("/verify")
async def verify_business_number(request: BusinessVerificationRequest):
    """
    사업자등록번호 유효성 검증
    
    국세청 API를 통해 사업자등록번호가 유효한지 검증합니다.
    """
    try:
        if not request.business_number:
            raise HTTPException(status_code=400, detail="사업자등록번호를 입력해주세요.")
            
        result = await business_verification_service.verify_business_number(request.business_number)
        
        if result.get("status_code") == "API_ERROR":
            raise HTTPException(status_code=502, detail=result.get("message", "API 요청 중 오류가 발생했습니다."))
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"사업자번호 검증 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"사업자번호 검증 중 오류가 발생했습니다: {str(e)}")