import pandas as pd
import os
import json
from sqlalchemy.orm import Session
from database.connector import database_instance
from db_models import Population, Facilities, SalesData, RentInfo, StoreCategories
from sklearn.preprocessing import MinMaxScaler
from typing import List
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

class LocationRecomService:
    def __init__(self):
        logger.info("LocationRecomService 초기화 완료")

        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_dir = os.path.join(base_dir, "..", "data")

        with open(os.path.join(json_dir, "area_data.json"), "r", encoding="utf-8") as f:
            self.area_data = json.load(f)

    def prepare_initial_heatmap_data(self) -> pd.DataFrame:
        """상권분석 페이지 초기 히트맵을 위한 데이터 처리"""
        db = database_instance.pre_session()
        try:
            # 1. 인구 정보
            pop_rows = db.query(Population).all()
            pop_data = []
            for row in pop_rows:
                try:    
                    pop_data.append({
                        "행정동명": row.region_name,
                        "유동인구": row.tot_fpop or 0,
                        "직장인구": row.tot_wrpop or 0,
                        "거주인구": row.tot_repop or 0
                    })
                except Exception as e:
                    logger.warning(f"히트맵 인구 데이터 처리 오류: {e}")

            df_pop = pd.DataFrame(pop_data)

            # 2. 점포 수 정보
            latest_store = db.query(StoreCategories.year, StoreCategories.quarter).order_by(StoreCategories.year.desc(), StoreCategories.quarter.desc()).first()
            store_rows = db.query(StoreCategories).filter(
                StoreCategories.year == latest_store.year,
                StoreCategories.quarter == latest_store.quarter,
                StoreCategories.main_category == "외식업"
            ).all()

            store_data = [
                {
                    'region_name': row.region_name,
                    'store_count': row.store_count,
                    'open_rate': row.open_rate,
                    'close_rate': row.close_rate
                }
                for row in store_rows
            ]

            df_sales = pd.DataFrame(store_data)

            # 행정동 단위로 계산
            df_sales_group = df_sales.groupby('region_name').agg({
                    'store_count': 'sum',
                    'open_rate': 'mean',
                    'close_rate': 'mean'
                }).reset_index()
            df_sales_group.columns = ['행정동명', '총 업소 수', '평균 개업률', '평균 폐업률']
            df_sales_group['평균 개업률'] = df_sales_group['평균 개업률'].round(2)
            df_sales_group['평균 폐업률'] = df_sales_group['평균 폐업률'].round(2)

            merged = df_pop.merge(df_sales_group, on="행정동명", how="left")
            merged = merged.fillna(0)
            result = merged.to_dict(orient="records")
            return result
        except Exception as e:
            db.rollback()
            logger.error(f'히트맵 데이터 처리 중 오류: {e}')
            raise HTTPException(status_code=401)
        finally:
            db.close()

    def get_integrated_location_dataframe(self, target_age: str, industry_name: str) -> pd.DataFrame:
        """입지추천을 위한 데이터 병합 수행(타겟연령, 업종 반영)"""
        db = database_instance.pre_session()
        try:
            # 1. 인구 정보
            pop_rows = db.query(Population).all()
            pop_data = []
            for row in pop_rows:
                try:
                    total_pop = (row.tot_fpop or 0) + (row.tot_wrpop or 0) + (row.tot_repop or 0)
                    target_total = (
                        (getattr(row, f"female_{target_age}_fpop", 0) or 0) + (getattr(row, f"male_{target_age}_fpop", 0) or 0) +
                        (getattr(row, f"female_{target_age}_repop", 0) or 0) + (getattr(row, f"male_{target_age}_repop", 0) or 0) +
                        (getattr(row, f"female_{target_age}_wrpop", 0) or 0) + (getattr(row, f"male_{target_age}_wrpop", 0) or 0)
                    )
                    target_ratio = target_total / total_pop if total_pop else 0
                    pop_data.append({
                        "행정동명": row.region_name,
                        f"타겟연령_비율": target_ratio,
                        f"타겟연령_수": target_total,
                        "유동인구": row.tot_fpop or 0,
                        "직장인구": row.tot_wrpop or 0,
                        "거주인구": row.tot_repop or 0
                    })
                except Exception as e:
                    logger.warning(f"입지추천 인구 데이터 처리 오류: {e}")

            df_pop = pd.DataFrame(pop_data)

            # 2. 시설 정보 - 가장 최근 연도/분기 데이터만 사용
            latest_facility = db.query(Facilities.year, Facilities.quarter).order_by(Facilities.year.desc(), Facilities.quarter.desc()).limit(1).first()
            facility_rows = db.query(Facilities).filter(
                Facilities.year == latest_facility.year,
                Facilities.quarter == latest_facility.quarter
            ).all()
            facility_data = [
                {
                    "행정동명": row.region_name,
                    "접근성_합": (
                        (row.arprt_co or 0) + (row.rlroad_statn_co or 0) +
                        (row.bus_trminl_co or 0) + (row.subway_statn_co or 0) + (row.bus_sttn_co or 0)
                    ),
                    "집객시설": row.viatr_fclty_co or 0
                }
                for row in facility_rows
            ]
            df_facility = pd.DataFrame(facility_data)

            # 3. 매출 정보 - 최신 연도/분기 기준
            latest_sales = db.query(SalesData.year, SalesData.quarter).order_by(SalesData.year.desc(), SalesData.quarter.desc()).first()
            sales_rows = db.query(SalesData).filter(
                SalesData.year == latest_sales.year,
                SalesData.quarter == latest_sales.quarter,
                SalesData.industry_name == industry_name
            ).all()

            # 4. 점포 수 정보 - 최신 기준
            latest_store = db.query(StoreCategories.year, StoreCategories.quarter).order_by(StoreCategories.year.desc(), StoreCategories.quarter.desc()).first()
            storecat_rows = db.query(StoreCategories).filter(
                StoreCategories.year == latest_store.year,
                StoreCategories.quarter == latest_store.quarter,
                StoreCategories.industry_name == industry_name
            ).all()
            storecat_dict = {row.region_name: row.store_count or 0 for row in storecat_rows}

            sales_data = []
            for row in sales_rows:
                store_count = storecat_dict.get(row.region_name, 0)
                avg_sales = (row.sales_amount / store_count) if store_count else 0
                sales_data.append({
                    "행정동명": row.region_name,
                    "업종_평균_매출": avg_sales
                })
            df_sales = pd.DataFrame(sales_data)

            storecat_data = [
                {"행정동명": row.region_name, 
                "동일업종_수": row.store_count or 0}
                for row in storecat_rows
            ]
            df_storecat = pd.DataFrame(storecat_data)

            # 5. 임대료 
            latest_rent = db.query(RentInfo.STRD_YR_CD, RentInfo.STRD_QTR_CD).order_by(RentInfo.STRD_YR_CD.desc(), RentInfo.STRD_QTR_CD.desc()).first()
            rent_rows = db.query(RentInfo).filter(
                RentInfo.STRD_YR_CD == latest_rent.STRD_YR_CD,
                RentInfo.STRD_QTR_CD == latest_rent.STRD_QTR_CD,
                RentInfo.LET_CURPRC_FLR_CLSF_CD_NM == "전체층"
            ).all()
            rent_data = [
                {"행정동명": row.ADSTRD_CD_NM, "임대료": row.EXCHE_RENTCG_AVE or 0}
                for row in rent_rows
            ]
            df_rent = pd.DataFrame(rent_data)

            merged = df_pop.merge(df_facility, on="행정동명", how="left")
            merged = merged.merge(df_sales, on="행정동명", how="left")
            merged = merged.merge(df_storecat, on="행정동명", how="left")
            merged = merged.merge(df_rent, on="행정동명", how="left")
            merged['면적(㎢)'] = pd.to_numeric(merged['행정동명'].map(self.area_data))


            merged_unique = merged.groupby("행정동명").agg({
                "타겟연령_비율": "mean",
                "타겟연령_수": "mean",
                "업종_평균_매출": "mean",
                "임대료": "mean",
                "유동인구": "mean",
                "직장인구": "mean",
                "거주인구": "mean",
                "동일업종_수": "mean",
                "집객시설": "mean",
                "접근성_합": "mean",
                "면적(㎢)": "mean" 
            }).reset_index()

            for col in ["유동인구", "직장인구", "거주인구", "동일업종_수", "집객시설", "접근성_합"]:
                if col in merged_unique.columns:
                    merged_unique[f"{col}(면적당)"] = merged_unique[col] / merged_unique["면적(㎢)"]
            merged_unique.rename(columns={"접근성_합(면적당)": "접근성"}, inplace=True)
            merged_unique = merged_unique.drop(columns=["면적(㎢)", "유동인구", "직장인구", "거주인구", "동일업종_수", "집객시설", "접근성_합"], errors="ignore")

            # print("======================")
            # print("merged_unique")
            # print(merged_unique["행정동명"].nunique())
            # print("======================")

            return merged_unique.fillna(0)
        
        except Exception as e:
            db.rollback()
            logger.error(f'데이터 병합 중 오류: {e}')
            raise HTTPException(status_code=401)
        finally:
            db.close()

    def calculate_location_scores(self, df: pd.DataFrame, priority: List[str]) -> pd.DataFrame:
        "입지추천을 위한 행정동별 점수 계산"

        priority_weights = {col: 0.5 for col in ["타겟연령", "유동인구", "직장인구", "거주인구", "동일 업종 수", "업종 매출", "임대료", "집객시설 수", "접근성"]}
        
        for i, col in enumerate(priority):
            priority_weights[col] = 2 - i*0.5  

        scaler = MinMaxScaler()
        score_components = pd.DataFrame()

        # 타겟연령 점수 계산 (비율과 수 모두 정규화 후 평균)
        target_ratio_scaled = scaler.fit_transform(df[["타겟연령_비율"]]).flatten()  # 1D 배열로 변환
        target_count_scaled = scaler.fit_transform(df[["타겟연령_수"]]).flatten()  # 1D 배열로 변환
        score_components["타겟연령"] = (target_ratio_scaled + target_count_scaled) / 2

        # 나머지 지표 정규화
        for col, label in [
            ("유동인구(면적당)", "유동인구"),
            ("직장인구(면적당)", "직장인구"),
            ("거주인구(면적당)", "거주인구"),
            ("동일업종_수(면적당)", "동일 업종 수"),
            ("업종_평균_매출", "업종 매출"),
            ("임대료", "임대료"),  
            ("집객시설(면적당)", "집객시설 수"),
            ("접근성", "접근성")
        ]:
            value = df[col].copy()
            if label == "임대료":
                value = -value  # 낮을수록 유리
            score_components[label] = scaler.fit_transform(value.values.reshape(-1, 1))

        # 최종 점수 계산
        score_components["최종점수"] = sum(
            score_components[col] * weight for col, weight in priority_weights.items()
        )

        # 결과 생성
        result = df.copy()
        result["점수"] = score_components["최종점수"] *(100/9) # 100점 만점

        return result
    
    def round_values(self, data: dict, decimals: int = 2) -> dict:
        """데이터의 모든 숫자 값을 지정된 자릿수로 반올림"""
        return {key: round(value, decimals) if isinstance(value, (int, float)) else value for key, value in data.items()}

    def assign_grades_by_quantile(self, df: pd.DataFrame) -> pd.DataFrame:
        """점수를 기반으로 행정동의 등급 부여"""
        # 점수 열을 기준으로 5개의 구간을 설정
        labels = ['5등급', '4등급', '3등급', '2등급', '1등급']
        
        # 점수를 기준으로 5개 구간으로 나누는 Quantile Binning
        df['등급'] = pd.qcut(df['점수'], q=5, labels=labels)
        
        return df

    def recommend_location(self, user_input: dict, top_n: int = 3) -> dict:
        """상위 n개의 행정동을 추천하고 상세정보 반환"""
        target_age = user_input["target_age"]
        industry_name = user_input["industry_name"]
        priority = user_input["priority"]

        preprocess = self.get_integrated_location_dataframe(target_age, industry_name)        
        result = self.calculate_location_scores(preprocess, priority)

        avg_data = result[[
            "타겟연령_비율", "타겟연령_수", "업종_평균_매출", "임대료",
            "유동인구(면적당)", "직장인구(면적당)", "거주인구(면적당)",
            "동일업종_수(면적당)", "집객시설(면적당)", "접근성"
        ]].mean().to_dict()
        avg_data = self.round_values(avg_data, 2)

        # 상위 N개 행정동 추출
        top_locations = result.sort_values("점수", ascending=False).head(top_n)
        top_locations = top_locations[[
            "행정동명", "타겟연령_비율", "타겟연령_수", "업종_평균_매출", "임대료",
            "유동인구(면적당)", "직장인구(면적당)", "거주인구(면적당)",
            "동일업종_수(면적당)", "집객시설(면적당)", "접근성"
        ]]
        top_locations = top_locations.round(2)

        # 전체 정보 표기 + 등급 
        total = result.copy()
        total = total.round(2)
        total = self.assign_grades_by_quantile(total)
        total = total.drop(columns="점수")

        return {
            "top_n":{
                "top_locations": top_locations.reset_index(drop=True).to_dict(orient="records"),
                "average_values": avg_data
            },
            "total": total.reset_index(drop=True).to_dict(orient="records")
        }
    

# 서비스 인스턴스 생성
location_recommendation_service = LocationRecomService()

# 단독 테스트 실행용
import asyncio
if __name__ == "__main__":
    user_input= {
    "industry_name": "한식음식점",
    "target_age": "20",
    "priority": ["타겟연령", "임대료","거주인구"]
    }
    async def main():
        # result = location_recommendation_service.recommend_location(user_input)
        result = location_recommendation_service.prepare_initial_heatmap_data()
        print(json.dumps(result, ensure_ascii=False, indent=4))
    asyncio.run(main())
