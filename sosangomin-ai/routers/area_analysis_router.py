from fastapi import APIRouter, HTTPException, Path, Query, Form
from sqlalchemy.orm import Session
from database.connector import database_instance as mariadb
from db_models import StoreCategories
from services.area_analysis_service import area_analysis_service
from typing import List
import logging


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/area-analysis",
    tags=["상권 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)



@router.get("/summary")
def summary_view(region_name: str = Query(..., description="행정동 이름"), industry_name: str = Query(..., description="업종 이름")):
   return area_analysis_service.get_summary_analysis

@router.get("/category")
def category_analysis_view(region_name: str = Query(..., description="행정동 이름"), industry_name: str = Query(..., description="업종 이름")):
    result = {  
        "main_category_store_count": area_analysis_service.get_main_category_counts(region_name),
        "food_service_stats": area_analysis_service.get_food_service_stats(region_name, industry_name),
        "store_open_close": area_analysis_service.get_store_open_close_trend(region_name, industry_name),
        "operation_duration_summary": area_analysis_service.get_operation_duration_summary(region_name)
    }
    return result

@router.get("/population")
def population_analysis_view(region_name: str = Query(..., description="행정동 이름")):
    result = { 
        "resident_pop" : area_analysis_service.get_resident_population_analysis(region_name),
        "working_pop" : area_analysis_service.get_working_population_analysis(region_name),
        "floating_pop" : area_analysis_service.get_floating_population_analysis(region_name)
    }
    return result