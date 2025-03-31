from fastapi import APIRouter, HTTPException, Query, Path
from typing import Optional
import logging
from pydantic import BaseModel
from services.store_service import simple_store_service
from database.connector import database_instance
from db_models import Store

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

class StoreRegisterWithBusinessRequest(BaseModel):
    user_id: int
    store_name: str
    business_number: str
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
    
@router.post("/register-with-business")
async def register_store_with_business(request: StoreRegisterWithBusinessRequest):
    """
    사업자등록번호 검증 후 가게를 등록하는 API
    
    사업자등록번호를 검증한 후 유효한 경우에만 가게를 등록합니다.
    """
    try:
        if not request.store_name or len(request.store_name.strip()) < 2:
            raise HTTPException(status_code=400, detail="가게 이름은 최소 2글자 이상이어야 합니다.")
            
        if not request.business_number or len(request.business_number.replace('-', '')) != 10:
            raise HTTPException(status_code=400, detail="사업자등록번호는 10자리 숫자여야 합니다.")
            
        result = await simple_store_service.register_store_with_business_number(
            user_id=request.user_id,
            store_name=request.store_name,
            business_number=request.business_number,
            pos_type=request.pos_type
        )
        
        if result.get("status") == "error":
            if "verification_result" in result:
                raise HTTPException(status_code=422, detail=result.get("message"), headers={"X-Verification-Result": "failed"})
            else:
                raise HTTPException(status_code=400, detail=result.get("message", "가게 등록 중 오류가 발생했습니다."))
            
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"사업자번호 검증 후 가게 등록 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"가게 등록 중 오류가 발생했습니다: {str(e)}")
    
@router.get("/list/{user_id}")
async def get_store_list(user_id: int = Path(..., description="사용자 ID")):
    """
    사용자의 가게 목록 조회
    
    사용자 ID를 통해 해당 사용자가 등록한 모든 가게 목록을 반환합니다.
    """
    try:
        db_session = database_instance.pre_session()
        
        try:
            stores = db_session.query(Store).filter(Store.user_id == user_id).all()
            
            if not stores:
                return {
                    "status": "success",
                    "message": "등록된 가게가 없습니다.",
                    "stores": []
                }
            
            store_list = []
            for store in stores:
                store_list.append({
                    "store_id": store.store_id,
                    "store_name": store.store_name,
                    "address": store.address,
                    "place_id": store.place_id,
                    "category": store.category,
                    "latitude": store.latitude,
                    "longitude": store.longitude,
                    "business_number": store.business_number,
                    "is_verified": store.is_verified,
                    "pos_type": store.pos_type,
                    "created_at": store.created_at.isoformat() if store.created_at else None
                })
            
            return {
                "status": "success",
                "count": len(store_list),
                "stores": store_list
            }
            
        except Exception as e:
            logger.error(f"가게 목록 조회 중 오류: {str(e)}")
            raise HTTPException(status_code=500, detail=f"가게 목록 조회 중 오류가 발생했습니다: {str(e)}")
        finally:
            db_session.close()
            
    except Exception as e:
        logger.error(f"가게 목록 조회 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"가게 목록 조회 중 오류가 발생했습니다: {str(e)}")


@router.get("/detail/{store_id}")
async def get_store_detail(store_id: int = Path(..., description="가게 ID")):
    """
    가게 상세 정보 조회
    
    가게 ID를 통해 해당 가게의 상세 정보를 반환합니다.
    """
    try:
        db_session = database_instance.pre_session()
        
        try:
            store = db_session.query(Store).filter(Store.store_id == store_id).first()
            
            if not store:
                raise HTTPException(status_code=404, detail="해당 ID의 가게를 찾을 수 없습니다.")
            
            store_detail = {
                "store_id": store.store_id,
                "user_id": store.user_id,
                "store_name": store.store_name,
                "address": store.address,
                "place_id": store.place_id,
                "category": store.category,
                "review_count": store.review_count,
                "latitude": store.latitude,
                "longitude": store.longitude,
                "business_number": store.business_number,
                "is_verified": store.is_verified,
                "pos_type": store.pos_type,
                "created_at": store.created_at.isoformat() if store.created_at else None,
                "updated_at": store.updated_at.isoformat() if store.updated_at else None
            }
            
            return {
                "status": "success",
                "store": store_detail
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"가게 상세 정보 조회 중 오류: {str(e)}")
            raise HTTPException(status_code=500, detail=f"가게 상세 정보 조회 중 오류가 발생했습니다: {str(e)}")
        finally:
            db_session.close()
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"가게 상세 정보 조회 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"가게 상세 정보 조회 중 오류가 발생했습니다: {str(e)}")