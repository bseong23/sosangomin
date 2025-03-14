from fastapi import APIRouter, HTTPException, Query, Path, Body
from typing import Optional
import logging
from services.review_service import review_service
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/reviews",
    tags=["리뷰 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)

class ReviewAnalysisRequest(BaseModel):
    store_id: int
    place_id: str

@router.post("/analyze")
async def analyze_store_reviews(request: ReviewAnalysisRequest):
    try:
        result = await review_service.analyze_store_reviews(request.store_id, request.place_id)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"리뷰 분석 API 호출 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"리뷰 분석 중 오류가 발생했습니다: {str(e)}")

@router.get("/store/{store_id}")
async def get_store_reviews_list(
    store_id: int = Path(..., description="매장 ID")
):
    try:
        result = await review_service.get_store_reviews_list(store_id)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"매장 리뷰 분석 목록 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"매장 리뷰 분석 목록 조회 중 오류가 발생했습니다: {str(e)}")

@router.get("/analysis/{analysis_id}")
async def get_review_analysis(
    analysis_id: str = Path(..., description="분석 결과 ID")
):
    try:
        result = await review_service.get_review_analysis(analysis_id)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=404, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"분석 결과 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"분석 결과 조회 중 오류가 발생했습니다: {str(e)}")