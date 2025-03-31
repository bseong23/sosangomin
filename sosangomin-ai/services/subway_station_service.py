import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from db_models import SubwayStation  # 지하철역 정보 테이블

logger = logging.getLogger(__name__)

class SubwayStationService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.subway_api_key = os.getenv("SUBWAY_API_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.service_name = "subwayStationMaster"

        if not self.subway_api_key:
            logger.error("지하철역 인증키가 없습니다. 환경 변수를 확인하세요.")

    async def fetch_station_data(self, session) -> dict:
        """지하철역 데이터 API 호출"""
        try:
            url = f"{self.base_url}/{self.subway_api_key}/json/{self.service_name}/1/1000/"
            logger.info(f"지하철역 API 호출 URL: {url}")
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            import traceback
            error_traceback = traceback.format_exc()
            logger.error(f"API 호출 중 오류 발생: {str(e)}\n{error_traceback}")
            return {"error": str(e)}

    async def update_station_data(self):
        """지하철역 데이터 수집 및 DB 저장"""
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()
        total_updated = 0
        total_saved = 0 

        try:
            logger.info("지하철역 데이터 업데이트 시작")

            async with aiohttp.ClientSession() as session:
                data = await self.fetch_station_data(session)

                if 'error' in data:
                    return 0
                
                rows = data[self.service_name].get("row", [])
                if not rows:
                    logger.warning("가져올 데이터가 없습니다.")
                    return 0
                
                for row in rows:
                    try:
                        bldn_id = row.get("BLDN_ID")  # 역사 ID
                        station_name = row.get("BLDN_NM")  # 역사명
                        route = row.get("ROUTE")  # 호선
                        latitude = row.get("LAT")  # 위도
                        longitude = row.get("LOT")  # 경도

                        # 기존 데이터 조회
                        existing_station = db.query(SubwayStation).filter_by(bldn_id=bldn_id).first()

                        if existing_station:
                            # 위치 정보가 변경된 경우에만 업데이트
                            if existing_station.latitude != latitude or existing_station.longitude != longitude:
                                existing_station.latitude = latitude
                                existing_station.longitude = longitude
                                db.commit()
                                total_updated += 1
                        else:
                            # 신규 데이터 추가
                            new_station = SubwayStation(
                                bldn_id=bldn_id,
                                station_name=station_name,
                                route=route,
                                latitude=latitude,
                                longitude=longitude,
                                created_at=datetime.now()
                            )
                            db.add(new_station)
                            total_saved += 1

                    except Exception as e:
                        logger.warning(f"지하철역 데이터 저장 실패 : {e}")

                db.commit()
                logger.info(f"지하철역 데이터 저장 완료 : 신규 {total_saved}건, 수정 {total_updated}건")
                return 

        except Exception as e:
            db.rollback()
            logger.error(f"지하철역 데이터 호출 및 저장 실패 : {e}")
            return 
        finally:
            db.close()

# 서비스 인스턴스 생성
subway_station_service = SubwayStationService()

# 단독 실행 테스트
if __name__ == "__main__":
    async def main():
        await subway_station_service.update_station_data()
    asyncio.run(main())
