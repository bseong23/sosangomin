# routers/data_analysis_router.py

from fastapi import APIRouter, HTTPException, Path, Form
import logging
from bson import ObjectId
from typing import List
from database.mongo_connector import mongo_instance
from services.s3_service import (
    download_file_from_s3, 
    get_s3_presigned_url,
)
from services.auto_analysis import AutoAnalysisService

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/data-analysis",
    tags=["데이터 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)

auto_analysis_service = AutoAnalysisService()

@router.post("/analyze/auto")
async def analyze_auto_analysis(
    store_id: int = Form(...),
    source_ids: List[str] = Form(...),
    pos_type: str = Form(..., description="POS 유형 (키움, 토스 ...)")
):
    """
    여러 source_id에 대해 자동 분석(예측 + 클러스터링)을 수행합니다.
    """
    try:
        # ObjectId 유효성 검사
        for sid in source_ids:
            try:
                ObjectId(sid)
            except Exception:
                raise HTTPException(status_code=400, detail=f"유효하지 않은 source_id: {sid}")
        
        result = await auto_analysis_service.perform_analyze(store_id, source_ids, pos_type)
        return result

    except ValueError as e:
        logger.error(f"AutoAnalysis 분석 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"AutoAnalysis 예기치 않은 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="AutoAnalysis 수행 중 오류가 발생했습니다.")

@router.get("/results/{result_id}")
async def get_auto_analysis_result(
    result_id: str = Path(..., description="AutoAnalysis 분석 결과 ID")
):
    """
    특정 AutoAnalysis 분석 결과 조회
    """
    try:
        try:
            ObjectId(result_id)
        except:
            raise HTTPException(status_code=400, detail="유효하지 않은 분석 결과 ID입니다.")

        collection = mongo_instance.get_collection("AnalysisResults")
        result = collection.find_one({"_id": ObjectId(result_id), "analysis_type": "autoanalysis"})
        if not result:
            raise HTTPException(status_code=404, detail="해당 ID의 AutoAnalysis 결과를 찾을 수 없습니다.")
        return result
    except Exception as e:
        logger.error(f"AutoAnalysis 결과 조회 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail="AutoAnalysis 결과 조회 중 오류가 발생했습니다.")

