# services/store_service.py
import os
import re
import time
import logging
import requests
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
from dotenv import load_dotenv
from database.connector import database_instance
from bs4 import BeautifulSoup
from urllib.parse import urlencode, quote_plus
from db_models import Store
from sqlalchemy import or_
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

logger = logging.getLogger(__name__)

class SimpleStoreService:
    def __init__(self):
        load_dotenv("./config/.env")
        
        self.naver_client_id = os.getenv("NAVER_CLIENT_ID")
        self.naver_client_secret = os.getenv("NAVER_CLIENT_SECRET")
        
        if not self.naver_client_id or not self.naver_client_secret:
            logger.error("네이버 API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            self.naver_client_id = "NOT_SET"
            self.naver_client_secret = "NOT_SET"
        
        self.naver_headers = {
            "X-Naver-Client-Id": self.naver_client_id,
            "X-Naver-Client-Secret": self.naver_client_secret,
            "Content-Type": "application/json"
        }
        
        self.naver_search_url = "https://openapi.naver.com/v1/search/local.json"
    
    async def register_store_by_name(self, user_id: int, store_name: str, pos_type: str) -> Dict[str, Any]:
        """
        가게 이름으로 검색하여 첫 번째 결과를 DB에 등록
        
        Args:
            user_id: 사용자 ID
            store_name: 가게 이름
            
        Returns:
            Dict: 등록 결과
        """
        try:
            search_result = await self._search_naver_store(store_name)
            
            if not search_result:
                return {
                    "status": "error",
                    "message": f"'{store_name}' 검색 결과가 없습니다."
                }
            
            place_id = search_result.get("place_id")
            
            if not place_id or place_id == search_result.get("place_url"):
                search_query = f"{search_result['store_name']} {search_result['address']}"
                place_id = await self._get_place_id_with_selenium(search_query)
                
                if place_id:
                    search_result["place_id"] = place_id
                    logger.info(f"Selenium으로 place_id 추출 성공: {place_id}")
            
            store_info = {
                "store_name": search_result.get("store_name"),
                "address": search_result.get("address"),
                "place_id": search_result.get("place_id"),
                "phone": search_result.get("phone", ""),
                "category": search_result.get("category", ""),
                "latitude": search_result.get("latitude"),
                "longitude": search_result.get("longitude")
            }
            
            result = await self._save_store_to_db(user_id, store_info, pos_type)
            return result
            
        except Exception as e:
            logger.error(f"가게 등록 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"가게 등록 중 오류가 발생했습니다: {str(e)}"
            }
    
    async def _search_naver_store(self, query: str) -> Dict[str, Any]:
        """네이버 지역 검색 API를 사용하여 가게 검색 (첫 번째 결과만 반환)"""
        try:
            params = {
                "query": query,
                "display": 1,  
                "start": 1,
                "sort": "random"
            }
            
            url = f"{self.naver_search_url}?{urlencode(params)}"
            
            response = requests.get(url, headers=self.naver_headers)
            response.raise_for_status()
            
            data = response.json()
            items = data.get("items", [])
            
            if not items:
                return {}
            
            item = items[0]  
            
            place_id = self._extract_naver_place_id(item.get("link", ""))
            
            latitude = None
            longitude = None
            if item.get("mapy") and item.get("mapx"):
                try:
                    latitude = float(item.get("mapy", 0)) / 10000000
                    longitude = float(item.get("mapx", 0)) / 10000000
                except ValueError:
                    pass
            
            store_info = {
                "store_name": self._clean_text(item.get("title", "")),
                "address": self._clean_text(item.get("address", "")),
                "road_address": self._clean_text(item.get("roadAddress", "")),
                "category": item.get("category", ""),
                "place_id": place_id,
                "place_url": item.get("link", ""),
                "latitude": latitude,
                "longitude": longitude,
                "source": "naver"
            }
            
            return store_info
                
        except Exception as e:
            logger.error(f"네이버 가게 검색 중 오류: {str(e)}")
            return {}
    
    def _extract_naver_place_id(self, url: str) -> str:
        """네이버 지도 URL에서 place_id 추출 시도"""
        try:
            if "map.naver.com" in url and "place" in url:
                if "/place/" in url:
                    parts = url.split("/place/")
                    if len(parts) > 1:
                        place_id = parts[1].split("?")[0].split("/")[0]
                        return place_id
                elif "?entry=plt&placePath=%2Fplace%2F" in url:
                    parts = url.split("placePath=%2Fplace%2F")
                    if len(parts) > 1:
                        place_id = parts[1].split("%")[0].split("&")[0]
                        return place_id
            
            return url
                
        except Exception as e:
            logger.error(f"네이버 place_id 추출 중 오류: {str(e)}")
            return url
    
    async def _get_place_id_with_selenium(self, query: str) -> Optional[str]:
        """Selenium을 사용하여 place_id 추출"""
        driver = None
        try:
            logger.info(f"'{query}' 검색하여 place_id 추출 중...")
            
            chrome_options = Options()
            chrome_options.add_argument("--headless=new")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option("useAutomationExtension", False)
            chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36")
            
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            
            service = Service()
            driver = webdriver.Chrome(service=service, options=chrome_options)
            
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            search_url = f"https://map.naver.com/p/search/{quote_plus(query)}"
            driver.get(search_url)
            
            time.sleep(5)
            
            current_url = driver.current_url
            logger.info(f"현재 URL: {current_url}")
            
            place_id_match = re.search(r'/place/(\d+)', current_url)
            if place_id_match:
                place_id = place_id_match.group(1)
                logger.info(f"추출된 place_id: {place_id}")
                return place_id
                
            if "place=" in current_url:
                place_id_match = re.search(r'place=(\d+)', current_url)
                if place_id_match:
                    place_id = place_id_match.group(1)
                    logger.info(f"쿼리 파라미터에서 추출된 place_id: {place_id}")
                    return place_id
            
            logger.warning("URL에서 place_id를 찾을 수 없습니다.")
            return None
            
        except Exception as e:
            logger.error(f"Selenium으로 place_id 추출 중 오류 발생: {e}")
            return None
        finally:
            if driver:
                try:
                    loop = asyncio.get_running_loop()
                    await loop.run_in_executor(None, driver.quit)
                except RuntimeError:
                    driver.quit()
                logger.info("WebDriver 종료됨")
    
    def _clean_text(self, text: str) -> str:
        """HTML 태그 및 특수문자 제거"""
        if not text:
            return ""
        
        soup = BeautifulSoup(text, "html.parser")
        clean_text = soup.get_text()
        
        clean_text = clean_text.replace("<b>", "").replace("</b>", "")
        clean_text = clean_text.replace("&lt;", "<").replace("&gt;", ">")
        clean_text = clean_text.replace("&amp;", "&")
        
        return clean_text.strip()
    
    async def _save_store_to_db(self, user_id: int, store_info: Dict[str, Any], pos_type: str) -> Dict[str, Any]:
        """가게 정보를 DB에 저장"""
        db_session = database_instance.pre_session()
        
        try:
            query_conditions = []
            
            if store_info.get("place_id"):
                query_conditions.append(
                    (Store.place_id == store_info.get("place_id")) & 
                    (Store.user_id == user_id)
                )
            
            if store_info.get("business_number"):
                query_conditions.append(
                    (Store.business_number == store_info.get("business_number")) & 
                    (Store.user_id == user_id)
                )
            
            existing_store = None
            if query_conditions:
                existing_store = db_session.query(Store).filter(
                    or_(*query_conditions)
                ).first()
            
            if existing_store:
                if store_info.get("business_number") and not existing_store.business_number:
                    existing_store.business_number = store_info.get("business_number")
                    existing_store.is_verified = True
                
                if store_info.get("place_id") and not existing_store.place_id:
                    existing_store.place_id = store_info.get("place_id")
                
                existing_store.updated_at = datetime.now()
                db_session.commit()
                
                return {
                    "status": "success",
                    "message": "이미 등록된 가게입니다. 정보가 업데이트되었습니다.",
                    "store_id": existing_store.store_id,
                    "store_info": {
                        "store_id": existing_store.store_id,
                        "store_name": existing_store.store_name,
                        "address": existing_store.address,
                        "place_id": existing_store.place_id,
                        "category": existing_store.category,
                        "business_number": existing_store.business_number,
                        "is_verified": existing_store.is_verified
                    }
                }
            
            current_time = datetime.now()
            
            is_verified = bool(store_info.get("business_number"))
            
            new_store = Store(
                user_id=user_id,
                store_name=store_info.get("store_name"),
                address=store_info.get("address") or store_info.get("road_address", ""),
                place_id=store_info.get("place_id"),
                category=store_info.get("category", ""),
                review_count=0,
                latitude=store_info.get("latitude"),
                longitude=store_info.get("longitude"),
                business_number=store_info.get("business_number"),
                is_verified=is_verified,
                created_at=current_time,
                updated_at=current_time,
                pos_type=pos_type
            )
            
            db_session.add(new_store)
            db_session.flush()
            
            store_id = new_store.store_id
            
            db_session.commit()
            
            return {
                "status": "success",
                "message": "가게가 성공적으로 등록되었습니다.",
                "store_id": store_id,
                "store_info": {
                    "store_id": store_id,
                    "store_name": store_info.get("store_name"),
                    "address": store_info.get("address"),
                    "place_id": store_info.get("place_id"),
                    "category": store_info.get("category"),
                    "business_number": store_info.get("business_number"),
                    "is_verified": is_verified
                }
            }
            
        except Exception as e:
            db_session.rollback()
            logger.error(f"가게 DB 저장 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"가게 저장 중 오류가 발생했습니다: {str(e)}"
            }
        finally:
            db_session.close()

    async def get_store(self, store_id: int, user_id: Optional[int] = None) -> Dict[str, Any]:
        """
        DB에서 가게 정보를 조회
        
        Args:
            store_id: 가게 ID
            user_id: 사용자 ID (선택적)
            
        Returns:
            Dict: 가게 정보
        """
        db_session = database_instance.pre_session()
        
        try:
            query = db_session.query(Store).filter(Store.store_id == store_id)
            
            if user_id is not None:
                query = query.filter(Store.user_id == user_id)
                
            store = query.first()
            
            if not store:
                return {
                    "status": "error",
                    "message": "해당 ID의 가게를 찾을 수 없습니다."
                }
            
            return {
                "status": "success",
                "store_info": {
                    "store_id": store.store_id,
                    "user_id": store.user_id,
                    "store_name": store.store_name,
                    "address": store.address,
                    "place_id": store.place_id,
                    "category": store.category,
                    "review_count": store.review_count,
                    "latitude": store.latitude,
                    "longitude": store.longitude,
                    "pos_type": store.pos_type,
                    "created_at": store.created_at,
                    "updated_at": store.updated_at
                }
            }
        
                
        except Exception as e:
            logger.error(f"가게 정보 조회 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"가게 정보 조회 중 오류가 발생했습니다: {str(e)}"
            }
        finally:
            db_session.close()

    async def register_store_with_business_number(self, user_id: int, store_name: str, business_number: str, pos_type: str) -> Dict[str, Any]:
        """
        사업자등록번호 검증 후 가게 등록
        
        Args:
            user_id: 사용자 ID
            store_name: 가게 이름
            business_number: 사업자등록번호
            pos_type: POS 유형
            
        Returns:
            Dict: 등록 결과
        """
        try:
            from services.business_verification_service import business_verification_service
            verification_result = await business_verification_service.verify_business_number(business_number)
            
            if not verification_result.get("valid"):
                return {
                    "status": "error",
                    "message": f"유효하지 않은 사업자등록번호입니다: {verification_result.get('message')}",
                    "verification_result": verification_result
                }
            
            search_result = await self._search_naver_store(store_name)
            
            store_info = {}
            
            if search_result:
                place_id = search_result.get("place_id")
                
                if not place_id or place_id == search_result.get("place_url"):
                    search_query = f"{search_result['store_name']} {search_result['address']}"
                    place_id = await self._get_place_id_with_selenium(search_query)
                    
                    if place_id:
                        search_result["place_id"] = place_id
                        logger.info(f"Selenium으로 place_id 추출 성공: {place_id}")
                
                store_info = {
                    "store_name": search_result.get("store_name", store_name),
                    "address": search_result.get("address", ""),
                    "place_id": search_result.get("place_id", ""),
                    "category": search_result.get("category", ""),
                    "latitude": search_result.get("latitude"),
                    "longitude": search_result.get("longitude")
                }
            else:
                store_info = {
                    "store_name": store_name,
                    "address": "",
                    "place_id": "",
                    "category": "",
                    "latitude": None,
                    "longitude": None
                }
            
            store_info["business_number"] = business_number
            
            result = await self._save_store_to_db(user_id, store_info, pos_type)
            
            result["verification_result"] = verification_result
            
            return result
                
        except Exception as e:
            logger.error(f"사업자번호 검증 후 가게 등록 중 오류: {str(e)}")
            return {
                "status": "error",
                "message": f"가게 등록 중 오류가 발생했습니다: {str(e)}"
            }

simple_store_service = SimpleStoreService()