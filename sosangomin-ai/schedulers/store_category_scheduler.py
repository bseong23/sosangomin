# schedulers/population_scheduler.py

import asyncio
import logging
from services.store_category_service import store_category_service

logger = logging.getLogger(__name__)

async def schedule_store_category_updates():
    """업종 분석 데이터 월별 갱신 스케줄러"""
    while True:
        try:
            logger.info("업종 분석 데이터 업데이트 작업 시작")
            await store_category_service.update_store_data()  
            logger.info("업종 분석 데이터 업데이트 완료. 다음 작업까지 대기.")
            # 3개월 대기 (3개월 주기)
            await asyncio.sleep(60 * 60 * 24 * 30 * 3) 
        except Exception as e:
            logger.error(f"업종 분석 스케줄링 중 오류 발생: {e}")
            # 오류 발생 시 3일 후 재시도
            await asyncio.sleep(60 * 60 * 24 * 3)

def start_store_category_scheduler():
    """업종 분석 데이터 스케줄러 시작"""
    asyncio.create_task(schedule_store_category_updates())
    return True