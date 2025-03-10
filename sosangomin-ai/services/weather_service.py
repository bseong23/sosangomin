import os
import logging
import requests
import json 
from dotenv import load_dotenv
from config.redis_config import redis_client
from typing import Dict, Optional, Union

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        load_dotenv("./config/.env")

        self.service_key = os.getenv("KMA_SERVICE_KEY")  
        self.base_url = "http://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList" 

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

    def get_stn_id(self, location: str):
        """위치명으로 지점 번호 가져오기 (기본: 서울 108)"""
        return self.LOCATION_CODE.get(location, 108)

    def get_weather_data(self, location: str, date: str, hh: str) -> Union[Dict[str, Optional[str]], Dict[str, str]]:
        """
        과거 날씨 API 호출 (특정 시간)

        :param location: 예) '서울'
        :param date: 예) '20240310' (yyyyMMdd 형식)
        :param hh: 예) '15' (시간)
        :return: 날씨 데이터 (기온, 풍속, 습도, 강수량 등) 또는 에러 메시지
        """
        stn_id = self.get_stn_id(location)

        cache_key = f"weather:past:{location}:{date}:{hh}" 
        cached_data = redis_client.get(cache_key)
        if cached_data:
            logger.info(f"[CACHE HIT] {cache_key}")
            logger.info(f"[CACHE DATA] {cached_data}") 
            return json.loads(cached_data)

        logger.info(f"[CACHE MISS] {cache_key}, API 호출 진행...")

        params = {
            "serviceKey": self.service_key,
            "pageNo": "1",
            "numOfRows": "10",  
            "dataType": "JSON",
            "dataCd": "ASOS",
            "dateCd": "HR",  
            "startDt": date,
            "startHh": hh,
            "endDt": date,
            "endHh": hh,
            "stnIds": stn_id
        }

        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            print("[DEBUG] 응답 코드:", response.status_code)  # 상태코드 확인

            response.raise_for_status()
            result = response.json()

            items = result['response']['body']['items']['item']
            if not items:
                logger.warning(f"[WARN] 데이터 없음: {location}, {date}")
                return {"error": "데이터가 없습니다."}

            parsed_data = self.parse_weather_data(items[0])  # 하루 데이터
            try:
                redis_client.setex(cache_key, 86400, json.dumps(parsed_data))  # 24시간 캐시
                logger.info(f"[CACHE SET] {cache_key} -> {parsed_data}")
            except Exception as e:
                logger.warning(f"[WARNING] 캐시 저장 실패: {e}")


            return parsed_data

        except Exception as e:
            logger.error(f"[ERROR] 날씨 API 호출 실패: {e}")
            return {"error": "날씨 데이터를 가져오는 중 오류가 발생했습니다."}

    def parse_weather_data(self, item: dict) -> Dict[str, Optional[str]]:
        """
        필요한 날씨 데이터만 필터링

        :param item: API 원본 데이터 (딕셔너리)
        :return: 필터링된 날씨 정보
        """
        return {
            "일시": item.get('tm'),
            "기온": item.get('ta'),          # 기온
            "풍속": item.get('ws'),          # 풍속
            "습도": item.get('hm'),          # 습도
            "강수량": item.get('rn'),        # 강수량
        }


# 전역 인스턴스
weather_service = WeatherService()

# ✅ 단독 테스트용 함수
def test_weather():
    location = "서울"
    date = "20240309"  # yyyyMMdd 형식
    hh = '15'
    result = weather_service.get_weather_data(location, date, hh)
    print(f"[TEST] 날짜: {date}, 시간: {hh}시, 위치: {location}, 날씨 데이터: {result}")


# ✅ 단독 실행 (python services/weather_service.py)
if __name__ == "__main__":
    test_weather()