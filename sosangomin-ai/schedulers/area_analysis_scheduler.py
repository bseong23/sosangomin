# schedulers/area_scheduler.py

import asyncio
import logging
from services.resident_population_service import resident_population_service
from services.working_population_service import working_population_service
from services.store_category_service import store_category_service
from services.sales_service import sales_service

logger = logging.getLogger(__name__)

# =====================
#  인구 데이터 스케줄링
# =====================
async def schedule_resident_population_updates():
    """상주 인구 데이터 월별 갱신 스케줄러"""
    while True:
        try:
            logger.info("상주 인구 데이터 업데이트 시작")
            await resident_population_service.update_population_data()
            logger.info("상주 인구 데이터 업데이트 완료")
            await asyncio.sleep(60 * 60 * 24 * 30)  # 한 달 후 재실행
        except Exception as e:
            logger.error(f"상주 인구 스케줄 오류: {e}")
            await asyncio.sleep(60 * 60 * 24)

async def schedule_working_population_updates():
    """직장 인구 데이터 월별 갱신 스케줄러"""
    while True:
        try:
            logger.info("직장 인구 데이터 업데이트 시작")
            await working_population_service.update_population_data()
            logger.info("직장 인구 데이터 업데이트 완료")
            await asyncio.sleep(60 * 60 * 24 * 30)
        except Exception as e:
            logger.error(f"직장 인구 스케줄 오류: {e}")
            await asyncio.sleep(60 * 60 * 24)

# ========================
# 업종 분석 데이터 스케줄링
# ========================
async def schedule_store_category_updates():
    """점포/변화지표 데이터 3개월 주기 갱신"""
    while True:
        try:
            logger.info("업종 분석 데이터 업데이트 시작")
            await store_category_service.update_store_data()
            logger.info("업종 분석 데이터 업데이트 완료")
            await asyncio.sleep(60 * 60 * 24 * 30 * 3)  # 3개월 주기
        except Exception as e:
            logger.error(f"업종 분석 스케줄 오류: {e}")
            await asyncio.sleep(60 * 60 * 24 * 3)

# ========================
# 매출 분석 데이터 스케줄링
# ========================
async def schedule_sales_updates():
    """매출 데이터 3개월 주기 갱신"""
    while True:
        try:
            logger.info("매출 데이터 업데이트 시작")
            await sales_service.update_sales_data()
            logger.info("매출 데이터 업데이트 완료")
            await asyncio.sleep(60 * 60 * 24 * 30 * 3)  # 3개월 주기
        except Exception as e:
            logger.error(f"매출 스케줄 오류: {e}")
            await asyncio.sleep(60 * 60 * 24 * 3)


# ========================
# 통합 스케줄러 시작 함수
# ========================
def start_area_scheduler():
    """상권 분석 관련 스케줄러 통합 실행"""
    asyncio.create_task(schedule_resident_population_updates())
    asyncio.create_task(schedule_working_population_updates())
    asyncio.create_task(schedule_store_category_updates())
    asyncio.create_task(schedule_sales_updates())
    logger.info("상권 분석 스케줄러 시작됨")
    return True
