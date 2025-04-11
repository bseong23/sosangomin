# schedulers/transport_scheduler.py

import asyncio
import logging
from services.subway_station_service import subway_station_service  
from services.bus_stop_service import bus_stop_service

logger = logging.getLogger(__name__)

async def schedule_subway_station_updates():
    """지하철역 위치 정보 업데이트 스케줄러"""
    while True:
        try:
            logger.info("지하철역 위치 정보 업데이트 시작")
            await subway_station_service.update_station_data()
            logger.info("지하철역 위치 정보 업데이트 완료. 다음 작업까지 대기.")
            await asyncio.sleep(60 * 60 * 24 * 7)  # 주 1회 실행 
        except Exception as e:
            logger.error(f"지하철역 위치 정보 스케줄링 중 오류 발생: {e}")
            await asyncio.sleep(60 * 60 * 24)  # 오류 발생 시 하루 후 재시도

async def schedule_bus_stop_updates():
    """버스 정류장 위치 정보 업데이트 스케줄러"""
    while True:
        try:
            logger.info("버스 정류장 위치 정보 업데이트 시작")
            await bus_stop_service.update_bus_stop_data()
            logger.info("버스 정류장 위치 정보 업데이트 완료. 다음 실행 대기.")
            await asyncio.sleep(60 * 60 * 24 * 7)  # 일주일 1회 실행
        except Exception as e:
            logger.error(f"버스 정류장 위치 정보 스케줄링 중 오류 발생: {e}")
            await asyncio.sleep(60 * 60 * 24)  # 오류 발생 시 하루 후 재시도

def start_subway_station_scheduler():
    """지하철역 위치 정보 스케줄러 시작"""
    asyncio.create_task(schedule_subway_station_updates())
    asyncio.create_task(schedule_bus_stop_updates())
    return True
