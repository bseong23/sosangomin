from fastapi import APIRouter, HTTPException, Path, Query, Form
from database.connector import database_instance
from services.area_analysis_service import area_analysis_service
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/area-analysis",
    tags=["상권 분석"],
    responses={404: {"description": "찾을 수 없음"}},
)

@router.get("/summary")
def summary_view(region_name: str = Query(..., description="행정동 이름"), industry_name: str = Query(..., description="업종 이름")):
    db = database_instance.pre_session()
    try:
        return area_analysis_service.get_summary_analysis(db, region_name, industry_name)
    finally:
        db.close()

@router.get("/population")
def population_analysis(region_name: str = Query(..., description="행정동 이름")):
    db = database_instance.pre_session()
    try:
        result = {
            "resident_pop": area_analysis_service.get_resident_population_analysis(db, region_name),
            "working_pop": area_analysis_service.get_working_population_analysis(db, region_name),
            "floating_pop": area_analysis_service.get_floating_population_analysis(db, region_name)
        }
        return result
    finally:
        db.close()

@router.get("/category")
def category_analysis(region_name: str = Query(..., description="행정동 이름"), industry_name: str = Query(..., description="업종 이름")):
    db = database_instance.pre_session()
    try:
        result = {
            "main_category_store_count": area_analysis_service.get_main_category_store_count(db, region_name),
            "food_category_stats": area_analysis_service.get_food_store_category_stats(db, region_name, industry_name),
            "store_open_close": area_analysis_service.get_store_open_close_trend(db, region_name, industry_name),
            "operation_duration_summary": area_analysis_service.get_store_operation_duration_summary(db, region_name)
        }
        return result
    finally:
        db.close()

@router.get("/sales")
def sales_analysis(region_name: str = Query(..., description="행정동 이름"), industry_name: str = Query(..., description="업종 이름")):
    db = database_instance.pre_session()
    try:
        result = {
            "main_category_sales_count": area_analysis_service.get_main_category_sales_count(db, region_name),
            "food_sales_stats": area_analysis_service.get_food_store_sales_stats(db, region_name, industry_name),
            "sales_comparison": area_analysis_service.get_industry_sales_comparison(db, industry_name, region_name),
            "sales_detail": area_analysis_service.get_sales_detail(db, region_name, industry_name)
        }
        return result
    finally:
        db.close()

# 테스트 전용 실행 
if __name__ == "__main__":
    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    import json

    test_app = FastAPI()
    test_app.include_router(router)

    client = TestClient(test_app)

    def print_response(title: str, response):
        print(f"\n🧪 {title}")
        print("✅ Status:", response.status_code)
        try:
            print("✅ Response:", json.dumps(response.json(), ensure_ascii=False, indent=4))
        except Exception as e:
            print("⚠️ JSON 디코딩 오류:", e)
            print("⚠️ Raw response:", response.text)

    def test_summary():
        response = client.get("/api/area-analysis/summary", params={
            "region_name": "청운효자동",
            "industry_name": "한식음식점"
        })
        print_response("요약 분석 테스트", response)

    def test_population():
        response = client.get("/api/area-analysis/population", params={
            "region_name": "청운효자동"
        })
        print_response("인구 분석 테스트", response)

    def test_category():
        response = client.get("/api/area-analysis/category", params={
            "region_name": "청운효자동",
            "industry_name": "한식음식점"
        })
        print_response("업종 분석 테스트", response)

    def test_sales():
        response = client.get("/api/area-analysis/sales", params={
            "region_name": "청운효자동",
            "industry_name": "한식음식점"
        })
        print_response("매출 분석 테스트", response)

    # 개별 테스트 실행
    test_summary()
    # test_population()
    # test_category()
    # test_sales()
