# services/area_analysis_service.py
import logging
from collections import defaultdict
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, tuple_
from db_models import StoreCategories, Population, SalesData
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class AreaAnalysisService:
    def __init__(self):
        logger.info("AreaAnalysisService 초기화 완료")

    # =====================
    #  상권 분석 요약
    # =====================

    def get_summary_analysis(self, db: Session, region_name: str, industry_name: str) -> Dict[str, Any]:
        """상권분석 요약: 인구 + 업종 주요 정보"""
        try:
            # 인구분석
            resident = self.get_resident_population_analysis(db, region_name)
            working = self.get_working_population_analysis(db, region_name)
            floating = self.get_floating_population_analysis(db, region_name)

            # 업종분석
            category_stats = self.get_food_store_category_stats(db, region_name, industry_name)
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

            # 매출분석
            sales_stats = self.get_food_store_sales_stats(db, region_name, industry_name)
            detail = self.get_sales_detail(db, region_name, industry_name)

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
                        "도넛": category_stats.get("행정동", {}).get("donut"),
                        "top3": category_stats.get("행정동", {}).get("top3"),
                        "내_업종_순위": category_stats.get("행정동", {}).get("industry_rank")
                    },
                    "내_업종_최근_분기": {
                        "기준 연도": recent_year,
                        "기준 분기": recent_quarter,
                        "업소수": store_count,
                        "개업수": open_count,
                        "폐업수": close_count
                    }
                },
                "매출분석": {
                    "요식업_도넛_및_순위": {
                        "도넛": sales_stats.get("행정동", {}).get("donut"),
                        "top3": sales_stats.get("행정동", {}).get("top3"),
                        "내_업종_순위": sales_stats.get("행정동", {}).get("industry_rank")
                    },
                    "매출_금액_많은_요일": detail.get("요약", {}).get("매출_금액_많은_요일"),
                    "매출_금액_많은_시간대": detail.get("요약", {}).get("매출_금액_많은_시간대"),
                    "매출_금액_많은_연령대": detail.get("요약", {}).get("매출_금액_많은_연령대"), 
                    "매출_건수_많은_요일": detail.get("요약", {}).get("매출_건수_많은_요일"),
                    "매출_건수_많은_시간대": detail.get("요약", {}).get("매출_건수_많은_시간대"),
                    "매출_건수_많은_연령대": detail.get("요약", {}).get("매출_건수_많은_연령대"),

                }
            }

        except Exception as e:
            logger.error(f"상권 요약 분석 중 오류 발생: {e}")
            return {}
        
    # =====================
    #  인구 데이터 분석 
    # =====================
    
    def get_resident_population_analysis(self, db: Session, region_name: str) -> Dict[str, Any]:
        """인구 분석(상주인구) : 성별/연령대, 총인구, 서울 평균, 최대 인구 성별/연령대"""
        try:
            # 지역별 상주 인구 정보 조회
            region_row = (
                db.query(Population)
                .filter(Population.region_name == region_name)
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
                .filter(Population.region_name == region_name)
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
                .filter(Population.region_name == region_name)
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
                "점심": region_row.midday_fpop,  #12시~15시
                "오후": region_row.afternoon_fpop,  #15시~18시
                "퇴근 시간": region_row.evening_peak_fpop, #18시~21시
                "밤": region_row.night_fpop,  #21시~00시
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


    # =====================
    #  업종 데이터 분석 
    # =====================
    def get_main_category_store_count(self, db: Session, region_name: str) -> List[Dict[str, Any]]:
        """업종 분석 : 특정 행정동 기준 최신 4개 분기의 main_category별 점포 수 증감률(%) 조회 (직전 분기와 비교, 0일 경우 None 처리, 최초 분기 제외)"""
        try:
            # 최신 4개 (year, quarter) 조합
            subquery = (
                db.query(StoreCategories.year, StoreCategories.quarter)
                .distinct()
                .order_by(desc(StoreCategories.year), desc(StoreCategories.quarter))
                .limit(4)
                .subquery()
            )

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

            # 데이터를 {(year, quarter): {main_category: store_count}} 형태로 변환
            data = defaultdict(dict)
            for row in result:
                data[(row.year, row.quarter)][row.main_category] = row.store_count

            # 분기 최신순 정렬
            sorted_periods = sorted(data.keys(), reverse=True)

            growth_rate_trend = []
            summary = None

            for idx in range(len(sorted_periods) - 1):  # 마지막 분기 제외 → 최근 3개 분기 추세
                current_period = sorted_periods[idx]
                prev_period = sorted_periods[idx + 1]

                year, quarter = current_period
                current_counts = data[current_period]
                prev_counts = data[prev_period]

                # 5. 업종별 증감률 계산
                growth_rate_dict = {}
                for category, current_count in current_counts.items():
                    prev_count = prev_counts.get(category, 0)
                    if prev_count == 0:
                        growth_rate = None
                    else:
                        growth_rate = round((current_count - prev_count) / prev_count * 100, 2)
                    growth_rate_dict[category] = growth_rate

                # 6. 최신 분기에 대해서 summary 생성
                if idx == 0:
                    food_growth = growth_rate_dict.get("외식업")
                    retail_growth = growth_rate_dict.get("도소매업")
                    service_growth = growth_rate_dict.get("서비스업")

                    current_total = sum(current_counts.values())
                    prev_total = sum(prev_counts.values())
                    food_curr = current_counts.get("외식업", 0)
                    food_prev = prev_counts.get("외식업", 0)

                    food_share_curr = food_curr / current_total * 100 if current_total > 0 else 0
                    food_share_prev = food_prev / prev_total * 100 if prev_total > 0 else 0

                    summary = self.generate_store_count_insight_summary(
                        food_growth,
                        food_share_prev,
                        food_share_curr,
                        retail_growth,
                        service_growth
                    )

                # 7. 결과 저장
                growth_rate_trend.append({
                    "year": year,
                    "quarter": quarter,
                    "main_category_store_count_growth_rate": growth_rate_dict
                })

            return {
                "growth_rate_trend": growth_rate_trend,
                "summary": summary
            }

        except Exception as e:
            logger.error(f"상권 분석 main_category 점포 증감률 분석 중 오류 : {e}")
            return {
                "growth_rate_trend": [],
                "summary": None
            }
    
        
    def get_food_store_category_stats(self, db: Session, region_name: str, industry_name: str) -> Dict[str, Any]:
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
                "행정동 이름": region_name,
                "자치구 이름": district_name,
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
        
    def get_store_operation_duration_summary(self, db: Session, region_name: str) -> Dict[str, Any]:
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
                "행정동 이름": region_name,
                "자치구 이름": district_name,
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
        
    def generate_store_count_insight_summary(self, food_growth: float, food_share_prev: float, food_share_curr: float, retail_growth: float, service_growth: float ) -> str:
        try:
            # 외식업 증감 해석
            if food_growth is None:
                food_part = "외식업 점포 수는 직전 분기와 비교할 수 없습니다."
            elif food_growth > 0:
                food_part = f"외식업 점포 수는 직전 분기 대비 {round(food_growth, 1)}% 증가해 경쟁이 다소 심화되는 모습입니다."
            elif food_growth < 0:
                food_part = f"외식업 점포 수는 {abs(round(food_growth, 1))}% 감소해 일부 점포가 정리되는 흐름을 보였습니다."
            else:
                food_part = "외식업 점포 수는 직전 분기와 동일한 수준을 유지했습니다."

            # 비중 변화 해석
            share_change_text = ""
            if food_share_curr > food_share_prev:
                share_change_text = f" 전체 업종 중 외식업 점유율은 {round(food_share_prev, 1)}%에서 {round(food_share_curr, 1)}%로 증가해 상권 내 비중이 확대되었습니다."
            elif food_share_curr < food_share_prev:
                share_change_text = f" 외식업 점유율은 {round(food_share_prev, 1)}%에서 {round(food_share_curr, 1)}%로 줄어 상권 내 외식업 비중이 다소 낮아졌습니다."
            else:
                share_change_text = f" 외식업 점유율은 {round(food_share_curr, 1)}%로 변함이 없었습니다."

            # 타 업종과 비교
            comparison_parts = []
            if retail_growth is not None:
                if retail_growth > 0:
                    comparison_parts.append("도소매업 점포 수는 증가")
                elif retail_growth < 0:
                    comparison_parts.append("도소매업 점포 수는 감소")

            if service_growth is not None:
                if service_growth > 0:
                    comparison_parts.append("서비스업 점포 수는 증가")
                elif service_growth < 0:
                    comparison_parts.append("서비스업 점포 수는 감소")

            comparison_summary = ""
            if comparison_parts:
                comparison_summary = " / " + " / ".join(comparison_parts) + "한 것으로 나타났습니다."

            # 최종 결론
            conclusion = ""
            if food_growth is not None and food_growth > 0 and food_share_curr > food_share_prev:
                conclusion = " 외식업 진입이 활발해지고 있는 시점으로 판단됩니다."
            elif food_growth is not None and food_growth < 0 and food_share_curr < food_share_prev:
                conclusion = " 외식업 비중과 점포 수가 함께 줄어드는 흐름으로, 시장 위축 가능성이 있습니다."
            elif food_growth is not None and food_growth > 0 and (retail_growth is not None and retail_growth < 0):
                conclusion = " 외식업은 증가하는 반면 도소매업은 줄어들어 외식업 중심으로 전환되는 가능성이 있습니다."
            else:
                conclusion = ""

            return food_part + share_change_text + comparison_summary + conclusion

        except Exception as e:
            return f"요약 생성 중 오류 발생: {e}"
            
    # =====================
    #  매출 데이터 분석 
    # =====================

    def get_main_category_sales_count(self, db: Session, region_name: str) -> List[Dict[str, Any]]:
        """대분류별 매출 건수 증감률 추세 (최근 4개 분기 기준, 직전 분기와 비교, 0일 경우 None, 최초 분기 제외)"""
        try:
            subquery = (
                db.query(SalesData.year, SalesData.quarter)
                .distinct()
                .order_by(desc(SalesData.year), desc(SalesData.quarter))
                .limit(4)
                .subquery()
            )

            results = (
                db.query(
                    SalesData.year,
                    SalesData.quarter,
                    SalesData.main_category,
                    func.sum(SalesData.sales_count).label("total_sales_count")
                )
                .filter(SalesData.region_name == region_name)
                .join(subquery, tuple_(SalesData.year, SalesData.quarter) == tuple_(subquery.c.year, subquery.c.quarter))
                .group_by(SalesData.year, SalesData.quarter, SalesData.main_category)
                .order_by(desc(SalesData.year), desc(SalesData.quarter))
                .all()
            )

            # {(year, quarter): {main_category: sales_count}} 형태로 정리
            data = defaultdict(dict)
            for row in results:
                data[(row.year, row.quarter)][row.main_category] = row.total_sales_count

            # 분기 정렬 (최신순)
            sorted_periods = sorted(data.keys(), reverse=True)

            growth_rate_trend = []
            summary = None 
            for idx in range(len(sorted_periods) - 1):  # 가장 오래된 분기 제외
                current_period = sorted_periods[idx]
                prev_period = sorted_periods[idx + 1]

                year, quarter = current_period
                current_counts = data[current_period]
                prev_counts = data[prev_period]

                # 증감률 계산 
                growth_rate_dict = {}
                for category, current_count in current_counts.items():
                    prev_count = prev_counts.get(category, 0)
                    if prev_count == 0:
                        growth_rate = None
                    else:
                        growth_rate = round((current_count - prev_count) / prev_count * 100, 2)
                    growth_rate_dict[category] = growth_rate

                
                # 최신 분기에 대해서만 summary 생성
                if idx == 0:
                    food_growth = growth_rate_dict.get("외식업")
                    retail_growth = growth_rate_dict.get("도소매업")
                    service_growth = growth_rate_dict.get("서비스업")

                    current_total = sum(current_counts.values())
                    prev_total = sum(prev_counts.values())
                    food_prev_count = prev_counts.get("외식업", 0)
                    food_curr_count = current_counts.get("외식업", 0)
                    
                    food_share_prev = food_prev_count / prev_total * 100 if prev_total > 0 else 0
                    food_share_curr = food_curr_count / current_total * 100 if current_total > 0 else 0
                    
                    summary = self.generate_food_sales_insight_summary(food_growth, food_share_prev, food_share_curr, retail_growth, service_growth)


                growth_rate_trend.append({
                    "year": year,
                    "quarter": quarter,
                    "main_category_sales_count_growth_rate": growth_rate_dict
                })

            return {
                "growth_rate_trend": growth_rate_trend,
                "summary": summary
            }
        
        except Exception as e:
            logger.error(f"상권 분석 main_category 매출 건수 증감률 분석 중 오류: {e}")
            return {
                "growth_rate_trend": [],
                "summary": None
            }

    def get_food_store_sales_stats(self, db: Session, region_name: str, industry_name: str) -> Dict[str, Any]:
        """외식업 매출 건수 기준 상위 업종 및 내 업종 순위 (서울시/자치구/행정동 기준)"""
        try:
            latest = db.query(SalesData.year, SalesData.quarter).order_by(desc(SalesData.year), desc(SalesData.quarter)).first()
            if not latest:
                return {}
            year, quarter = latest
            filters = (SalesData.year == year) & (SalesData.quarter == quarter) & (SalesData.main_category == "외식업")

            # 자치구 추출
            district_name_row = db.query(SalesData.district_name).filter(SalesData.region_name == region_name).first()
            district_name = district_name_row.district_name if district_name_row else None

            def get_area_sales(area_field=None, area_value=None):
                query = db.query(
                    SalesData.industry_name,
                    func.sum(SalesData.sales_count).label("sales_count")
                ).filter(filters)

                if area_field and area_value:
                    query = query.filter(getattr(SalesData, area_field) == area_value)

                result = query.group_by(SalesData.industry_name).order_by(desc("sales_count")).all()

                donut = {row.industry_name: row.sales_count for row in result}
                top3 = [{"category": row.industry_name, "count": row.sales_count} for row in result[:3]]
                my_rank = next((i + 1 for i, row in enumerate(result) if row.industry_name == industry_name), None)

                return {
                    "donut": donut,
                    "top3": top3,
                    "industry_rank": my_rank
                }

            return {
                "행정동 이름": region_name,
                "자치구 이름": district_name,
                "행정동": get_area_sales("region_name", region_name),
                "자치구": get_area_sales("district_name", district_name),
                "서울시": get_area_sales()
            }

        except Exception as e:
            logger.error(f"외식업 업종 매출 순위 분석 중 오류: {e}")
            return {}


    def get_industry_sales_comparison(self, db: Session, industry_name: str, region_name: str) -> Dict[str, Any]:
        """내 업종에서 가장 매출이 많은 동과 나의 동 비교"""
        try:
            latest = db.query(SalesData.year, SalesData.quarter).order_by(desc(SalesData.year), desc(SalesData.quarter)).first()
            if not latest:
                return {}
            year, quarter = latest

            records = (
                db.query(
                    SalesData.region_name,
                    func.sum(SalesData.sales_amount).label("total_sales"),
                    func.sum(SalesData.sales_count).label("total_count")
                )
                .filter(SalesData.year == year, SalesData.quarter == quarter)
                .filter(SalesData.industry_name == industry_name)
                .group_by(SalesData.region_name)
                .order_by(desc("total_sales"))
                .all()
            )

            max_region = records[0] if records else None
            my_region = next((r for r in records if r.region_name == region_name), None)

            return {
                "기준 연도": year,
                "기준 분기": quarter,
                "가장_매출_높은_행정동": {
                    "지역": max_region.region_name if max_region else None,
                    "매출": max_region.total_sales if max_region else None,
                    "건수": max_region.total_count if max_region else None
                },
                "내_행정동": {
                    "지역": my_region.region_name if my_region else None,
                    "매출": my_region.total_sales if my_region else None,
                    "건수": my_region.total_count if my_region else None
                }
            }

        except Exception as e:
            logger.error(f"매출 비교 분석 중 오류: {e}")
            return {}

    def get_sales_detail(self, db: Session, region_name: str, industry_name: str) -> Dict[str, Any]:
        """요일/시간대/성별/연령대별 매출 금액 & 건수 + 가장 많은 요일/시간대/연령대 추출"""
        try:
            latest = db.query(SalesData.year, SalesData.quarter).order_by(desc(SalesData.year), desc(SalesData.quarter)).first()
            if not latest:
                return {}
            year, quarter = latest

            filters = (
                (SalesData.year == year) &
                (SalesData.quarter == quarter) &
                (SalesData.industry_name == industry_name)
            )

            # 매핑 딕셔너리
            DAY_KOR_MAP = {
                "mon": "월요일", "tues": "화요일", "wed": "수요일", "thur": "목요일",
                "fri": "금요일", "sat": "토요일", "sun": "일요일"
            }

            TIME_KOR_MAP = {
                "time_00_06": "00~06시", "time_06_11": "06~11시", "time_11_14": "11~14시",
                "time_14_17": "14~17시", "time_17_21": "17~21시", "time_21_24": "21~24시"
            }

            AGE_KOR_MAP = {
                "age_10": "10대", "age_20": "20대", "age_30": "30대",
                "age_40": "40대", "age_50": "50대", "age_60": "60대 이상"
            }

            dimensions = [
                "weekday", "weekend", "mon", "tues", "wed", "thur", "fri", "sat", "sun",
                "time_00_06", "time_06_11", "time_11_14", "time_14_17", "time_17_21", "time_21_24",
                "male", "female",
                "age_10", "age_20", "age_30", "age_40", "age_50", "age_60"
            ]

            result = {"매출금액": {}, "매출건수": {}}

            for dim in dimensions:
                amt_col = getattr(SalesData, f"{dim}_sales_amount")
                cnt_col = getattr(SalesData, f"{dim}_sales_count")

                dong_row = (
                    db.query(func.avg(amt_col), func.avg(cnt_col))
                    .filter(filters & (SalesData.region_name == region_name))
                    .first()
                )
                seoul_row = (
                    db.query(func.avg(amt_col), func.avg(cnt_col))
                    .filter(filters)
                    .first()
                )

                result["매출금액"][dim] = {
                    "내 지역": int(round(dong_row[0], 0)) if dong_row[0] else 0,
                    "서울 평균": int(round(seoul_row[0], 0)) if seoul_row[0] else 0
                }
                result["매출건수"][dim] = {
                    "내 지역": int(round(dong_row[1], 0)) if dong_row[1] else 0,
                    "서울 평균": int(round(seoul_row[1], 0)) if seoul_row[1] else 0
                }

            # 최대값 분석 (내 지역 기준)
            def get_max_label(keys, label_map, target):
                max_key = max(keys, key=lambda k: result[target][k]["내 지역"])
                return label_map.get(max_key, max_key)

            most_day_amount = get_max_label(["mon", "tues", "wed", "thur", "fri", "sat", "sun"], DAY_KOR_MAP, "매출금액")
            most_time_amount = get_max_label(["time_00_06", "time_06_11", "time_11_14", "time_14_17", "time_17_21", "time_21_24"], TIME_KOR_MAP, "매출금액")
            most_age_amount = get_max_label(["age_10", "age_20", "age_30", "age_40", "age_50", "age_60"], AGE_KOR_MAP, "매출금액")

            most_day_count = get_max_label(["mon", "tues", "wed", "thur", "fri", "sat", "sun"], DAY_KOR_MAP, "매출건수")
            most_time_count = get_max_label(["time_00_06", "time_06_11", "time_11_14", "time_14_17", "time_17_21", "time_21_24"], TIME_KOR_MAP, "매출건수")
            most_age_count = get_max_label(["age_10", "age_20", "age_30", "age_40", "age_50", "age_60"], AGE_KOR_MAP, "매출건수")


            result["요약"] = {
                "매출_금액_많은_요일": most_day_amount,
                "매출_금액_많은_시간대": most_time_amount,
                "매출_금액_많은_연령대": most_age_amount,
                "매출_건수_많은_요일": most_day_count,
                "매출_건수_많은_시간대": most_time_count,
                "매출_건수_많은_연령대": most_age_count
            }

            return result

        except Exception as e:
            logger.error(f"상세 매출 분석 중 오류 발생: {e}")
            return {}
        
    def generate_food_sales_insight_summary(self, food_growth: float, food_share_prev: float, food_share_curr: float, retail_growth: float, service_growth: float ) -> str:
        try:
            # 1. 외식업 매출 증감 설명
            if food_growth is None:
                food_part = "외식업 매출 건수는 직전 분기와 비교할 수 없습니다."
            elif food_growth == 0:
                food_part = "외식업 매출 건수는 직전 분기와 동일했습니다."
            elif food_growth > 0:
                food_part = f"외식업 매출 건수는 직전 분기 대비 {round(food_growth, 1)}% 증가해 긍정적인 흐름을 보였지만"
            else:
                food_part = f"외식업 매출 건수는 직전 분기 대비 {abs(round(food_growth, 1))}% 감소해 다소 부진한 흐름을 보였으며"

            # 2. 비중 변화 설명
            share_change = round(food_share_prev, 1), round(food_share_curr, 1)
            if food_share_prev == food_share_curr:
                share_part = f", 전체 업종 중 외식업의 비중은 {share_change[0]}%로 변함이 없었습니다."
            else:
                share_direction = "소폭 증가" if food_share_curr > food_share_prev else "소폭 감소"
                share_part = f", 전체 업종 중 외식업의 비중은 {share_change[0]}%에서 {share_change[1]}%로 {share_direction}했습니다."

            # 3. 도소매업 및 서비스업 증감 설명
            retail_part = ""
            service_part = ""

            if retail_growth is not None:
                if retail_growth > 0:
                    retail_part = f" 도소매업은 {round(retail_growth, 1)}% 증가,"
                elif retail_growth < 0:
                    retail_part = f" 도소매업은 {abs(round(retail_growth, 1))}% 감소,"
                else:
                    retail_part = " 도소매업은 변화 없음,"

            if service_growth is not None:
                if service_growth > 0:
                    service_part = f" 서비스업은 {round(service_growth, 1)}% 증가한 것으로 나타나"
                elif service_growth < 0:
                    service_part = f" 서비스업은 {abs(round(service_growth, 1))}% 감소한 것으로 나타나"
                else:
                    service_part = " 서비스업은 변화 없음으로 나타나"

            # 4. 결론 파트
            conclusion = ""
            if all(x is not None for x in [food_growth, retail_growth, service_growth]):
                # 1. 모든 업종 증가
                if food_growth > 0 and retail_growth > 0 and service_growth > 0:
                    conclusion = " 전반적인 소비 여건이 개선되고 있는 것으로 보입니다."

                # 2. 모든 업종 감소
                elif food_growth < 0 and retail_growth < 0 and service_growth < 0:
                    conclusion = " 소비 위축이 전 업종에서 나타나고 있습니다."

                # 3. 외식업만 증가
                elif food_growth > 0 and retail_growth <= 0 and service_growth <= 0:
                    conclusion = " 소비가 외식업에 집중되는 경향을 보이고 있습니다."

                # 4. 서비스업만 증가
                elif service_growth > 0 and food_growth <= 0 and retail_growth <= 0:
                    conclusion = " 서비스업에 대한 소비가 상대적으로 늘고 있습니다."

                # 5. 도소매업만 증가
                elif retail_growth > 0 and food_growth <= 0 and service_growth <= 0:
                    conclusion = " 도소매업 위주의 소비가 늘어나는 모습입니다."

                # 6. 외식업 감소 + 서비스업 증가
                elif food_growth < 0 and service_growth > 0:
                    conclusion = " 외식업 소비는 감소한 반면, 서비스업 소비는 증가하고 있습니다."

                # 7. 외식업 증가 + 도소매업 감소
                elif food_growth > 0 and retail_growth < 0 and service_growth >= 0:
                    conclusion = " 외식업 소비는 증가한 반면, 도소매업 소비는 줄어들고 있습니다."

                # 8. 외식업 증가 + 서비스업 감소
                elif food_growth > 0 and service_growth < 0 and retail_growth >= 0:
                    conclusion = " 외식업 소비는 증가했지만, 서비스업 소비는 감소했습니다."

                # 9. 외식업 증가 + 다른 업종 변화 없음
                elif food_growth > 0 and retail_growth == 0 and service_growth == 0:
                    conclusion = " 외식업만 유일하게 증가세를 보이고 있으며, 다른 업종은 변화가 없습니다."

                # 10. 외식업 감소 + 다른 업종 변화 없음
                elif food_growth < 0 and retail_growth == 0 and service_growth == 0:
                    conclusion = " 외식업만 감소하고 있으며, 다른 업종은 변화가 없습니다."

                # 11. 기타 애매한 조합
                else:
                    conclusion = " 업종별 소비 양상이 뚜렷하지 않으며, 혼재된 흐름을 보이고 있습니다."

            return food_part + share_part + retail_part + service_part + conclusion

        except Exception as e:
            return f"매출건수 추세 요약 생성 중 오류 발생: {e}"



# 서비스 인스턴스 생성
area_analysis_service = AreaAnalysisService()
