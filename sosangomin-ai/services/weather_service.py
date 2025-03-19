import os
import sys
import logging
import requests
from dotenv import load_dotenv
from typing import Dict, Optional, Union
import pymysql
import pandas as pd
from typing import List, Tuple
from datetime import datetime, timedelta
import asyncio
import calendar
from db_models import Weathers
from database.connector import database_instance

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        load_dotenv("./config/.env")

        self.service_key = os.getenv("KMA_SERVICE_KEY")  
        self.base_url = "http://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList" 
        self.default_location = "서울"

        if not self.service_key:
            logger.error("기상청 API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            self.service_key = "NOT_SET"

        # 지점번호 (stnId) 목록
        self.LOCATION_CODE = {
            "서울": 108,
            "부산": 159,
            "대구": 143,
            "인천": 112,
            "광주": 156,
            "대전": 133,
            "울산": 152,
            "강릉": 105,
            "춘천": 101
        }

    async def process_weather(self, start_date: str, end_date: str, location: Optional[str] = None) -> pd.DataFrame:
        """
        날씨 데이터 처리 메인 함수

        :param start_date: 예) '2024031011' (yyyyMMddhh 형식)
        :param end_date: 예) '2025042223' (yyyyMMddhh 형식)
        :param location: 예) "서울"
        """
        db = database_instance.pre_session()
        location = location or self.default_location
        
        try:
            logger.info(f"[날씨 처리 시작] {start_date} ~ {end_date}, 지역: {location}")

            # 1. 날짜를 연, 월로 변환
            start_year, start_month = int(start_date[:4]), int(start_date[4:6])
            end_year, end_month = int(end_date[:4]), int(end_date[4:6])

            # 2. 월 단위 리스트 생성
            date_list = []
            current_year, current_month = start_year, start_month
            while (current_year < end_year) or (current_year == end_year and current_month <= end_month):
                date_list.append(f"{current_year}{str(current_month).zfill(2)}")
                current_month = 1 if current_month == 12 else current_month + 1
                if current_month == 1:
                    current_year += 1

            logger.info(f"[확인 대상 월 목록]: {date_list}")

            # 3. DB에 있는 월 확인
            existing_months = db.query(Weathers.year, Weathers.month)\
                .filter(Weathers.location == location)\
                .distinct().all()  # (year, month) 튜플 목록
            
            existing_months_set = set(f"{year}{str(month).zfill(2)}" for year, month in existing_months)
            logger.info(f"[이미 저장된 월]: {existing_months_set}")

            # 4. 없는 월 목록 파악
            missing_months = [date for date in date_list if date not in existing_months_set]
            logger.info(f"[API 호출 필요 월]: {missing_months}")

            # 5. 누락된 월에 대해 API 호출 및 저장
            for date in missing_months:
                api_data = self.get_weather_data(location, date) 
                if 'error' not in api_data:
                    await self.save_weather_hourly(db, api_data, location)  

            db.commit()  

            # 6. 최종 데이터 조회 (범위 내)
            final_weather = db.query(Weathers)\
                .filter(
                    Weathers.location == location,
                    Weathers.datetime.between(start_date, end_date)
                )\
                .order_by(Weathers.datetime.asc())\
                .all()

            # 7. DataFrame 변환
            df_result = pd.DataFrame([
                {
                    "year": row.year,
                    "month": row.month,
                    "day": row.day,
                    "hour": row.hour,
                    "ta": row.ta,
                    "ws": row.ws,
                    "hm": row.hm,
                    "rn": row.rn,
                } for row in final_weather
            ])

            logger.info(f"[날씨 처리 완료] 총 {len(df_result)}건 데이터 확보")
            return df_result

        except Exception as e:
            db.rollback()
            logger.error(f"[ERROR] 날씨 처리 중 오류: {str(e)}")
            raise
        finally:
            db.close()


    async def save_weather_hourly(self, db, weather_df: pd.DataFrame, location: Optional[str] = None):
        """날씨 데이터 저장"""
        try:
            for _, row in weather_df.iterrows():
                datetime = f"{row['year']}{row['month']}{row['day']}{row['hour']}"
                weather_record = Weathers(
                    datetime = int(datetime),
                    year=row['year'],
                    month=row['month'],
                    day=row['day'],
                    hour=row['hour'],
                    location=location,
                    ta=float(row['ta']) if row['ta'] else None, 
                    ws=float(row['ws']) if row['ws'] else None,
                    hm=float(row['hm']) if row['hm'] else None,
                    rn=float(row['rn']) if row['rn'] else None
                )
                db.add(weather_record)  
            db.flush()  
            logger.debug(f"{len(weather_df)}건 날씨 데이터 저장 완료")
        except Exception as e:
            logger.error(f"날씨 데이터 저장 중 오류 : {str(e)}")
            raise

    def get_stn_id(self, location: str):
        """위치명으로 지점 번호 가져오기 (기본: 서울 108)"""
        return self.LOCATION_CODE.get(location, 108)

    def get_weather_data(self, location: str, date: str) -> Dict:
        """
        과거 날씨 API 호출 (특정 시간)

        :param location: 예) '서울'
        :param date: 예) '202403' (yyyyMM 형식)
        :return: 날씨 데이터 (기온, 풍속, 습도, 강수량 등) 또는 에러 메시지
        """
        stn_id = self.get_stn_id(location)

        year = int(date[:4])
        month = int(date[4:6])
        last_day = calendar.monthrange(year, month)[1]
        today = datetime.today()

        # 만약 이번 달인데 오늘이 마지막 날보다 작으면 -> 어제 날짜로 제한
        if year == today.year and month == today.month:
            end_day = min(today.day, last_day) - 1

        startDt = f"{date}01"
        endDt = f"{date}{str(end_day).zfill(2)}"

        params = {
            "serviceKey": self.service_key,
            "pageNo": "1",
            "numOfRows": "750",  
            "dataType": "JSON",
            "dataCd": "ASOS",
            "dateCd": "HR",  
            "startDt": startDt,
            "startHh": "00",
            "endDt": endDt,
            "endHh": "23",
            "stnIds": stn_id
        }
        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            print("[DEBUG] 응답 코드:", response.status_code)
            print(startDt, endDt)

            response.raise_for_status()
            result = response.json()

            items = result['response']['body']['items']['item']
            if not items:
                logger.warning(f"[WARN] 데이터 없음")
                return {"error": "데이터가 없습니다."}

            # 여러 시간대 데이터 파싱
            parsed_data = self.parse_weather_data(items)  # 리스트 처리로 변경
            df = pd.DataFrame(parsed_data)
            df['year'] = pd.to_datetime(df['tm']).dt.year.astype(str)
            df['month'] = pd.to_datetime(df['tm']).dt.month.apply(lambda x: str(x).zfill(2))
            df['day'] = pd.to_datetime(df['tm']).dt.day.apply(lambda x: str(x).zfill(2))
            df['hour'] = pd.to_datetime(df['tm']).dt.hour.apply(lambda x: str(x).zfill(2))

            return df

        except Exception as e:
            logger.error(f"날씨 API 호출 실패: {e}")
            return {"error": "날씨 데이터를 가져오는 중 오류가 발생했습니다."}
        
    def parse_weather_data(self, items: list) -> list[Dict[str, Optional[str]]]:
        """
        여러 시간대 날씨 데이터 파싱

        :param items: API 원본 데이터 리스트
        :return: 필터링된 날씨 정보 리스트
        """
        return [
            {
                "tm": item.get('tm'),
                "ta": item.get('ta'),
                "ws": item.get('ws'),
                "hm": item.get('hm'),
                "rn": item.get('rn')
            }
            for item in items
        ]

weather_service = WeatherService()

import asyncio

if __name__ == "__main__":
    async def test_process_weather():
        """
        날씨 데이터 수집 및 저장 테스트
        예시: 2025년 3월부터 2025년 4월까지 서울 지역 데이터 수집
        """
        start_date = "2025010100" 
        end_date = "2025031423"    
        location = "서울"

        # 서비스 인스턴스
        service = WeatherService()

        # 날씨 데이터 수집 실행
        try:
            result_df = await service.process_weather(start_date, end_date, location)
            print("[테스트 결과] 수집된 데이터:")
            print(result_df.head())  # 상위 5개 행만 출력
            print(f"[총 데이터 수] {len(result_df)}건")
        except Exception as e:
            print(f"[ERROR] 테스트 실행 중 오류 발생: {e}")

    # 비동기 함수 실행
    asyncio.run(test_process_weather())