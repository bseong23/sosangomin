from fastapi import APIRouter, HTTPException, Query, Path
from typing import Optional
import logging
from pydantic import BaseModel
from services.store_service import simple_store_service
from database.connector import database_instance
from db_models import Store
from database.mongo_connector import mongo_instance
from bson import ObjectId

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
    category: str

class StoreRegisterWithBusinessRequest(BaseModel):
    user_id: int
    store_name: str
    business_number: str
    pos_type: str
    category: str

class SetMainStoreRequest(BaseModel):
    store_id: int

@router.post("/set-main")
async def set_main_store(
    request: SetMainStoreRequest
):
    """
    특정 가게를 사용자의 대표 가게로 설정
    
    이 엔드포인트는 지정된 가게를 사용자의 대표 가게로 설정합니다.
    이전에 다른 가게가 대표 가게로 설정되어 있었다면 해당 가게의 대표 상태가 해제됩니다.
    
    요청 본문으로 store_id를 받아 해당 가게의 user_id를 조회한 후 대표 가게로 설정합니다.
    """
    try:
        db_session = database_instance.pre_session()
        try:
            store = db_session.query(Store).filter(Store.store_id == request.store_id).first()
            if not store:
                raise HTTPException(status_code=404, detail="해당 ID의 가게를 찾을 수 없습니다.")
            
            user_id = store.user_id
        finally:
            db_session.close()
            
        result = await simple_store_service.set_main_store(
            store_id=request.store_id
        )
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message", "대표 가게 설정 중 오류가 발생했습니다."))
            
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"대표 가게 설정 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"대표 가게 설정 중 오류가 발생했습니다: {str(e)}")


# @router.post("/register")
# async def register_store_by_name(request: StoreRegisterRequest):
#     """
#     가게 이름으로 검색하여 자동으로 등록하는 API
    
#     가게 이름을 입력받아 네이버 검색 API로 정보를 가져오고,
#     place_id를 추출한 후 DB에 바로 저장.
#     """
#     try:
#         if not request.store_name or len(request.store_name.strip()) < 2:
#             raise HTTPException(status_code=400, detail="가게 이름은 최소 2글자 이상이어야 합니다.")
            
#         result = await simple_store_service.register_store_by_name(
#             user_id=request.user_id,
#             store_name=request.store_name,
#             pos_type=request.pos_type
#         )
        
#         if result.get("status") == "error":
#             raise HTTPException(status_code=400, detail=result.get("message", "가게 등록 중 오류가 발생했습니다."))
            
#         return result
#     except HTTPException:
#         raise
#     except Exception as e:
#         logger.error(f"가게 등록 API 호출 중 오류: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"가게 등록 중 오류가 발생했습니다: {str(e)}")

@router.get("/analysis-list/{store_id}")
async def get_analysis_list(store_id: int = Path(..., description="가게 ID")):
    """
    매장 ID를 기준으로 분석 결과 목록(분석 ID, 생성일) 조회
    """
    try:
        collection = mongo_instance.get_collection("AnalysisResults")
        cursor = collection.find({
            "store_id": store_id,
            "status": "completed"
        }).sort("created_at", -1)

        results = []
        for doc in cursor:
            results.append({
                "analysis_id": str(doc["_id"]),
                "created_at": doc["created_at"].isoformat() if doc.get("created_at") else None
            })

        return {
            "status": "success",
            "count": len(results),
            "analyses": results
        }

    except Exception as e:
        logger.error(f"분석 목록 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"분석 목록 조회 중 오류가 발생했습니다: {str(e)}")
    
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
            pos_type=request.pos_type,
            category=request.category
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
                    "is_main": store.is_main,
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
                "is_main": store.is_main,
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
    
@router.delete("/{store_id}")
async def delete_store(store_id: int = Path(..., description="가게 ID")):
    """
    가게 ID를 기준으로 가게를 삭제하는 API
    
    Args:
        store_id: 삭제할 가게 ID
        
    Returns:
        Dict: 삭제 결과
    """
    try:
        db_session = database_instance.pre_session()
        
        try:
            # 해당 ID의 가게 존재 여부 확인
            store = db_session.query(Store).filter(Store.store_id == store_id).first()
            
            if not store:
                raise HTTPException(status_code=404, detail="해당 ID의 가게를 찾을 수 없습니다.")
            
            # 가게 삭제
            db_session.delete(store)
            db_session.commit()
            
            return {
                "status": "success",
                "message": "가게가 성공적으로 삭제되었습니다.",
                "store_id": store_id
            }
            
        except HTTPException:
            raise
        except Exception as e:
            db_session.rollback()
            logger.error(f"가게 삭제 중 오류: {str(e)}")
            raise HTTPException(status_code=500, detail=f"가게 삭제 중 오류가 발생했습니다: {str(e)}")
        finally:
            db_session.close()
            
    except Exception as e:
        logger.error(f"가게 삭제 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"가게 삭제 중 오류가 발생했습니다: {str(e)}")