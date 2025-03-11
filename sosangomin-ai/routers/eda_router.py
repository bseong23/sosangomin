# routers/eda_router.py

from fastapi import APIRouter, HTTPException, Path, Query
import logging
from typing import Optional
from bson import ObjectId

from services.eda_service import eda_service

# 로거 설정
logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(
    prefix="/api/eda",
    tags=["데이터 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)

@router.post("/analyze/{source_id}")
async def analyze_data(
    source_id: str = Path(..., description="데이터소스 ID")
):
    """
    특정 데이터소스에 대한 EDA를 수행
    """
    try:
        try:
            ObjectId(source_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 데이터소스 ID입니다.")
        
        result = await eda_service.perform_eda(source_id)
        return result
    except ValueError as e:
        logger.error(f"EDA 분석 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"EDA 분석 중 예기치 않은 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="EDA 분석 중 오류가 발생했습니다.")

@router.get("/results/{analysis_id}")
async def get_eda_result(
    analysis_id: str = Path(..., description="분석 결과 ID")
):
    """
    특정 EDA 분석 결과를 조회
    """
    try:
        try:
            ObjectId(analysis_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 분석 결과 ID입니다.")
        
        result = await eda_service.get_eda_result(analysis_id)
        return result
    except ValueError as e:
        if "찾을 수 없습니다" in str(e):
            raise HTTPException(status_code=404, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"EDA 결과 조회 중 예기치 않은 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="EDA 결과 조회 중 오류가 발생했습니다.")

@router.get("/results")
async def get_eda_results_by_source(
    source_id: str = Query(..., description="데이터소스 ID")
):
    """
    특정 데이터소스의 모든 EDA 분석 결과를 조회
    """
    try:
        try:
            ObjectId(source_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 데이터소스 ID입니다.")
        
        results = await eda_service.get_eda_results_by_source(source_id)
        return results
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"EDA 결과 목록 조회 중 예기치 않은 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="EDA 결과 목록 조회 중 오류가 발생했습니다.")

@router.get("/latest")
async def get_latest_eda_result(
    source_id: str = Query(..., description="데이터소스 ID")
):
    """
    특정 데이터소스의 가장 최근 EDA 분석 결과를 조회
    """
    try:
        try:
            ObjectId(source_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 데이터소스 ID입니다.")
        
        results = await eda_service.get_eda_results_by_source(source_id)
        
        if not results["count"]:
            raise HTTPException(status_code=404, detail=f"데이터소스 {source_id}에 대한 EDA 결과가 없습니다.")
        
        latest_result = results["eda_results"][0]
        
        return {
            "status": "success",
            "analysis_result": latest_result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"최근 EDA 결과 조회 중 예기치 않은 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="최근 EDA 결과 조회 중 오류가 발생했습니다.")

@router.get("/charts/{analysis_id}")
async def get_chart_data(
    analysis_id: str = Path(..., description="분석 결과 ID"),
    chart_type: Optional[str] = Query(None, description="가져올 차트 데이터 유형 (예: weekday_sales, time_period_sales 등)")
):
    """
    특정 EDA 분석 결과에서 차트 데이터를 조회
    chart_type을 지정하면 해당 차트 데이터만 반환하고, 지정하지 않으면 모든 차트 데이터를 반환
    """
    try:
        result = await eda_service.get_eda_result(analysis_id)
        
        if not result or "analysis_result" not in result:
            raise HTTPException(status_code=404, detail=f"ID가 {analysis_id}인 분석 결과를 찾을 수 없습니다.")
        
        chart_data = result["analysis_result"].get("result_data", {})
        
        if chart_type:
            if chart_type in chart_data:
                return {
                    "status": "success",
                    chart_type: chart_data[chart_type]
                }
            else:
                raise HTTPException(status_code=404, detail=f"요청한 차트 유형({chart_type})을 찾을 수 없습니다.")
        
        return {
            "status": "success",
            "chart_data": chart_data
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"차트 데이터 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=f"차트 데이터 조회 중 오류가 발생했습니다: {str(e)}")