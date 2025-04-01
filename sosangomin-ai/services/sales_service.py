# services/sales_service.py

import sys
import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from dotenv import load_dotenv
from db_models import SalesData  
import json
import pandas as pd
from pandas import Series
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Optional, Dict, List, Any

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
logger = logging.getLogger(__name__)

class SalesService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.sales_api_key = os.getenv("SALES_API_KEY")
        self.base_url = "http://openapi.seoul.go.kr:8088"
        self.sales_service_name = "VwsmAdstrdSelngW"

        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_dir = os.path.join(base_dir, "..", "data")

        with open(os.path.join(json_dir, "seoul_dong_to_district.json"), "r", encoding="utf-8") as f:
            self.dong_to_district = json.load(f)

        with open(os.path.join(json_dir, "industry_to_main_category.json"), "r", encoding="utf-8") as f:
            self.industry_to_main_category = json.load(f)

        if not self.sales_api_key:
            logger.error("매출 인증키가 없습니다. 환경 변수를 확인하세요.")

    def get_main_category(self, industry_name: str) -> str:
        """업종명을 대분류로 변환"""
        for main_cat, names in self.industry_to_main_category.items():
            if industry_name in names:
                return main_cat
        return "기타"
    
    def safe_get(self, row: Series, key: str) -> int:
        try:
            return int(row.get(key) or 0)
        except (ValueError, TypeError):
            return 0
    
    async def fetch_sales_data(self, session) -> dict:
        """상권 매출 데이터 API 호출"""
        try:
            all_data = []
            start = 1
            limit = 1000 
            while True:
                end = start + limit - 1
                url = f"{self.base_url}/{self.sales_api_key}/json/{self.sales_service_name}/{start}/{end}/"
                async with session.get(url) as response:
                    response.raise_for_status()
                    data = await response.json()
                    rows = data[self.sales_service_name].get("row", [])
                    if not rows:
                        break
                    all_data.extend(rows)
                    if len(rows) < limit:
                        break
                    start += limit
                    await asyncio.sleep(0.2)
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
            df["sales_amount"] = pd.to_numeric(df["THSMON_SELNG_AMT"], errors="coerce").fillna(0)
            df["sales_count"] = pd.to_numeric(df["THSMON_SELNG_CO"], errors="coerce").fillna(0)

            # 대분류별 매출 금액 및 건수 총합 계산
            sales_df = df.groupby(["year", "quarter", "main_category"])[["sales_amount", "sales_count"]].sum().reset_index()
            sales_df.columns = ["year", "quarter", "main_category", "main_category_sales_amount", "main_category_sales_count"]
            df = df.merge(sales_df, on=["year", "quarter", "main_category"], how="left")

            return df
        except Exception as e:
            logger.error(f"상권 매출 API 오류: {e}")
            return pd.DataFrame()
        
    async def update_sales_data(self):
        """상권 분석 : 매출 데이터 수집 및 DB 저장"""
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()

        try:
            logger.info("상권 매출 데이터 업데이트 시작")
            timeout = aiohttp.ClientTimeout(total=30) 
            
            async with aiohttp.ClientSession(timeout=timeout) as session:
                df = await self.fetch_sales_data(session)
                
                if df.empty :
                    logger.warning("매출 데이터에서 수집된 데이터가 없음")
                    return
                
                # 기존 DB에서 (year, quarter, region_code, indu) 조합
                existing_rows = db.query(
                    SalesData.year,
                    SalesData.quarter,
                    SalesData.region_name,
                    SalesData.industry_name
                ).distinct().all()
                existing_set = set((y, q, r, i) for y, q, r, i in existing_rows)


                for _, row in df.iterrows():
                    year = row["year"]
                    quarter = row["quarter"]
                    region_name = row["region_name"]
                    district_name = row["district_name"]
                    industry_name = row["industry_name"]
                    main_category = row["main_category"]
                    sales_amount = row["sales_amount"]
                    sales_count = row["sales_count"]

                    # 이미 저장된 조합이면 스킵
                    if (year, quarter, region_name, industry_name) in existing_set:
                        continue
                    
                    try:
                        
                        sales_record = SalesData(
                            year=year,
                            quarter=quarter,
                            district_name=district_name,
                            region_name=region_name,
                            industry_name=industry_name,
                            main_category=main_category,

                            sales_amount=sales_amount,
                            sales_count=sales_count,

                            weekday_sales_amount=self.safe_get(row, "MDWK_SELNG_AMT"),
                            weekend_sales_amount=self.safe_get(row, "WKEND_SELNG_AMT"),
                            mon_sales_amount=self.safe_get(row, "MON_SELNG_AMT"),
                            tues_sales_amount=self.safe_get(row, "TUES_SELNG_AMT"),
                            wed_sales_amount=self.safe_get(row, "WED_SELNG_AMT"),
                            thur_sales_amount=self.safe_get(row, "THUR_SELNG_AMT"),
                            fri_sales_amount=self.safe_get(row, "FRI_SELNG_AMT"),
                            sat_sales_amount=self.safe_get(row, "SAT_SELNG_AMT"),
                            sun_sales_amount=self.safe_get(row, "SUN_SELNG_AMT"),
                            
                            time_00_06_sales_amount=self.safe_get(row, "TMZON_00_06_SELNG_AMT"),
                            time_06_11_sales_amount=self.safe_get(row, "TMZON_06_11_SELNG_AMT"),
                            time_11_14_sales_amount=self.safe_get(row, "TMZON_11_14_SELNG_AMT"),
                            time_14_17_sales_amount=self.safe_get(row, "TMZON_14_17_SELNG_AMT"),
                            time_17_21_sales_amount=self.safe_get(row, "TMZON_17_21_SELNG_AMT"),
                            time_21_24_sales_amount=self.safe_get(row, "TMZON_21_24_SELNG_AMT"),

                            male_sales_amount=self.safe_get(row, "ML_SELNG_AMT"),
                            female_sales_amount=self.safe_get(row, "FML_SELNG_AMT"),
                            age_10_sales_amount=self.safe_get(row, "AGRDE_10_SELNG_AMT"),
                            age_20_sales_amount=self.safe_get(row, "AGRDE_20_SELNG_AMT"),
                            age_30_sales_amount=self.safe_get(row, "AGRDE_30_SELNG_AMT"),
                            age_40_sales_amount=self.safe_get(row, "AGRDE_40_SELNG_AMT"),
                            age_50_sales_amount=self.safe_get(row, "AGRDE_50_SELNG_AMT"),
                            age_60_sales_amount=self.safe_get(row, "AGRDE_60_ABOVE_SELNG_AMT"),

                            weekday_sales_count=self.safe_get(row, "MDWK_SELNG_CO"),
                            weekend_sales_count=self.safe_get(row, "WKEND_SELNG_CO"),
                            mon_sales_count=self.safe_get(row, "MON_SELNG_CO"),
                            tues_sales_count=self.safe_get(row, "TUES_SELNG_CO"),
                            wed_sales_count=self.safe_get(row, "WED_SELNG_CO"),
                            thur_sales_count=self.safe_get(row, "THUR_SELNG_CO"),
                            fri_sales_count=self.safe_get(row, "FRI_SELNG_CO"),
                            sat_sales_count=self.safe_get(row, "SAT_SELNG_CO"),
                            sun_sales_count=self.safe_get(row, "SUN_SELNG_CO"),

                            time_00_06_sales_count=self.safe_get(row, "TMZON_00_06_SELNG_CO"),
                            time_06_11_sales_count=self.safe_get(row, "TMZON_06_11_SELNG_CO"),
                            time_11_14_sales_count=self.safe_get(row, "TMZON_11_14_SELNG_CO"),
                            time_14_17_sales_count=self.safe_get(row, "TMZON_14_17_SELNG_CO"),
                            time_17_21_sales_count=self.safe_get(row, "TMZON_17_21_SELNG_CO"),
                            time_21_24_sales_count=self.safe_get(row, "TMZON_21_24_SELNG_CO"),

                            male_sales_count=self.safe_get(row, "ML_SELNG_CO"),
                            female_sales_count=self.safe_get(row, "FML_SELNG_CO"),
                            age_10_sales_count=self.safe_get(row, "AGRDE_10_SELNG_CO"),
                            age_20_sales_count=self.safe_get(row, "AGRDE_20_SELNG_CO"),
                            age_30_sales_count=self.safe_get(row, "AGRDE_30_SELNG_CO"),
                            age_40_sales_count=self.safe_get(row, "AGRDE_40_SELNG_CO"),
                            age_50_sales_count=self.safe_get(row, "AGRDE_50_SELNG_CO"),
                            age_60_sales_count=self.safe_get(row, "AGRDE_60_ABOVE_SELNG_CO"),
                        )

                        db.add(sales_record)

                    except Exception as e:
                        logger.error(f"매출 데이터 저장 중 오류 발생: {e}")

                db.commit()
                logger.info(f"매출 데이터 저장 완료")
                return 

        except Exception as e:
            db.rollback()
            logger.error(f"매출 데이터 처리 중 예외 발생: {e}")
        finally:
            db.close()

sales_service = SalesService()

# 단독 실행 테스트
if __name__ == "__main__":
    async def main():
        await sales_service.update_sales_data()
    asyncio.run(main())
