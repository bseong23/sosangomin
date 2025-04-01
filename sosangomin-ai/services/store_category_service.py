# services/store_category_service.py

import sys
import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from dotenv import load_dotenv
from db_models import StoreCategories  
import json
import pandas as pd
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, Dict, List, Any

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
logger = logging.getLogger(__name__)

class StoreCategoryService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.store_api_key = os.getenv("STORE_API_KEY")
        self.change_api_key = os.getenv("TRADE_AREA_CHANGE_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.store_service_name = "VwsmAdstrdStorW"
        self.change_service_name = "VwsmAdstrdIxQq"

        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_dir = os.path.join(base_dir, "..", "data")

        with open(os.path.join(json_dir, "seoul_dong_to_district.json"), "r", encoding="utf-8") as f:
            self.dong_to_district = json.load(f)

        with open(os.path.join(json_dir, "industry_to_main_category.json"), "r", encoding="utf-8") as f:
            self.industry_to_main_category = json.load(f)

        if not self.store_api_key:
            logger.error("점포 인증키가 없습니다. 환경 변수를 확인하세요.")

        if not self.change_api_key:
            logger.error("상권변화지표 인증키가 없습니다. 환경 변수를 확인하세요.")

    def get_main_category(self, industry_name: str) -> str:
        """업종명을 대분류로 변환"""
        for main_cat, names in self.industry_to_main_category.items():
            if industry_name in names:
                return main_cat
        return "기타"
    
    def safe_get(self, row, key):
        val = row.get(key)
        return None if pd.isna(val) else val
    
    async def fetch_store_data(self, session) -> dict:
        """상권 점포 데이터 API 호출"""
        try:
            all_data = []
            start = 1
            limit = 1000  # 페이지당 수
            while True:
                end = start + limit - 1
                url = f"{self.base_url}/{self.store_api_key}/json/{self.store_service_name}/{start}/{end}/"
                async with session.get(url) as response:
                    response.raise_for_status()
                    data = await response.json()
                    rows = data[self.store_service_name].get("row", [])
                    if not rows:
                        break
                    all_data.extend(rows)
                    if len(rows) < limit:
                        break
                    start += limit
                    await asyncio.sleep(0.2)
            # url = f"{self.base_url}/{self.store_api_key}/json/{self.store_service_name}/1/10000/"
            # async with session.get(url) as response:
            #     response.raise_for_status()
            #     data = await response.json()
            #     rows = data[self.store_service_name].get("row", [])
            df = pd.DataFrame(all_data)
            if df.empty:
                return pd.DataFrame()

            df["year_quarter"] = df["STDR_YYQU_CD"]
            df["year"] = df["year_quarter"].str[:4].astype(int)
            df["quarter"] = df["year_quarter"].str[4:].astype(int)

            df["region_name"] = df["ADSTRD_CD_NM"].str.replace("·", ".", regex=False)
            df["district_name"] = df["region_name"].map(self.dong_to_district)
            df["industry_name"] = df["SVC_INDUTY_CD_NM"]
            df["main_category"] = df["industry_name"].apply(self.get_main_category)
            df["store_count"] = pd.to_numeric(df["STOR_CO"], errors="coerce").fillna(0)

            # 대분류별 총합 계산
            total_df = df.groupby(["year", "quarter", "main_category"])["store_count"].sum().reset_index()
            total_df.columns = ["year", "quarter", "main_category", "main_category_total"]
            df = df.merge(total_df, on=["year", "quarter", "main_category"], how="left")

            return df
        except Exception as e:
            logger.error(f"상권 점포 API 오류: {e}")
            return pd.DataFrame()
        
    async def fetch_change_data(self, session) -> dict:
        """상권 변화 지표 데이터 API 호출"""
        try:
            all_data = []
            start = 1
            limit = 1000  # 페이지당 수
            while True:
                end = start + limit - 1
                url = f"{self.base_url}/{self.change_api_key}/json/{self.change_service_name}/{start}/{end}/"
                async with session.get(url) as response:
                    response.raise_for_status()
                    data = await response.json()
                    rows = data[self.change_service_name].get("row", [])
                    if not rows:
                        break
                    all_data.extend(rows)
                    if len(rows) < limit:
                        break
                    start += limit
                    await asyncio.sleep(0.2)
                
            # url = f"{self.base_url}/{self.change_api_key}/json/{self.change_service_name}/1/1000/"
            # async with session.get(url) as response:
            #     content_type = response.headers.get("Content-Type", "")
            #     if "application/json" not in content_type:
            #         text = await response.text()
            #         logger.error(f"API 응답이 JSON이 아님: {content_type}, 내용: {text}")
            #         return pd.DataFrame()

            #     response.raise_for_status()
            #     data = await response.json()
            #     rows = data[self.change_service_name].get("row", [])
            df = pd.DataFrame(all_data)
            if df.empty:
                return pd.DataFrame()
            
            df["year_quarter"] = df["STDR_YYQU_CD"]
            df["year"] = df["year_quarter"].str[:4].astype(int)
            df["quarter"] = df["year_quarter"].str[4:].astype(int)
            df["region_name"] = df["ADSTRD_CD_NM"]

            return df
        except Exception as e:
            logger.error(f"상권 변화 지표 API 오류: {e}")
            return pd.DataFrame()
        
    # async def update_store_data(self):
    #     """상권 분석 : 업종 데이터 수집 및 DB 저장"""
    #     from database.connector import database_instance as mariadb
    #     logger.error(f"📌 update_store_data() 실행 시작됨 - 객체 ID: {id(self)}")

    #     db = mariadb.pre_session()
    #     total_updated = 0
    #     total_saved = 0 

    #     try:
    #         logger.error("상권 점포 데이터 업데이트 시작")
    #         timeout = aiohttp.ClientTimeout(total=30)  # 타임아웃 설정 (API 무한대기 방지)
        
    #         async with aiohttp.ClientSession(timeout=timeout) as session:
    #             store_df = await self.fetch_store_data(session)
    #             logger.error(f"점포 데이터 수집 완료 - {len(store_df)} rows")  # ❗ 확인용 로그

    #             change_df = await self.fetch_change_data(session)                
    #             logger.error(f"상권 변화 지표 수집 완료 - {len(change_df)} rows")  # ❗ 확인용 로그

    #             if store_df.empty:
    #                 logger.warning("상권 점포 데이터 없음")
    #                 return
                
    #             if change_df.empty:
    #                 logger.warning("상권 변화 지표 데이터 없음")
    #                 return

    #             # 상권 변화 지표 병합
    #             merged_df = pd.merge(
    #                 store_df,
    #                 change_df,
    #                 on=["year", "quarter", "region_name"],
    #                 how="left"
    #             )

    #             # 저장 전 NaN 비교 기준 필드
    #             important_fields = [
    #                 "OPBIZ_RT", "OPBIZ_STOR_CO", "CLSBIZ_RT", "CLSBIZ_STOR_CO",
    #                 "TRDAR_CHNGE_IX", "TRDAR_CHNGE_IX_NM",
    #                 "OPR_SALE_MT_AVRG", "CLS_SALE_MT_AVRG",
    #                 "SU_OPR_SALE_MT_AVRG", "SU_CLS_SALE_MT_AVRG"
    #             ]

    #             for i, (_, row) in enumerate(merged_df.iterrows()):
    #                 try:
    #                     # 진행 상황 확인 로그 (100개마다)
    #                     if i % 100 == 0:
    #                         logger.info(f"{i}번째 row 처리 중...")

    #                     year, quarter = row["year"], row["quarter"]
    #                     region_name = row["region_name"]
    #                     district_name = row["district_name"]
    #                     industry_name = row["industry_name"]
                        
    #                     existing = db.query(StoreCategories).filter_by(
    #                         year=year,
    #                         quarter=quarter,
    #                         region_name=region_name,
    #                         industry_name=industry_name
    #                     ).first()

    #                     # 현재 데이터 NaN인지 확인
    #                     current_all_nan = all(pd.isna(row.get(field)) for field in important_fields)
                        
    #                     # 이미 DB에 저장된 데이터가 충분하다면, 혹은 새로 받은 데이터도 아무 의미 없는 값이라면, 건너뛰기
    #                     if existing:
    #                         existing_has_all_data = all([
    #                             getattr(existing, field.lower(), None) is not None for field in important_fields
    #                         ])
    #                         if existing_has_all_data or current_all_nan:
    #                             continue  # 저장 생략

    #                     main_category = row["main_category"]
    #                     store_count = row["store_count"]
    #                     main_category_total = row["main_category_total"]

    #                     open_rate = self.safe_get(row, "OPBIZ_RT")
    #                     open_store_count = self.safe_get(row, "OPBIZ_STOR_CO")
    #                     close_rate = self.safe_get(row, "CLSBIZ_RT")
    #                     close_store_count = self.safe_get(row, "CLSBIZ_STOR_CO")

    #                     ta_change_index = self.safe_get(row, "TRDAR_CHNGE_IX")
    #                     ta_change_index_name = self.safe_get(row, "TRDAR_CHNGE_IX_NM")
    #                     open_sales_month_avg = self.safe_get(row, "OPR_SALE_MT_AVRG")
    #                     close_sales_month_avg = self.safe_get(row, "CLS_SALE_MT_AVRG")
    #                     seoul_open_sales_month_avg = self.safe_get(row, "SU_OPR_SALE_MT_AVRG")
    #                     seoul_close_sales_month_avg = self.safe_get(row, "SU_CLS_SALE_MT_AVRG")


    #                     if existing:
    #                         existing.district_name = district_name
    #                         existing.main_category = main_category
    #                         existing.store_count = store_count
    #                         existing.main_category_total = main_category_total
    #                         existing.open_rate = open_rate
    #                         existing.open_store_count = open_store_count
    #                         existing.close_rate = close_rate
    #                         existing.close_store_count = close_store_count
    #                         existing.ta_change_index = ta_change_index
    #                         existing.ta_change_index_name = ta_change_index_name
    #                         existing.open_sales_month_avg = open_sales_month_avg
    #                         existing.close_sales_month_avg = close_sales_month_avg
    #                         existing.seoul_open_sales_month_avg = seoul_open_sales_month_avg
    #                         existing.seoul_close_sales_month_avg = seoul_close_sales_month_avg
    #                         existing.updated_at = datetime.now()
    #                         db.commit()
    #                         total_updated += 1
    #                     else:
    #                         new_record = StoreCategories(
    #                             year=year,
    #                             quarter=quarter,
    #                             district_name=district_name,
    #                             region_name=region_name,
    #                             industry_name=industry_name,
    #                             main_category=main_category,
    #                             store_count=store_count,
    #                             main_category_total=main_category_total,
    #                             open_rate=open_rate,
    #                             open_store_count=open_store_count,
    #                             close_rate=close_rate,
    #                             close_store_count=close_store_count,
    #                             ta_change_index=ta_change_index,
    #                             ta_change_index_name=ta_change_index_name,
    #                             open_sales_month_avg=open_sales_month_avg,
    #                             close_sales_month_avg=close_sales_month_avg,
    #                             seoul_open_sales_month_avg=seoul_open_sales_month_avg,
    #                             seoul_close_sales_month_avg=seoul_close_sales_month_avg,
    #                             created_at=datetime.now()
    #                         )
    #                         db.add(new_record)
    #                         db.commit()
    #                         total_saved += 1
    #                 except Exception as e:
    #                     db.rollback()
    #                     logger.warning(f"데이터 저장 실패: {e}")

    #             db.commit()
    #             logger.error(f"저장 완료 - 신규 {total_saved}건, 수정 {total_updated}건")

    #     except Exception as e:
    #         db.rollback()
    #         logger.error(f"데이터 처리 중 예외 발생: {e}")
    #     finally:
    #         db.close()
    async def update_store_data(self):
        """상권 분석 : 업종 데이터 수집 및 DB 저장 (bulk 저장 + UPSERT 방식 적용)"""
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()
        total_saved, total_updated = 0, 0

        try:
            logger.info("상권 점포 데이터 업데이트 시작")
            timeout = aiohttp.ClientTimeout(total=30)

            async with aiohttp.ClientSession(timeout=timeout) as session:
                store_df = await self.fetch_store_data(session)
                logger.info(f"점포 데이터 수집 완료: {len(store_df)} rows")

                change_df = await self.fetch_change_data(session)
                logger.info(f"상권 변화 지표 수집 완료: {len(change_df)} rows")

                if store_df.empty or change_df.empty:
                    logger.warning("점포 및 상권 변화 지표에서 수집된 데이터가 없음")
                    return

                # 상권 변화 지표 병합
                merged_df = pd.merge(store_df, change_df, on=["year", "quarter", "region_name"], how="left")

                # 기존 DB에서 (year, quarter, region_name, industry_name) 조합 로딩
                existing_rows = db.query(StoreCategories).all()
                existing_map = {
                    (r.year, r.quarter, r.region_name, r.industry_name): r for r in existing_rows
                }

                insert_list = []
                update_list = []

                for i, (_, row) in enumerate(merged_df.iterrows()):
                    if i % 200 == 0:
                        logger.info(f"{i}번째 row 처리 중...")

                    key = (row["year"], row["quarter"], row["region_name"], row["industry_name"])
                    base_data = {
                        "year": row["year"],
                        "quarter": row["quarter"],
                        "district_name": row["district_name"],
                        "region_name": row["region_name"],
                        "industry_name": row["industry_name"],
                        "main_category": row["main_category"],
                        "store_count": row["store_count"],
                        "main_category_total": row["main_category_total"],
                        "open_rate": self.safe_get(row, "OPBIZ_RT"),
                        "open_store_count": self.safe_get(row, "OPBIZ_STOR_CO"),
                        "close_rate": self.safe_get(row, "CLSBIZ_RT"),
                        "close_store_count": self.safe_get(row, "CLSBIZ_STOR_CO"),
                        "ta_change_index": self.safe_get(row, "TRDAR_CHNGE_IX"),
                        "ta_change_index_name": self.safe_get(row, "TRDAR_CHNGE_IX_NM"),
                        "open_sales_month_avg": self.safe_get(row, "OPR_SALE_MT_AVRG"),
                        "close_sales_month_avg": self.safe_get(row, "CLS_SALE_MT_AVRG"),
                        "seoul_open_sales_month_avg": self.safe_get(row, "SU_OPR_SALE_MT_AVRG"),
                        "seoul_close_sales_month_avg": self.safe_get(row, "SU_CLS_SALE_MT_AVRG"),
                        "updated_at": datetime.now()
                    }

                    if key in existing_map:
                        # update
                        base_data["store_statistic_id"] = existing_map[key].store_statistic_id
                        update_list.append(base_data)
                        total_updated += 1
                    else:
                        # insert
                        base_data["created_at"] = datetime.now()
                        insert_list.append(StoreCategories(**base_data))
                        total_saved += 1

                # 저장 처리
                if insert_list:
                    db.bulk_save_objects(insert_list)

                if update_list:
                    db.bulk_update_mappings(StoreCategories, update_list)

                db.commit()
                logger.error(f"상권 분석 : 업종 데이터 저장 완료 - 신규 {total_saved}건, 수정 {total_updated}건")

        except Exception as e:
            db.rollback()
            logger.error(f"업종 데이터 처리 중 예외 발생: {e}")
        finally:
            db.close()

store_category_service = StoreCategoryService()

# 단독 실행 테스트
if __name__ == "__main__":
    async def main():
        await store_category_service.update_store_data()
    asyncio.run(main())
