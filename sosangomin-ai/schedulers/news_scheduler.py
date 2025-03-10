# schedulers/news_scheduler.py

import asyncio
import logging
from services.news_service import news_service

logger = logging.getLogger(__name__)

async def schedule_news_updates():
    """뉴스 업데이트를 정기적으로 실행하는 스케줄러"""
    while True:
        try:
            logger.info("일일 뉴스 업데이트 작업 시작")
            await news_service.update_news()
            logger.info("뉴스 업데이트 완료, 다음 업데이트까지 대기")
            # 하루에 한 번 업데이트 (24시간 = 86400초)
            await asyncio.sleep(86400)
        except Exception as e:
            logger.error(f"뉴스 업데이트 스케줄링 중 오류 발생: {e}")
            # 오류 발생 시 30분 후 재시도 (1800초)
            await asyncio.sleep(1800)

def start_news_scheduler():
    """뉴스 스케줄러를 백그라운드 태스크로 시작"""
    asyncio.create_task(schedule_news_updates())
    return True