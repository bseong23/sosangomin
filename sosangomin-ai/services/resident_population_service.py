# services/resident_population_service

import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from db_models import Population 

logger = logging.getLogger(__name__)

class ResidentPopulationService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.resident_pop_api_key = os.getenv("RESIDENT_POPULATION_API_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.resident_pop_service = "VwsmAdstrdRepopW"

        if not self.resident_pop_api_key:
            logger.error("상주 인구 인증키가 없습니다. 환경 변수를 확인하세요.")
            self.api_key = "NOT_SET"

    async def fetch_population_data(self, session, start_index: int, end_index: int) -> Dict[str, Any]:
        """상주인구 데이터 API 호출"""
        try:
            url = f"{self.base_url}/{self.resident_pop_api_key}/json/{self.resident_pop_service}/{start_index}/{end_index}/"
            logger.info(f"상주 인구 API 호출 URL: {url}")
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            logger.error(f"상주 인구 API 호출 중 오류 발생 : {e}")
            return {"error": str(e)}

    async def update_population_data(self, start_index: int = 1, end_index: int = 1000):
        """상주인구 데이터 수집 및 DB 저장"""
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()

        try:
            logger.info("상주인구 데이터 업데이트 시작")

            async with aiohttp.ClientSession() as session:
                data = await self.fetch_population_data(session, start_index, end_index)
                # logger.error(f"API 응답 데이터 예시: {data}")

                if 'error' in data:
                    return
                
                rows = data[self.resident_pop_service].get("row", [])
                if not rows:
                    logger.warning("가져올 상주 인구 데이터가 없습니다.")
                    return
                
                for row in rows:
                    try:
                        adstrd_cd_nm=row.get("ADSTRD_CD_NM")
                        
                        # 기존 유동인구 테이블에서 region_name으로 검색
                        existing = db.query(Population).filter(
                            Population.region_name == adstrd_cd_nm                            
                        ).first()

                        if not existing:
                            continue  # 유동인구 테이블에 해당 동이 없으면 skip

                        # 성별-연령 컬럼명 매핑 (영문 key → API 필드명)
                        age_gender_map = {
                            "male_10_repop": "MAG_10_REPOP_CO",
                            "male_20_repop": "MAG_20_REPOP_CO",
                            "male_30_repop": "MAG_30_REPOP_CO",
                            "male_40_repop": "MAG_40_REPOP_CO",
                            "male_50_repop": "MAG_50_REPOP_CO",
                            "male_60_repop": "MAG_60_ABOVE_REPOP_CO",
                            "female_10_repop": "FAG_10_REPOP_CO",
                            "female_20_repop": "FAG_20_REPOP_CO",
                            "female_30_repop": "FAG_30_REPOP_CO",
                            "female_40_repop": "FAG_40_REPOP_CO",
                            "female_50_repop": "FAG_50_REPOP_CO",
                            "female_60_repop": "FAG_60_ABOVE_REPOP_CO",
                        }

                        # 한글 매핑
                        key_to_korean = {
                            "male_10_repop": "남성 10대",
                            "male_20_repop": "남성 20대",
                            "male_30_repop": "남성 30대",
                            "male_40_repop": "남성 40대",
                            "male_50_repop": "남성 50대",
                            "male_60_repop": "남성 60대 이상",
                            "female_10_repop": "여성 10대",
                            "female_20_repop": "여성 20대",
                            "female_30_repop": "여성 30대",
                            "female_40_repop": "여성 40대",
                            "female_50_repop": "여성 50대",
                            "female_60_repop": "여성 60대 이상",
                        }

                        # 총 상주 인구 저장
                        existing.tot_repop = int(float(row.get("TOT_REPOP_CO") or 0))

                        # 성연령 인구 저장
                        age_gender_values = {}
                        for key, api_field in age_gender_map.items():
                            value = int(float(row.get(api_field) or 0))
                            setattr(existing, key, value)
                            age_gender_values[key] = value

                        # 최다/최소 성연령 저장
                        dominant_key = max(age_gender_values, key=age_gender_values.get)
                        minor_key = min(age_gender_values, key=age_gender_values.get)
                        existing.dominant_age_gender_repop = key_to_korean[dominant_key]
                        existing.minor_age_gender_repop = key_to_korean[minor_key]

                        existing.created_at = datetime.now()

                    except Exception as e:
                        print(f"상주 인구 업데이트 실패: {e}")

                db.commit()
                logger.info(f"상주 인구 데이터 저장 완료")
                return 

        except Exception as e:
            db.rollback()
            logger.error(f"상주 인구 데이터 호출 및 저장 실패 : {e}")
            return 
        finally:
            db.close()

    def get_recent_population(self, db: Session, limit: int = 100) -> List[Population]:
        """최근 상주인구 데이터 조회"""
        return db.query(Population).order_by(Population.created_at.desc()).limit(limit).all()

resident_population_service = ResidentPopulationService()

# 단독 테스트 실행용
if __name__ == "__main__":
    async def main():
        await resident_population_service.update_population_data(1, 1000)  # 1~1000건 수집
    asyncio.run(main())
