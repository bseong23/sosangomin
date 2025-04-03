from fastapi import APIRouter, Body, HTTPException
from database.connector import database_instance
from services.location_recommendation_service  import location_recommendation_service 
from typing import List
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/location",
    tags=["입지 추천"],
    responses={404: {"description": "찾을 수 없음"}},
)

@router.get('/heatmap')
def prepare_initial_heatmap_data():
    db = database_instance.pre_session()
    try:
        result = location_recommendation_service.prepare_initial_heatmap_data()
        return result
    except Exception as e:
        logger.error(f"히트맵 데이터 호출 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="히트맵 데이터 호출 중 오류가 발생했습니다.")
    finally:
        db.close()

@router.post("/recommend")
def recommend_location(
    industry_name: str = Body(..., description="창업 업종명"),
    target_age: str = Body(..., description="타겟 연령대 (예: '20')"),
    priority: List[str] = Body(..., description="우선순위 리스트 (예: ['타겟연령', '유동인구', '임대료'])"),
    top_n: int = Body(3, description="추천받을 상위 행정동 개수")
):
    db = database_instance.pre_session()
    try:
        result = location_recommendation_service.recommend_location(
                user_input={
                    "industry_name": industry_name,
                    "target_age": target_age,
                    "priority": priority
                },
                top_n=top_n
            )
        return result["top_n"]
    except Exception as e:
        logger.error(f"입지 추천 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="입지 추천 중 오류가 발생했습니다.")
    finally:
        db.close()

@router.post("/map")
def recommend_map_locations(
    industry_name: str = Body(..., description="창업 업종명"),
    target_age: str = Body(..., description="타겟 연령대 (예: '20')"),
    priority: List[str] = Body(..., description="우선순위 리스트 (예: ['타겟연령', '유동인구', '임대료'])"),
    top_n: int = Body(3, description="추천받을 상위 행정동 개수")
):
    db = database_instance.pre_session()
    try:
        result = location_recommendation_service.recommend_location(
                user_input={
                    "industry_name": industry_name,
                    "target_age": target_age,
                    "priority": priority
                },
                top_n=top_n
            )
        return result["total"]
    except Exception as e:
        logger.error(f"입지 등급 맵 호출 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail="입지 등급 맵 호출 중 오류가 발생했습니다.")
    finally:
        db.close()

# 테스트 전용 실행 
# PYTHON=. python -m routers.location_recommendation_router
import asyncio
import json

if __name__ == "__main__":
    user_input = {
        "industry_name": "한식음식점",
        "target_age": "20",
        "priority": ["타겟연령", "임대료", "거주인구"]
    }

    async def main():
        # recommend_location 함수는 비동기 함수이므로, 비동기 방식으로 호출
        # result = location_recommendation_service.recommend_location(user_input)
        result = location_recommendation_service.prepare_initial_heatmap_data()
        
        # 결과를 예쁘게 출력
        # print(json.dumps(result["top_n"], ensure_ascii=False, indent=4))
        print(json.dumps(result, ensure_ascii=False, indent=4))

    # 비동기 함수 실행
    asyncio.run(main())