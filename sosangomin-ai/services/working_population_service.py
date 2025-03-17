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
from db_models import WorkingPopulation  # 가상의 Population 테이블 (행정동, 인구, 가구 수 저장용)

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
        total_saved = 0

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
                        stdr_yyqu_cd = row.get("STDR_YYQU_CD")
                        adstrd_cd_nm=row.get("ADSTRD_CD_NM")
                        
                        # 중복 체크
                        existing = db.query(WorkingPopulation).filter(
                            WorkingPopulation.stdr_yyqu_cd == stdr_yyqu_cd,
                            WorkingPopulation.adstrd_cd_nm == adstrd_cd_nm                            
                        ).first()
                        if existing:
                            logger.debug(f"직장 인구 호출 중 중복 행정동이 존재합니다 : {adstrd_cd_nm}")
                            continue
                        
                        # 새 데이터 생성
                        population = WorkingPopulation(
                            stdr_yyqu_cd=stdr_yyqu_cd,
                            adstrd_cd_nm=adstrd_cd_nm.strip(),
                            # population_type='직장인구',

                            # 총 인구
                            tot_wrpop=(row.get("TOT_WRC_POPLTN_CO")),
                            ml_wrpop=(row.get("ML_WRC_POPLTN_CO")),
                            fml_wrpop=(row.get("FML_WRC_POPLTN_CO")),

                            # 연령대별 직장인구
                            age_10_wrpop=(row.get("AGRDE_10_WRC_POPLTN_CO")),
                            age_20_wrpop=(row.get("AGRDE_20_WRC_POPLTN_CO")),
                            age_30_wrpop=(row.get("AGRDE_30_WRC_POPLTN_CO")),
                            age_40_wrpop=(row.get("AGRDE_40_WRC_POPLTN_CO")),
                            age_50_wrpop=(row.get("AGRDE_50_WRC_POPLTN_CO")),
                            age_60_wrpop=(row.get("AGRDE_60_ABOVE_WRC_POPLTN_CO")),

                            # 남성 연령대별 직장인구
                            male_10_wrpop=(row.get("MAG_10_WRC_POPLTN_CO")),
                            male_20_wrpop=(row.get("MAG_20_WRC_POPLTN_CO")),
                            male_30_wrpop=(row.get("MAG_30_WRC_POPLTN_CO")),
                            male_40_wrpop=(row.get("MAG_40_WRC_POPLTN_CO")),
                            male_50_wrpop=(row.get("MAG_50_WRC_POPLTN_CO")),
                            male_60_wrpop=(row.get("MAG_60_ABOVE_WRC_POPLTN_CO")),

                            # 여성 연령대별 직장인구
                            female_10_wrpop=(row.get("FAG_10_WRC_POPLTN_CO")),
                            female_20_wrpop=(row.get("FAG_20_WRC_POPLTN_CO")),
                            female_30_wrpop=(row.get("FAG_30_WRC_POPLTN_CO")),
                            female_40_wrpop=(row.get("FAG_40_WRC_POPLTN_CO")),
                            female_50_wrpop=(row.get("FAG_50_WRC_POPLTN_CO")),
                            female_60_wrpop=(row.get("FAG_60_ABOVE_WRC_POPLTN_CO")),

                            created_at=datetime.now()
                        )

                        db.add(population)
                        total_saved += 1
                    except Exception as e:
                        logger.warning(f"직장 인구 데이터 저장 실패 : {e}")

                db.commit()
                logger.info(f"직장 인구 데이터 저장 완료 : {total_saved}건 저장됨.")
                return 

        except Exception as e:
            db.rollback()
            logger.error(f"직장 인구 데이터 호출 및 저장 실패 : {e}")
            return 
        finally:
            db.close()

    def get_recent_population(self, db: Session, limit: int = 100) -> List[WorkingPopulation]:
        """최근 직장인구 데이터 조회"""
        return db.query(WorkingPopulation).order_by(WorkingPopulation.created_at.desc()).limit(limit).all()


# ✅ 서비스 인스턴스 생성
working_population_service = WorkingPopulationService()

# ✅ 단독 테스트 실행용
if __name__ == "__main__":
    async def main():
        await working_population_service.update_population_data(1, 1000)  # 1~1000건 수집
    asyncio.run(main())
