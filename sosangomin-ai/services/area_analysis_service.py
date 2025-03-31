# services/area_analysis_service.py
import logging
from collections import defaultdict
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, tuple_
from db_models import StoreCategories, Population
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class AreaAnalysisService:
    def __init__(self):
        logger.info("AreaAnalysisService 초기화 완료")

    def get_summary_analysis(self, db: Session, region_name: str, industry_name: str) -> Dict[str, Any]:
        """상권분석 요약: 인구 + 업종 주요 정보"""
        try:
            # 인구분석
            resident = self.get_resident_population_analysis(db, region_name)
            working = self.get_working_population_analysis(db, region_name)
            floating = self.get_floating_population_analysis(db, region_name)

            # 업종분석
            food_stats = self.get_food_service_stats(db, region_name, industry_name)
            trend = self.get_store_open_close_trend(db, region_name, industry_name)

            # 최근 분기 추출 (trend는 오름차순 정렬된 4개 분기 리스트)
            if trend and trend.get("기준 연도") and trend.get("업소수"):
                recent_index = -1  # 가장 최근 분기
                recent_year = trend["기준 연도"][recent_index]
                recent_quarter = trend["기준 분기"][recent_index]
                store_count = trend["업소수"][recent_index]
                open_rate = trend["개업률"][recent_index]
                close_rate = trend["폐업률"][recent_index]
                open_count = int(round(store_count * open_rate))
                close_count = int(round(store_count * close_rate))
            else:
                recent_year, recent_quarter, store_count, open_count, close_count = (None,) * 5

            return {
                "인구분석": {
                    "가장_많은_거주_연령대": resident.get("가장_많은_성별_연령대"),
                    "가장_많은_직장_연령대": working.get("가장_많은_성별_연령대"),
                    "가장_많은_유동_연령대": floating.get("가장_많은_성별_연령대"),
                    "가장_많은_요일": floating.get("가장_많은_요일"),
                    "평일_주말_비교": {
                        "평일": floating.get("평일_평균_유동인구"),
                        "주말": floating.get("주말_평균_유동인구")
                    },
                    "가장_많은_시간대": floating.get("가장_많은_시간대")
                },
                "업종분석": {
                    "요식업_도넛_및_순위": {
                        "도넛": food_stats.get("행정동", {}).get("donut"),
                        "top3": food_stats.get("행정동", {}).get("top3"),
                        "내_업종_순위": food_stats.get("행정동", {}).get("industry_rank")
                    },
                    "내_업종_최근_분기": {
                        "기준 연도": recent_year,
                        "기준 분기": recent_quarter,
                        "업소수": store_count,
                        "개업수": open_count,
                        "폐업수": close_count
                    }
                }
            }

        except Exception as e:
            logger.error(f"상권 요약 분석 중 오류 발생: {e}")
            return {}


    def get_main_category_counts(self, db: Session, region_name: str) -> List[Dict[str, Any]]:
        """업종 분석 : 특정 행정동 기준 최신 4개 분기의 main_category별 점포 수 합계 조회"""
        try:
            # 최신 4개 (year, quarter) 조합
            subquery = (
                db.query(StoreCategories.year, StoreCategories.quarter)
                .distinct()
                .order_by(desc(StoreCategories.year), desc(StoreCategories.quarter))
                .limit(4)
                .subquery()
            )

            # 해당 분기들의 main_category별 점포 수 합계 조회
            result = (
                db.query(
                    StoreCategories.year,
                    StoreCategories.quarter,
                    StoreCategories.main_category,
                    func.sum(StoreCategories.store_count).label("store_count")
                )
                .filter(StoreCategories.region_name == region_name)
                .join(subquery, tuple_(StoreCategories.year, StoreCategories.quarter) == tuple_(subquery.c.year, subquery.c.quarter))
                .group_by(StoreCategories.year, StoreCategories.quarter, StoreCategories.main_category)
                .order_by(desc(StoreCategories.year), desc(StoreCategories.quarter))
                .all()
            )

            # 결과 변환
            grouped_data = defaultdict(lambda: {
                "year": None,
                "quarter": None,
                "main_category_store_count": {}
            })

            for row in result:
                key = (row.year, row.quarter)
                grouped_data[key]["year"] = row.year
                grouped_data[key]["quarter"] = row.quarter
                grouped_data[key]["main_category_store_count"][row.main_category] = row.store_count

            final_result = sorted(grouped_data.values(), key=lambda x: (x["year"], x["quarter"]), reverse=True)

            return final_result
        
        except Exception as e:
            logger.error(f"상권 분석 main_category 점포 수 조회 중 오류: {e}")
            return []
    
        
    def get_food_service_stats(self, db: Session, region_name: str, industry_name: str) -> Dict[str, Any]:
        """업종 분석 : 외식업 세부 업종 도넛 차트 + 상위 3개 업종 + 대상 업종 순위"""
        try:
            latest = db.query(
                StoreCategories.year,
                StoreCategories.quarter
            ).order_by(desc(StoreCategories.year), desc(StoreCategories.quarter)).first()

            if not latest:
                return {}

            year, quarter = latest.year, latest.quarter
            filters = (StoreCategories.year == year) & (StoreCategories.quarter == quarter)

            # district_name 매핑
            district_name_row = (
                db.query(StoreCategories.district_name)
                .filter(StoreCategories.region_name == region_name)
                .first()
            )
            district_name = district_name_row.district_name if district_name_row else None

            # 통계 + 순위 계산 함수
            def get_area_stats(area_field: str = None, area_value: str = None) -> Dict[str, Any]:
                query = db.query(
                    StoreCategories.industry_name,
                    func.sum(StoreCategories.store_count).label("count")
                ).filter(filters).filter(StoreCategories.main_category == "외식업")

                if area_field and area_value:
                    query = query.filter(getattr(StoreCategories, area_field) == area_value)

                query = query.group_by(StoreCategories.industry_name).order_by(desc("count")).all()

                donut = {row.industry_name: row.count for row in query}
                top3 = [{"category": row.industry_name, "count": row.count} for row in query[:3]]

                # 순위 계산
                industry_rank = None
                for idx, row in enumerate(query, start=1):
                    if row.industry_name == industry_name:
                        industry_rank = idx
                        break

                return {
                    "donut": donut,
                    "top3": top3,
                    "industry_rank": industry_rank
                }

            result = {
                "기준 연도": year,
                "기준 분기": quarter,
                "행정동": get_area_stats("region_name", region_name),
                "자치구": get_area_stats("district_name", district_name),
                "서울시": get_area_stats()
            }

            return result

        except Exception as e:
            logger.error(f"외식업 업종 분석 중 오류: {e}")
            return {}

    def get_store_open_close_trend(self, db: Session, region_name: str, industry_name: str) -> Dict[str, Any]:
        """업종 분석 : 최근 4분기 업소수 / 개업률 / 폐업률"""
        try:
            subquery = (
                db.query(StoreCategories.year, StoreCategories.quarter)
                .filter(StoreCategories.region_name == region_name)
                .filter(StoreCategories.industry_name == industry_name)
                .distinct()
                .order_by(desc(StoreCategories.year), desc(StoreCategories.quarter))
                .limit(4)
                .subquery()
            )

            records = (
                db.query(
                    StoreCategories.year,
                    StoreCategories.quarter,
                    func.sum(StoreCategories.store_count).label("store_count"),
                    func.avg(StoreCategories.open_rate).label("open_rate"),
                    func.avg(StoreCategories.close_rate).label("close_rate")
                )
                .filter(StoreCategories.region_name == region_name)
                .filter(StoreCategories.industry_name == industry_name)
                .join(subquery, tuple_(StoreCategories.year, StoreCategories.quarter) == tuple_(subquery.c.year, subquery.c.quarter))
                .group_by(StoreCategories.year, StoreCategories.quarter)
                .order_by(StoreCategories.year, StoreCategories.quarter)
                .all()
            )

            years = [r.year for r in records]
            quarters = [r.quarter for r in records]
            store_counts = [int(r.store_count) for r in records]
            open_rates = [round(float(r.open_rate), 2) for r in records]
            close_rates = [round(float(r.close_rate), 2) for r in records]

            return {
                "기준 연도": years,
                "기준 분기": quarters,
                "업소수": store_counts,
                "개업률": open_rates,
                "폐업률": close_rates,
            }

        except Exception as e:
            logger.error(f"4분기 추세 조회 중 오류 발생: {e}")
            return {}
        
    def get_operation_duration_summary(self, db: Session, region_name: str) -> Dict[str, Any]:
        """업종 분석 : 운영/폐업 영업 개월 평균 (행정동 + 자치구 + 서울시 전체 기준)"""
        try:
            # 최신 연도/분기 구하기
            latest = db.query(
                StoreCategories.year,
                StoreCategories.quarter
            ).order_by(desc(StoreCategories.year), desc(StoreCategories.quarter)).first()

            if not latest:
                return {}

            year, quarter = latest.year, latest.quarter
            filters = (StoreCategories.year == year) & (StoreCategories.quarter == quarter)

            # district_name 매핑 
            district_name_row = (
                db.query(StoreCategories.district_name)
                .filter(StoreCategories.region_name == region_name)
                .first()
            )
            district_name = district_name_row.district_name if district_name_row else None

            # 행정동 기준 평균
            region_row = (
                db.query(
                    func.avg(StoreCategories.open_sales_month_avg).label("open_avg"),
                    func.avg(StoreCategories.close_sales_month_avg).label("close_avg")
                )
                .filter(filters)
                .filter(StoreCategories.region_name == region_name)
                .first()
            )

            # 자치구 기준 평균
            district_row = (
                db.query(
                    func.avg(StoreCategories.open_sales_month_avg).label("open_avg"),
                    func.avg(StoreCategories.close_sales_month_avg).label("close_avg")
                )
                .filter(filters)
                .filter(StoreCategories.district_name == district_name)
                .first()
            )

            # 서울시 전체 기준 평균 (필터 없음)
            seoul_row = (
                db.query(
                    func.avg(StoreCategories.open_sales_month_avg).label("open_avg"),
                    func.avg(StoreCategories.close_sales_month_avg).label("close_avg")
                )
                .filter(filters)
                .first()
            )

            # 결과 딕셔너리 반환
            return {
                "기준 연도": year,
                "행정동 운영 영업 개월 평균": round(region_row.open_avg, 1) if region_row.open_avg else None,
                "행정동 폐업 영업 개월 평균": round(region_row.close_avg, 1) if region_row.close_avg else None,
                "자치구 운영 영업 개월 평균": round(district_row.open_avg, 1) if district_row.open_avg else None,
                "자치구 폐업 영업 개월 평균": round(district_row.close_avg, 1) if district_row.close_avg else None,
                "서울시 운영 영업 개월 평균": round(seoul_row.open_avg, 1) if seoul_row.open_avg else None,
                "서울시 폐업 영업 개월 평균": round(seoul_row.close_avg, 1) if seoul_row.close_avg else None
            }

        except Exception as e:
            logger.error(f"영업 개월 평균 분석 중 오류 발생: {e}")
            return {}
    
    def get_resident_population_analysis(self, db: Session, region_name: str) -> Dict[str, Any]:
        """인구 분석(상주인구) : 성별/연령대, 총인구, 서울 평균, 최대 인구 성별/연령대"""
        try:
            # 지역별 상주 인구 정보 조회
            region_row = (
                db.query(Population)
                .filter(Population.dong_name == region_name)
                .order_by(desc(Population.created_at))
                .first()
            )

            if not region_row:
                return {}

            # 서울시 전체 평균 상주 인구 계산
            seoul_avg = db.query(func.avg(Population.tot_repop)).scalar()

            # 성별/연령대별 값 딕셔너리 구성
            age_gender_keys = [
                "male_10", "male_20", "male_30", "male_40", "male_50", "male_60",
                "female_10", "female_20", "female_30", "female_40", "female_50", "female_60"
            ]

            pop_by_age_gender = {}
            for key in age_gender_keys:
                col_name = f"{key}_repop"
                pop_by_age_gender[key] = getattr(region_row, col_name, 0) or 0

            # 가장 높은 인구를 가진 성별/연령대
            max_age_gender = max(pop_by_age_gender.items(), key=lambda x: x[1])

            return {
                "성별_연령별_상주인구": pop_by_age_gender,  # 막대그래프용
                "총_상주인구": region_row.tot_repop,
                "서울시_평균_상주인구": round(seoul_avg, 1) if seoul_avg else None,
                "가장_많은_성별_연령대": {
                    "구분": region_row.dominant_age_gender_repop,
                    "인구수": max_age_gender[1]
                }
            }

        except Exception as e:
            logger.error(f"상주 인구 분석 중 오류 발생: {e}")
            return {}

    def get_working_population_analysis(self, db: Session, region_name: str) -> Dict[str, Any]:
        """인구 분석(직장인구) : 성별/연령대, 총인구, 서울 평균, 최대 인구 성별/연령대"""
        try:
            region_row = (
                db.query(Population)
                .filter(Population.dong_name == region_name)
                .order_by(desc(Population.created_at))
                .first()
            )

            if not region_row:
                return {}

            seoul_avg = db.query(func.avg(Population.tot_wrpop)).scalar()

            age_gender_keys = [
                "male_10", "male_20", "male_30", "male_40", "male_50", "male_60",
                "female_10", "female_20", "female_30", "female_40", "female_50", "female_60"
            ]

            pop_by_age_gender = {}
            for key in age_gender_keys:
                col_name = f"{key}_wrpop"
                pop_by_age_gender[key] = getattr(region_row, col_name, 0) or 0

            max_age_gender = max(pop_by_age_gender.items(), key=lambda x: x[1])

            return {
                "성별_연령별_직장인구": pop_by_age_gender,  
                "총_직장인구": region_row.tot_wrpop,
                "서울시_평균_직장인구": round(seoul_avg, 1) if seoul_avg else None,
                "가장_많은_성별_연령대": {
                    "구분": region_row.dominant_age_gender_wrpop,
                    "인구수": max_age_gender[1]
                }
            }

        except Exception as e:
            logger.error(f"직장 인구 분석 중 오류 발생: {e}")
            return {}
        

    def get_floating_population_analysis(self, db: Session, region_name: str) -> Dict[str, Any]:
        """인구 분석(유동인구) : 성별/연령대, 총인구, 서울 평균, 최대 인구 성별/연령대"""
        try:
            region_row = (
                db.query(Population)
                .filter(Population.dong_name == region_name)
                .order_by(desc(Population.created_at))
                .first()
            )

            if not region_row:
                return {}

            seoul_avg = db.query(func.avg(Population.tot_fpop)).scalar()

            age_gender_keys = [
                "male_10", "male_20", "male_30", "male_40", "male_50", "male_60",
                "female_10", "female_20", "female_30", "female_40", "female_50", "female_60"
            ]

            pop_by_age_gender = {}
            for key in age_gender_keys:
                col_name = f"{key}_fpop"
                pop_by_age_gender[key] = getattr(region_row, col_name, 0) or 0

            max_age_gender = max(pop_by_age_gender.items(), key=lambda x: x[1])

            # 요일별 유동 인구
            weekday_data = {
                "monday": region_row.monday_fpop,
                "tuesday": region_row.tuesday_fpop,
                "wednesday": region_row.wednesday_fpop,
                "thursday": region_row.thursday_fpop,
                "friday": region_row.friday_fpop,
                "saturday": region_row.saturday_fpop,
                "sunday": region_row.sunday_fpop
            }

            # 시간대별 유동 인구
            time_data = {
                "심야": region_row.late_night_fpop, # 00시~06시 
                "이른 아침": region_row.early_morning_fpop, # 06시~09시
                "오전": region_row.morning_peak_fpop, # 09시~12시
                "오후": region_row.afternoon_fpop, #12시~15시
                "퇴근 시간": region_row.evening_peak_fpop, #15시~18시
                "저녁": region_row.night_fpop, #18시~21시
                "밤": region_name.night_population #21시~00시
            }

            return {
                "성별_연령별_유동인구": pop_by_age_gender,  
                "총_유동인구": region_row.tot_fpop,
                "서울시_평균_유동인구": round(seoul_avg, 1) if seoul_avg else None,
                "가장_많은_성별_연령대": {
                    "구분": region_row.dominant_age_gender_fpop,
                    "인구수": max_age_gender[1]
                },
                "요일별_유동인구": weekday_data,  # 막대 그래프
                "가장_많은_요일": region_row.busiest_day_fpop,
                "가장_적은_요일": region_row.quietest_day_fpop,
                "평일_평균_유동인구": round(region_row.weekday_avg_fpop, 1) if region_row.weekday_avg_fpop else None,
                "주말_평균_유동인구": round(region_row.weekend_avg_fpop, 1) if region_row.weekend_avg_fpop else None,

                "시간대별_유동인구": time_data,  # 선 그래프
                "가장_많은_시간대": region_row.busiest_hour_fpop,
                "가장_적은_시간대": region_row.quietest_hour_fpop            
            }

        except Exception as e:
            logger.error(f"유동 인구 분석 중 오류 발생: {e}")
            return {}




# 서비스 인스턴스 생성
area_analysis_service = AreaAnalysisService()
