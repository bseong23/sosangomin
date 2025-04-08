# schedulers/weather_scheduler.py

import asyncio
import logging
from datetime import datetime, timedelta
from services.weather_service import weather_service

logger = logging.getLogger(__name__)

async def schedule_weather_updates():
    """날씨 데이터 수집 스케줄러"""
    while True:
        try:
            # 오늘 날짜 기준 전날까지 수집 (하루 단위)
            end_date = datetime.today().replace(minute=0, second=0, microsecond=0)
            start_date = end_date - timedelta(days=3)

            start_str = start_date.strftime("%Y%m%d%H")
            end_str = end_date.strftime("%Y%m%d%H")

            location = "서울"  # 기본 지역

            logger.info(f"[스케줄러] 날씨 수집 시작: {start_str} ~ {end_str} ({location})")
            result_df = await weather_service.process_weather(start_str, end_str, location)
            logger.info(f"[스케줄러] 날씨 수집 완료. 수집 건수: {len(result_df)}")

            # 하루마다 실행
            await asyncio.sleep(60 * 60 * 24)

        except Exception as e:
            logger.error(f"[스케줄러 오류] 날씨 데이터 수집 중 오류 발생: {e}")
            await asyncio.sleep(60 * 60 * 6)  # 오류 시 6시간 후 재시도

def start_weather_scheduler():
    """날씨 데이터 수집 스케줄러 시작"""
    asyncio.create_task(schedule_weather_updates())
    return True