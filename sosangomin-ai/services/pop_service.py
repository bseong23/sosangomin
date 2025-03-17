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

class PopulationService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.resident_pop_api_key = os.getenv("SEOUL_OPEN_API_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.resident_pop_service = "WsmAdstrdRepopW"

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
        total_saved = 0

        try:
            logger.info("상주인구 데이터 업데이트 시작")

            async with aiohttp.ClientSession() as session:
                data = await self.fetch_population_data(session, start_index, end_index)
                
                if 'error' in data:
                    # logger.error(f"[API 응답 이상]: {data}")
                    return 0
                
                rows = data[self.resident_pop_service].get("row", [])
                if not rows:
                    logger.warning("가져올 데이터가 없습니다.")
                    return 0
                
                for row in rows:
                    try:
                        # adstrd_cd = row.get("ADSTRD_CD")
                        stdr_yyqu_cd = row.get("STDR_YYQU_CD")
                        
                        # 중복 체크
                        existing = db.query(Populati.n).filter(
                            Population.adstrd_cd == adstrd_cd,
                            Population.stdr_yyqu_cd == stdr_yyqu_cd
                        ).first()
                        if existing:
                            logger.debug(f"[중복] {adstrd_cd} - {stdr_yyqu_cd}")
                            continue
                        
                        # 새 데이터 생성
                        population = Population(
                            stdr_yyqu_cd=row.get("STDR_YYQU_CD"),
                            adstrd_cd=row.get("ADSTRD_CD"),
                            adstrd_cd_nm=row.get("ADSTRD_CD_NM"),
                            fag_50_repop_co=self.to_int(row.get("FAG_50_REPOP_CO")),
                            fag_60_above_repop_co=self.to_int(row.get("FAG_60_ABOVE_REPOP_CO")),
                            tot_hshld_co=self.to_int(row.get("TOT_HSHLD_CO")),
                            apt_hshld_co=self.to_int(row.get("APT_HSHLD_CO")),
                            non_apt_hshld_co=self.to_int(row.get("NON_APT_HSHLD_CO")),
                            created_at=datetime.now()
                        )
                        db.add(population)
                        total_saved += 1
                    except Exception as e:
                        logger.warning(f"[데이터 저장 실패] {e}")

                db.commit()
                logger.info(f"[DB 저장 완료] {total_saved}건 저장됨.")
                return total_saved

        except Exception as e:
            db.rollback()
            logger.error(f"[전체 작업 실패] {e}")
            return 0
        finally:
            db.close()

    def get_recent_population(self, db: Session, limit: int = 100) -> List[Population]:
        """최근 상주인구 데이터 조회"""
        return db.query(Population).order_by(Population.created_at.desc()).limit(limit).all()

    def get_population_by_code(self, db: Session, adstrd_cd: str) -> Optional[Population]:
        """행정동 코드로 조회"""
        return db.query(Population).filter(Population.adstrd_cd == adstrd_cd).order_by(Population.stdr_yyqu_cd.desc()).first()

    @staticmethod
    def to_int(value: Optional[str]) -> Optional[int]:
        """숫자형 데이터 변환"""
        try:
            return int(value.replace(",", "")) if value else None
        except:
            return None


# ✅ 서비스 인스턴스 생성
population_service = PopulationService()

# ✅ 단독 테스트 실행용
if __name__ == "__main__":
    async def main():
        await population_service.update_population_data(1, 1000)  # 1~1000건 수집
    asyncio.run(main())
