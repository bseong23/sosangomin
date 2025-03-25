from fastapi import APIRouter, HTTPException, Query, Path
from typing import Optional
import logging
from pydantic import BaseModel
from services.store_service import simple_store_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/store",
    tags=["매장 등록록"],
    responses={404: {"description": "찾을 수 없음"}},
)

class StoreRegisterRequest(BaseModel):
    user_id: int
    store_name: str
    pos_type: str

@router.post("/register")
async def register_store_by_name(request: StoreRegisterRequest):
    """
    가게 이름으로 검색하여 자동으로 등록하는 API
    
    가게 이름을 입력받아 네이버 검색 API로 정보를 가져오고,
    place_id를 추출한 후 DB에 바로 저장.
    """
    try:
        if not request.store_name or len(request.store_name.strip()) < 2:
            raise HTTPException(status_code=400, detail="가게 이름은 최소 2글자 이상이어야 합니다.")
            
        result = await simple_store_service.register_store_by_name(
            user_id=request.user_id,
            store_name=request.store_name,
            pos_type=request.pos_type
        )
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message", "가게 등록 중 오류가 발생했습니다."))
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"가게 등록 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"가게 등록 중 오류가 발생했습니다: {str(e)}")