# services/facility_data_service.py

import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from dotenv import load_dotenv
from db_models import Facilities  

logger = logging.getLogger(__name__)

class FacilityDataService:
    def __init__(self):
        load_dotenv("./config/.env")
        self.api_key = os.getenv("FACILITY_API_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.service_name = "VwsmAdstrdFcltyW" 

        if not self.api_key:
            logger.error("집객 시설 데이터 인증키가 없습니다. 환경 변수를 확인하세요.")
            self.api_key = "NOT_SET"

    async def fetch_facility_data(self, session, start_index: int, end_index: int) -> Dict[str, Any]:
        """집객 시설 데이터 API 호출"""
        try:
            url = f"{self.base_url}/{self.api_key}/json/{self.service_name}/{start_index}/{end_index}/"
            logger.info(f"집객 시설 API 호출 URL: {url}")
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            logger.error(f"집객 시설 API 호출 중 오류 발생 : {e}")
            return {"error": str(e)}

    async def update_facility_data(self, total_count: int = 8000):
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()

        try:
            logger.info("집객 시설 데이터 업데이트 시작")

            all_rows = []
            async with aiohttp.ClientSession() as session:
                for start_index in range(1, total_count + 1,1000):
                    end_index = start_index + 999
                    data = await self.fetch_facility_data(session, start_index, end_index)

                    if 'error' in data:
                        logger.warning("API 오류로 인해 일부 데이터 누락될 수 있음")
                        continue

                    rows = data.get(self.service_name, {}).get("row", [])
                    if not rows:
                        continue

                    all_rows.extend(rows)

            total_rows = len(all_rows)
            if total_rows == 0:
                logger.warning("가져온 집객 시설 데이터가 없습니다.")
                return

            # 최신 연월코드 찾기
            latest_row = max(all_rows, key=lambda x: x.get("STDR_YYQU_CD") or "")
            latest_code = latest_row.get("STDR_YYQU_CD")
            logger.info(f"✅ 전체 조회된 데이터 수: {total_rows}개 / 최신 연월 코드: {latest_code}")

            saved_rows = 0  # 저장된 행 수 초기화

            for row in all_rows:
                stdr_code = row.get("STDR_YYQU_CD")
                if stdr_code != latest_code:
                    continue

                year = int(str(stdr_code)[:4])
                quarter = int(str(stdr_code)[-1])

                try:
                    region_name = row.get("ADSTRD_CD_NM")
                    existing = db.query(Facilities).filter(
                        Facilities.region_name == region_name,
                        Facilities.year == year,
                        Facilities.quarter == quarter
                    ).first()

                    if not existing:
                        existing = Facilities(region_name=region_name, year=year, quarter=quarter)

                    existing.viatr_fclty_co = int(row.get("VIATR_FCLTY_CO") or 0)
                    existing.pblofc_co = int(row.get("PBLOFC_CO") or 0)
                    existing.bank_co = int(row.get("BANK_CO") or 0)
                    existing.gehspt_co = int(row.get("GEHSPT_CO") or 0)
                    existing.gnrl_hsptl_co = int(row.get("GNRL_HSPTL_CO") or 0)
                    existing.parmacy_co = int(row.get("PARMACY_CO") or 0)
                    existing.kndrgr_co = int(row.get("KNDRGR_CO") or 0)
                    existing.elesch_co = int(row.get("ELESCH_CO") or 0)
                    existing.mskul_co = int(row.get("MSKUL_CO") or 0)
                    existing.hgschl_co = int(row.get("HGSCHL_CO") or 0)
                    existing.univ_co = int(row.get("UNIV_CO") or 0)
                    existing.drts_co = int(row.get("DRTS_CO") or 0)
                    existing.supmk_co = int(row.get("SUPMK_CO") or 0)
                    existing.theat_co = int(row.get("THEAT_CO") or 0)
                    existing.stayng_fclty_co = int(row.get("STAYNG_FCLTY_CO") or 0)
                    existing.arprt_co = int(row.get("ARPRT_CO") or 0)
                    existing.rlroad_statn_co = int(row.get("RLROAD_STATN_CO") or 0)
                    existing.bus_trminl_co = int(row.get("BUS_TRMINL_CO") or 0)
                    existing.subway_statn_co = int(row.get("SUBWAY_STATN_CO") or 0)
                    existing.bus_sttn_co = int(row.get("BUS_STTN_CO") or 0)

                    existing.created_at = datetime.now()

                    db.merge(existing)
                    saved_rows += 1  # 성공적으로 저장된 경우 카운트 증가
                except Exception as e:
                    logger.warning(f"행 처리 오류: {e}")

            db.commit()
            logger.info(f"✅ 최신 분기({latest_code}) 기준 저장된 데이터 수: {saved_rows}개")

        except Exception as e:
            db.rollback()
            logger.error(f"집객 시설 데이터 저장 실패 : {e}")
        finally:
            db.close()


facility_data_service = FacilityDataService()

# 단독 실행용
if __name__ == "__main__":
    async def main():
        await facility_data_service.update_facility_data()
    asyncio.run(main())
