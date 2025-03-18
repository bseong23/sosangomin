# schedulers/population_scheduler.py

import asyncio
import logging
# from services.resident_population_service import resident_population_service
from services.resident_population_service import resident_population_service
from services.working_population_service import working_population_service

logger = logging.getLogger(__name__)

async def schedule_resident_population_updates():
    """상주 인구 데이터 월별 갱신 스케줄러"""
    while True:
        try:
            logger.info("상주 인구 데이터 업데이트 작업 시작")
            await resident_population_service.update_population_data()  
            logger.info("상주 인구 데이터 업데이트 완료. 다음 작업까지 대기.")
            # 30일 대기 (한달 주기)
            await asyncio.sleep(60 * 60 * 24 * 30)
        except Exception as e:
            logger.error(f"상주 인구 스케줄링 중 오류 발생: {e}")
            # 오류 발생 시 1일 후 재시도
            await asyncio.sleep(60 * 60 * 24)

async def schedule_working_population_updates():
    """직장 인구 데이터 월별 갱신 스케줄러"""
    while True:
        try:
            logger.info("직장 인구 데이터 업데이트 작업 시작")
            await working_population_service.update_population_data()  
            logger.info("직장 인구 데이터 업데이트 완료. 다음 작업까지 대기.")
            # 30일 대기 (한달 주기)
            await asyncio.sleep(60 * 60 * 24 * 30)
        except Exception as e:
            logger.error(f"직장 인구 스케줄링 중 오류 발생: {e}")
            # 오류 발생 시 1일 후 재시도
            await asyncio.sleep(60 * 60 * 24)

def start_population_scheduler():
    """인구 데이터 스케줄러 시작"""
    asyncio.create_task(schedule_resident_population_updates())
    asyncio.create_task(schedule_working_population_updates())
    return True