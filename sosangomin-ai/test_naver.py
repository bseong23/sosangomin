import os
import re
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import quote_plus

def get_place_id(query, headless=False):
    """네이버 지도에서 장소를 검색하고 place_id를 추출"""
    driver = None
    try:
        print(f"'{query}' 검색 중...")
        
        # Chrome 옵션 설정
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless=new")  # 새로운 헤드리스 모드
            # 일반 브라우저처럼 보이게 하는 설정들
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--start-maximized")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option("useAutomationExtension", False)
            # 사용자 에이전트 설정
            chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36")
        
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        # WebDriver 초기화
        service = Service()
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # 자동화 감지 플래그 제거
        if headless:
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        # 네이버 지도 검색 페이지 접속
        search_url = f"https://map.naver.com/p/search/{quote_plus(query)}"
        driver.get(search_url)
        print(f"URL 접속: {search_url}")
        
        # 페이지 로딩 대기 - 더 길게 설정
        time.sleep(5)
        
        # 현재 URL 확인
        current_url = driver.current_url
        print(f"현재 URL: {current_url}")
        
        # URL에서 place_id 추출
        place_id_match = re.search(r'/place/(\d+)', current_url)
        if place_id_match:
            place_id = place_id_match.group(1)
            print(f"추출된 place_id: {place_id}")
            return place_id
            
        # URL 쿼리 파라미터에서 place 값 추출 시도
        if "place=" in current_url:
            place_id_match = re.search(r'place=(\d+)', current_url)
            if place_id_match:
                place_id = place_id_match.group(1)
                print(f"쿼리 파라미터에서 추출된 place_id: {place_id}")
                return place_id
        
        print("URL에서 place_id를 찾을 수 없습니다.")
        return None
            
    except Exception as e:
        print(f"오류 발생: {e}")
        return None
    finally:
        if driver:
            driver.quit()
            print("WebDriver 종료됨")

if __name__ == "__main__":
    # 테스트할 검색어 입력
    test_query = input("검색할 가게 이름을 입력하세요 (예: 스타벅스 강남역): ")
    show_browser = input("브라우저 창을 표시할까요? (y/n, 기본: n): ").lower() == 'y'
    
    # place_id 추출
    place_id = get_place_id(test_query, headless=not show_browser)
    
    if place_id:
        print(f"\n성공! place_id: {place_id}")
        print(f"네이버 지도 URL: https://map.naver.com/p/entry/place/{place_id}")
    else:
        print("\n실패: place_id를 찾을 수 없습니다.")