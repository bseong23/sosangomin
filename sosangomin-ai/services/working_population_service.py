# services/working_population_service

import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from db_models import Population  # 가상의 Population 테이블 (행정동, 인구, 가구 수 저장용)

logger = logging.getLogger(__name__)

class WorkingPopulationService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.working_pop_api_key = os.getenv("WORKING_POPULATION_API_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.working_pop_service = "VwsmAdstrdWrcPopltnW"

        if not self.working_pop_api_key:
            logger.error("직장 인구 인증키가 없습니다. 환경 변수를 확인하세요.")
            self.api_key = "NOT_SET"

    async def fetch_population_data(self, session, start_index: int, end_index: int) -> Dict[str, Any]:
        """직장인구 데이터 API 호출"""
        try:
            url = f"{self.base_url}/{self.working_pop_api_key}/json/{self.working_pop_service}/{start_index}/{end_index}/"
            logger.info(f"직장 인구 API 호출 URL: {url}")
            
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            logger.error(f"직장 인구 API 호출 중 오류 발생 : {e}")
            return {"error": str(e)}

    async def update_population_data(self, start_index: int = 1, end_index: int = 1000):
        """직장인구 데이터 수집 및 DB 저장"""
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()

        try:
            logger.info("직장인구 데이터 업데이트 시작")

            async with aiohttp.ClientSession() as session:
                data = await self.fetch_population_data(session, start_index, end_index)
                # logger.error(f"API 응답 데이터 예시: {data}")

                if 'error' in data:
                    return 0
                
                rows = data[self.working_pop_service].get("row", [])
                if not rows:
                    logger.warning("가져올 직장 인구 데이터가 없습니다.")
                    return 0
                
                for row in rows:
                    try:
                        adstrd_cd_nm=row.get("ADSTRD_CD_NM")
                        
                        # 기존 유동인구 테이블에서 dong_name으로 검색
                        existing = db.query(Population).filter(
                            Population.dong_name == adstrd_cd_nm                            
                        ).first()

                        if not existing:
                            continue  # 유동인구 테이블에 해당 동이 없으면 skip
                        
                         # 성별-연령 컬럼명 매핑
                        age_gender_map = {
                            "male_10_wrpop": "MAG_10_WRC_POPLTN_CO",
                            "male_20_wrpop": "MAG_20_WRC_POPLTN_CO",
                            "male_30_wrpop": "MAG_30_WRC_POPLTN_CO",
                            "male_40_wrpop": "MAG_40_WRC_POPLTN_CO",
                            "male_50_wrpop": "MAG_50_WRC_POPLTN_CO",
                            "male_60_wrpop": "MAG_60_ABOVE_WRC_POPLTN_CO",
                            "female_10_wrpop": "FAG_10_WRC_POPLTN_CO",
                            "female_20_wrpop": "FAG_20_WRC_POPLTN_CO",
                            "female_30_wrpop": "FAG_30_WRC_POPLTN_CO",
                            "female_40_wrpop": "FAG_40_WRC_POPLTN_CO",
                            "female_50_wrpop": "FAG_50_WRC_POPLTN_CO",
                            "female_60_wrpop": "FAG_60_ABOVE_WRC_POPLTN_CO",
                        }

                        key_to_korean = {
                            "male_10_wrpop": "남성 10대",
                            "male_20_wrpop": "남성 20대",
                            "male_30_wrpop": "남성 30대",
                            "male_40_wrpop": "남성 40대",
                            "male_50_wrpop": "남성 50대",
                            "male_60_wrpop": "남성 60대 이상",
                            "female_10_wrpop": "여성 10대",
                            "female_20_wrpop": "여성 20대",
                            "female_30_wrpop": "여성 30대",
                            "female_40_wrpop": "여성 40대",
                            "female_50_wrpop": "여성 50대",
                            "female_60_wrpop": "여성 60대 이상",
                        }

                        # 총 직장인구 저장
                        existing.tot_wrpop = int(float(row.get("TOT_WRC_POPLTN_CO") or 0))

                        # 성연령 인구 저장
                        age_gender_values = {}
                        for key, api_field in age_gender_map.items():
                            value = int(float(row.get(api_field) or 0))
                            setattr(existing, key, value)
                            age_gender_values[key] = value

                        # 최다/최소 성연령 저장
                        dominant_key = max(age_gender_values, key=age_gender_values.get)
                        minor_key = min(age_gender_values, key=age_gender_values.get)
                        existing.dominant_age_gender_wrpop = key_to_korean[dominant_key]
                        existing.minor_age_gender_wrpop = key_to_korean[minor_key]

                        existing.created_at = datetime.now()
 
                    except Exception as e:
                        logger.warning(f"직장 인구 업데이트 실패: {e}")

                db.commit()
                logger.info(f"직장 인구 데이터 저장 완료")
                return

        except Exception as e:
            db.rollback()
            logger.error(f"직장 인구 데이터 호출 및 저장 실패 : {e}")
            return 
        finally:
            db.close()

    def get_recent_population(self, db: Session, limit: int = 100) -> List[Population]:
        """최근 직장인구 데이터 조회"""
        return db.query(Population).order_by(Population.created_at.desc()).limit(limit).all()


# ✅ 서비스 인스턴스 생성
working_population_service = WorkingPopulationService()

# ✅ 단독 테스트 실행용
if __name__ == "__main__":
    async def main():
        await working_population_service.update_population_data(1, 1000)  # 1~1000건 수집
    asyncio.run(main())
