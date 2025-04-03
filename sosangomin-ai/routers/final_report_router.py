from fastapi import APIRouter, Depends, HTTPException, status, Query, Path, Body
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from services.final_report_service import final_report_service
import re
from datetime import datetime

router = APIRouter(
    prefix="/api/final-reports",
    tags=["종합 SWOT 분석 보고서"],
    responses={404: {"description": "Not found"}},
)

class FinalReportResponse(BaseModel):
    _id: Optional[str] = None
    store_id: int
    store_name: str
    created_at: datetime
    swot_analysis: Dict[str, Any]
    full_response: str
    related_analyses: Dict[str, Any]
    status: Optional[str] = "success"
    message: Optional[str] = "SWOT 분석 보고서가 성공적으로 생성되었습니다."
    
class FinalReportListResponse(BaseModel):
    status: str
    count: Optional[int] = None
    reports: Optional[List[Dict[str, Any]]] = None
    message: Optional[str] = None
    
class FinalReportDetailResponse(BaseModel):
    status: str
    report: Optional[Dict[str, Any]] = None
    message: Optional[str] = None

class FinalReportRequest(BaseModel):
    store_id: int

@router.get("/list/{store_id}", response_model=FinalReportListResponse)
async def get_store_reports_list(
    store_id: int = Path(..., description="매장 ID")
):
    """
    매장의 모든 SWOT 분석 보고서 목록 조회
    
    특정 매장의 모든 SWOT 분석 보고서 목록을 최신순으로 조회합니다.
    """
    result = await final_report_service.get_store_reports_list(store_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("message", "보고서 목록 조회 중 오류가 발생했습니다.")
        )
    
    return result

@router.get("/{report_id}", response_model=FinalReportDetailResponse)
async def get_final_report(
    report_id: str = Path(..., description="보고서 ID")
):
    """
    특정 SWOT 분석 보고서 상세 조회
    
    보고서 ID로 SWOT 분석 보고서의 상세 내용을 조회합니다.
    """
    result = await final_report_service.get_final_report(report_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=result.get("message", "보고서를 찾을 수 없습니다.")
        )
    
    return result


@router.post("", response_model=FinalReportResponse)
async def generate_final_report(
    request: FinalReportRequest = Body(..., description="생성 요청")
):
    """
    매장의 종합 SWOT 분석 보고서 생성
    
    모든 분석 데이터를 종합하여 AI로 SWOT 분석 보고서를 생성합니다.
    """
    store_id = request.store_id
    result = await final_report_service.generate_final_report(store_id)
    
    if result.get("status") == "error":
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.get("message", "보고서 생성 중 오류가 발생했습니다.")
        )
    
    if result.get("status") == "incomplete":
        return {
            "status": "incomplete",
            "message": result.get("message", "필요한 분석이 누락되었습니다."),
            "missing_analyses": result.get("missing_analyses", [])
        }
    
    if "_id" in result:
        result["_id"] = str(result["_id"])
    
    result["status"] = "success"
    result["message"] = "SWOT 분석 보고서가 성공적으로 생성되었습니다."
    
    return result