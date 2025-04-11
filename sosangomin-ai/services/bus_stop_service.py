import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from db_models import BusStop

logger = logging.getLogger(__name__)

class BusStopService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.bus_api_key = os.getenv("BUS_API_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.service_name = "busStopLocationXyInfo"

        if not self.bus_api_key:
            logger.error("버스 정류장 인증키가 없습니다. 환경 변수를 확인하세요.")

    async def fetch_bus_stop_data(self, session) -> dict:
        """버스 정류장 데이터 API 호출"""
        try:
            url = f"{self.base_url}/{self.bus_api_key}/json/{self.service_name}/1/1000/"
            logger.info(f"버스 정류장 API 호출 URL: {url}")
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            logger.error(f"버스 정류장 API 호출 중 오류 발생 : {e}")
            return {"error": str(e)}

    async def update_bus_stop_data(self):
        """버스 정류장 데이터 수집 및 DB 저장"""
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()
        total_updated = 0
        total_saved = 0 

        try:
            logger.info("버스 정류장 데이터 업데이트 시작")

            async with aiohttp.ClientSession() as session:
                data = await self.fetch_bus_stop_data(session)

                if 'error' in data:
                    return 0
                
                rows = data[self.service_name].get("row", [])
                if not rows:
                    logger.warning("가져올 데이터가 없습니다.")
                    return 0
                
                for row in rows:
                    try:
                        stop_no = row.get("STOPS_NO")  # 정류소 번호
                        stop_name = row.get("STOPS_NM")  # 정류소 이름
                        longitude = row.get("XCRD")  # X 좌표 (경도)
                        latitude = row.get("YCRD")  # Y 좌표 (위도)
                        node_id = row.get("NODE_ID")  # 노드 ID
                        stop_type = row.get("STOPS_TYPE")  # 정류소 타입

                        # 기존 데이터 조회
                        existing_stop = db.query(BusStop).filter_by(stop_no=stop_no).first()

                        if existing_stop:
                            # 위치 정보가 변경된 경우에만 업데이트
                            if existing_stop.latitude != latitude or existing_stop.longitude != longitude:
                                existing_stop.latitude = latitude
                                existing_stop.longitude = longitude
                                db.commit()
                                total_updated += 1
                        else:
                            # 신규 데이터 추가
                            new_stop = BusStop(
                                stop_no=stop_no,
                                stop_name=stop_name,
                                longitude=longitude,
                                latitude=latitude,
                                node_id=node_id,
                                stop_type=stop_type,
                                created_at=datetime.now()
                            )
                            db.add(new_stop)
                            total_saved += 1

                    except Exception as e:
                        logger.warning(f"버스 정류장 데이터 저장 실패 : {e}")

                db.commit()
                logger.info(f"버스 정류장 데이터 저장 완료 : 신규 {total_saved}건, 수정 {total_updated}건")
                return 

        except Exception as e:
            db.rollback()
            logger.error(f"버스 정류장 데이터 호출 및 저장 실패 : {e}")
            return 
        finally:
            db.close()

# 서비스 인스턴스 생성
bus_stop_service = BusStopService()

# 단독 실행 테스트
if __name__ == "__main__":
    async def main():
        await bus_stop_service.update_bus_stop_data()
    asyncio.run(main())
