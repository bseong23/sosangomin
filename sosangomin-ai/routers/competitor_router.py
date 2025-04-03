# routers/competitor_router.py

from fastapi import APIRouter, HTTPException, Path, Body, Query
from typing import Optional
import logging
from pydantic import BaseModel
from services.competitor_service import competitor_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/competitor",
    tags=["경쟁사 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)

class CompetitorAnalysisRequest(BaseModel):
    store_id: int
    competitor_name: str

class CompetitorComparisonRequest(BaseModel):
    store_id: int
    competitor_place_id: str
    analysis_id: Optional[str] = None  

@router.post("/search")
async def search_competitor(request: CompetitorAnalysisRequest):
    """
    경쟁사 검색 API
    
    경쟁사 이름으로 검색하여 정보와 place_id를 반환.
    (보안상 DB에는 저장하지 않음)
    """
    try:
        result = await competitor_service.search_competitor(
            request.competitor_name
        )
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"경쟁사 검색 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"경쟁사 검색 중 오류가 발생했습니다: {str(e)}")

@router.post("/just-analyze")
async def analyze_competitor_reviews(request: CompetitorAnalysisRequest):
    """
    경쟁사 리뷰 분석 API
    
    경쟁사 이름으로 검색하여 리뷰를 분석.
    (보안상 DB에는 저장하지 않음)
    """
    try:
        result = await competitor_service.analyze_competitor_reviews(
            request.store_id,
            request.competitor_name
        )
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"경쟁사 리뷰 분석 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"경쟁사 리뷰 분석 중 오류가 발생했습니다: {str(e)}")

@router.post("/compare")
async def compare_with_competitor(request: CompetitorComparisonRequest):
    """
    내 점포와 경쟁사 리뷰 비교 분석 API
    
    내 최근 리뷰 분석 결과와 경쟁사 리뷰를 비교 분석.
    분석 결과는 DB에 저장.
    """
    try:
        result = await competitor_service.compare_with_competitor(
            request.store_id,
            request.competitor_place_id,
            request.analysis_id
        )
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"리뷰 비교 분석 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"리뷰 비교 분석 중 오류가 발생했습니다: {str(e)}")

@router.get("/comparison/{comparison_id}")
async def get_comparison_result(comparison_id: str = Path(..., description="비교 분석 결과 ID")):
    """
    비교 분석 결과 조회 API
    
    특정 비교 분석 결과를 조회합니다.
    """
    try:
        result = await competitor_service.get_comparison_result(comparison_id)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=404, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"비교 분석 결과 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"비교 분석 결과 조회 중 오류가 발생했습니다: {str(e)}") 

@router.get("/{store_id}")
async def get_store_comparison_list(
    store_id: int = Path(..., description="매장 ID")
):
    """
    매장의 비교 분석 목록 조회 API
    
    특정 매장의 모든 비교 분석 결과 목록을 조회합니다.
    """
    try:
        result = await competitor_service.get_store_comparison_list(store_id)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"비교 분석 목록 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"비교 분석 목록 조회 중 오류가 발생했습니다: {str(e)}")
    
@router.post("/analyze")
async def one_click_analyze_competitor(request: CompetitorAnalysisRequest):
    """
    경쟁사 분석 API
    
    경쟁사 이름으로 검색하여 리뷰 분석 및 내 매장과 비교까지 한 번에 수행
    """
    try:
        analysis_result = await competitor_service.analyze_competitor_reviews(
            request.store_id,
            request.competitor_name
        )
        
        if analysis_result.get("status") == "error":
            raise HTTPException(status_code=400, detail=analysis_result.get("message"))
        
        competitor_info = analysis_result.get("competitor_info", {})
        competitor_place_id = competitor_info.get("place_id")
        
        if not competitor_place_id:
            raise HTTPException(status_code=400, detail="경쟁사의 네이버 플레이스 ID를 찾을 수 없습니다.")
        
        # 이미 분석된 경쟁사 리뷰 데이터 전달
        competitor_analyzed_reviews = analysis_result.get("analysis_result", {}).get("reviews", [])
        
        # 모든 리뷰 데이터를 사용하기 위해 reviews 키를 확인하고 없으면 분석 결과에서 가져옴
        if not competitor_analyzed_reviews or len(competitor_analyzed_reviews) < 5:  # 최소 5개 이상의 리뷰가 필요하다고 가정
            competitor_analyzed_reviews = analysis_result.get("analysis_result", {}).get("reviews", [])
        
        comparison_result = await competitor_service.compare_with_competitor(
            request.store_id,
            competitor_place_id,
            request.competitor_name,
            competitor_analyzed_reviews=competitor_analyzed_reviews
        )
        
        if comparison_result.get("status") == "error":
            if "내 매장의 리뷰 분석 결과가 없습니다" in comparison_result.get("message", ""):
                return {
                    "status": "partial_success",
                    "message": "경쟁사 리뷰 분석은 완료되었으나, 내 매장 리뷰 분석 결과가 없어 비교 분석은 수행할 수 없습니다. 먼저 내 매장의 리뷰 분석을 진행해주세요.",
                    "competitor_analysis": analysis_result
                }
            else:
                raise HTTPException(status_code=400, detail=comparison_result.get("message"))
        
        return {
            "status": "success",
            "message": "경쟁사 리뷰 분석 및 비교 분석이 완료되었습니다.",
            "competitor_analysis": analysis_result,
            "comparison_result": comparison_result
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"원클릭 경쟁사 분석 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"원클릭 경쟁사 분석 중 오류가 발생했습니다: {str(e)}")