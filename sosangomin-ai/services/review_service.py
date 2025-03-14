import os
import logging
import asyncio
from bs4 import BeautifulSoup
import re
import json
from typing import Dict, List, Optional, Any
from datetime import datetime
from dotenv import load_dotenv
from database.mongo_connector import mongo_instance
from bson import ObjectId
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.service import Service

logger = logging.getLogger(__name__)

class ReviewService:
    def __init__(self):
        load_dotenv("./config/.env")
        self.client_id = os.getenv("NAVER_CLIENT_ID")
        self.client_secret = os.getenv("NAVER_CLIENT_SECRET")
        
        if not self.client_id or not self.client_secret:
            logger.error("네이버 API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            self.client_id = "NOT_SET"
            self.client_secret = "NOT_SET"
        
        self.headers = {
            "X-Naver-Client-Id": self.client_id,
            "X-Naver-Client-Secret": self.client_secret,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        self.review_base_url = "https://map.naver.com/p/entry/place/{place_id}?c=15.00,0,0,0,dh&placePath=/review"
    
    async def fetch_reviews_with_selenium(self, place_id: str) -> List[Dict[str, Any]]:
        reviews = []
        driver = None
        
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument(f"user-agent={self.headers['User-Agent']}")
            
            webdriver_path = os.getenv('CHROME_WEBDRIVER_PATH', '/usr/local/bin/chromedriver')
    
            logger.info(f"Using Chrome WebDriver at: {webdriver_path}")
            
            service = Service()
            driver = webdriver.Chrome(service=service, options=chrome_options)
            
            review_url = self.review_base_url.format(place_id=place_id)
            driver.get(review_url)
            
            wait = WebDriverWait(driver, 15)
            
            try:
                iframe = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "iframe#entryIframe")))
                driver.switch_to.frame(iframe)
            except TimeoutException:
                logger.info("iframe이 없거나 접근할 수 없습니다. 메인 페이지에서 계속합니다.")
            
            try:
                selectors = [
                    "div.pui__vn15t2", 
                    "div.place_review", 
                    "div.YeUwq",
                    "div.place_section_content"
                ]
                
                for selector in selectors:
                    try:
                        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                        break
                    except TimeoutException:
                        continue
                
                try:
                    for i in range(5):
                        try:
                            more_button_selectors = [
                                "a.fvwqf", 
                                "button.fvwqf", 
                                "a.place_reviewMore", 
                                "button.place_reviewMore",
                                "a[role='button']",
                                "button.moreBtn"
                            ]
                            
                            more_button = None
                            for btn_selector in more_button_selectors:
                                try:
                                    more_button = WebDriverWait(driver, 2).until(
                                        EC.element_to_be_clickable((By.CSS_SELECTOR, btn_selector))
                                    )
                                    break
                                except:
                                    continue
                            
                            if more_button:
                                more_button.click()
                                logger.info(f"더보기 버튼 클릭 {i+1}회 성공")
                                time.sleep(2)
                            else:
                                logger.info("더보기 버튼을 찾을 수 없습니다")
                                break
                        except Exception as e:
                            logger.info(f"더 이상 리뷰를 로드할 수 없습니다: {e}")
                            break
                except Exception as e:
                    logger.info(f"추가 리뷰 로드 시도 중 오류: {e}")
                
                page_source = driver.page_source
                
                soup = BeautifulSoup(page_source, 'html.parser')
                
                all_div_classes = set()
                for div in soup.select('div[class]'):
                    all_div_classes.update(div.get('class', []))
                
                for selector in selectors:
                    review_elements = soup.select(selector)
                    logger.info(f"{selector} 선택자로 {len(review_elements)}개 리뷰 찾음")
                    
                    if review_elements:
                        for element in review_elements:
                            try:
                                review_text = element.get_text().strip()
                                review_text = re.sub(r'\s+', ' ', review_text)
                                
                                reviews.append({
                                    "text": review_text,
                                    "rating": 0,
                                    "date": "알 수 없음",
                                    "sentiment": None,
                                    "keywords": []
                                })
                            except Exception as e:
                                logger.warning(f"리뷰 파싱 중 오류: {e}")
                                continue
                        
                        break
                
                logger.info(f"성공적으로 {len(reviews)}개의 리뷰를 파싱했습니다.")
                
            except TimeoutException:
                logger.error("리뷰 요소를 찾을 수 없습니다. 페이지 구조가 변경되었을 수 있습니다.")
            
            return reviews
            
        except Exception as e:
            logger.error(f"Selenium 리뷰 크롤링 중 오류: {e}")
            return []
        finally:
            if driver:
                driver.quit()
    
    async def analyze_sentiment(self, reviews: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        positive_words = [
            "맛있", "좋", "최고", "훌륭", "친절", "만족", "추천", "깔끔", "청결", "정갈", 
            "부드럽", "쫄깃", "착한가격", "가성비", "푸짐", "다양", "깊은맛", "감칠맛", 
            "최고예요", "존맛", "밥도둑", "단골", "재방문", "또올게", "기분좋", "행복", 
            "완전", "진짜", "정말", "엄청", "감동", "감탄", "굿", "굳", "넉넉", "신선"
        ]
        
        negative_words = [
            "별로", "실망", "비싸", "불친절", "위생", "기다리", "오래", "적", "부족", 
            "짜",  "싱겁", "느끼", "퍽퍽", "마름", "비리", "불편", "안좋", "찝찝", 
            "짜증", "더러", "실망", "떨어", "아쉽", "맵", "속아파", "고생", "불만", 
            "쓰", "좁", "시끄럽", "더움", "추움", "차가움"
        ]
        
        analyzed_reviews = []
        
        for review in reviews:
            text = review["text"].lower()
            keywords = []
            
            for word in text.split():
                clean_word = word.strip(".,!?()\"'")
                if len(clean_word) > 1:
                    keywords.append(clean_word)
            
            keywords = list(set(keywords))[:5]
            
            pos_count = 0
            neg_count = 0
            
            for word in positive_words:
                if word in text:
                    pos_count += 1
            
            for word in negative_words:
                if word in text:
                    neg_count += 1
            
            sentiment = "neutral"
            if pos_count > neg_count + 1:
                sentiment = "positive"
            elif neg_count > pos_count:  
                sentiment = "negative"
            
            review_copy = review.copy()
            review_copy["sentiment"] = sentiment
            review_copy["keywords"] = keywords
            
            analyzed_reviews.append(review_copy)
        
        return analyzed_reviews
    
    async def generate_word_cloud_data(self, reviews: List[Dict[str, Any]]) -> Dict[str, Dict[str, int]]:
        positive_words = {}
        negative_words = {}
        
        for review in reviews:
            sentiment = review.get("sentiment")
            text = review.get("text", "")
            
            words = [word.strip(".,!?()\"'") for word in text.split() if len(word.strip(".,!?()\"'")) > 1]
            
            if sentiment == "positive":
                for word in words:
                    positive_words[word] = positive_words.get(word, 0) + 1
            elif sentiment == "negative":
                for word in words:
                    negative_words[word] = negative_words.get(word, 0) + 1
        
        positive_words = dict(sorted(positive_words.items(), key=lambda x: x[1], reverse=True)[:50])
        negative_words = dict(sorted(negative_words.items(), key=lambda x: x[1], reverse=True)[:50])
        
        return {
            "positive_words": positive_words,
            "negative_words": negative_words
        }
    
    async def generate_insights(self, reviews: List[Dict[str, Any]], place_id: str) -> str:
        try:
            from services.eda_chat_service import eda_chat_service
            
            reviews
            
            review_texts = [f"[리뷰 {i+1}] {r['text']} (평점: {r['rating']}, 감성: {r['sentiment']})" 
                           for i, r in enumerate(reviews)]
            
            prompt = f"""
                네이버 장소 ID "{place_id}"인 매장의 리뷰 데이터를 분석하여 매장주를 위한 인사이트를 제공해 주세요.
                
                다음은 수집된 리뷰 샘플입니다:
                {chr(10).join(review_texts)}
                
                다음 정보를 포함하는 분석 인사이트를 제공해 주세요:
                1. 고객들이 가장 만족하는 점
                2. 개선이 필요한 부분
                3. 매장 운영에 도움이 될만한 구체적인 제안

                예시:
                1. 고객들이 가장 만족하는 점    
                - 음식이 맛있고 양이 많음
                - 직원들의 친절한 서비스
                - 깔끔한 매장 환경

                2. 개선이 필요한 부분
                - 대기 시간이 길다는 지적
                - 일부 메뉴의 가격이 비싸다는 의견

                3. 매장 운영에 도움이 될만한 구체적인 제안
                - 예약 서비스 도입
                - 가성비 좋은 세트메뉴 개발
            """
            
            response = await eda_chat_service.generate_overall_summary({"리뷰 데이터": prompt})
            
            return response
        except Exception as e:
            logger.error(f"인사이트 생성 중 오류: {e}")
            return "리뷰를 분석한 결과, 이 매장의 강점과 개선점이 있습니다. 상세 분석은 현재 제공할 수 없습니다."
    
    async def analyze_store_reviews(self, store_id: int, place_id: str) -> Dict[str, Any]:
        try:
            reviews_collection = mongo_instance.get_collection("StoreReviews")
            query = {"store_id": store_id, "place_id": place_id}
            
            existing_result = reviews_collection.find_one(query, sort=[("created_at", -1)])
            
            if existing_result and "created_at" in existing_result:
                created_at = existing_result["created_at"]
                now = datetime.now()
                if (now - created_at).total_seconds() < 86400:
                    existing_result["_id"] = str(existing_result["_id"])
                    return {
                        "status": "success",
                        "message": "최근 분석 결과를 불러왔습니다.",
                        "data": existing_result,
                        "is_cached": True
                    }
            
            reviews = await self.fetch_reviews_with_selenium(place_id)
            
            if not reviews:
                return {"status": "error", "message": "리뷰를 가져올 수 없습니다. 매장 ID를 확인하거나 나중에 다시 시도해 주세요."}
            
            analyzed_reviews = await self.analyze_sentiment(reviews)
            word_cloud_data = await self.generate_word_cloud_data(analyzed_reviews)
            insights = await self.generate_insights(analyzed_reviews, place_id)
            
            total_reviews = len(analyzed_reviews)
            avg_rating = sum(r.get("rating", 0) for r in analyzed_reviews) / total_reviews if total_reviews > 0 else 0
            sentiment_counts = {
                "positive": sum(1 for r in analyzed_reviews if r.get("sentiment") == "positive"),
                "neutral": sum(1 for r in analyzed_reviews if r.get("sentiment") == "neutral"),
                "negative": sum(1 for r in analyzed_reviews if r.get("sentiment") == "negative")
            }
            
            result = {
                "store_id": store_id,
                "place_id": place_id,
                "reviews": analyzed_reviews,
                "review_count": total_reviews,
                "average_rating": round(avg_rating, 1),
                "sentiment_distribution": sentiment_counts,
                "word_cloud_data": word_cloud_data,
                "insights": insights,
                "last_crawled_at": datetime.now(),
                "created_at": datetime.now()
            }
            
            result_id = reviews_collection.insert_one(result).inserted_id
            
            result["_id"] = str(result_id)
            
            return {
                "status": "success",
                "message": "리뷰 분석이 완료되었습니다.",
                "data": result,
                "is_cached": False
            }
        
        except Exception as e:
            logger.error(f"리뷰 분석 중 오류: {str(e)}")
            return {"status": "error", "message": f"리뷰 분석 중 오류가 발생했습니다: {str(e)}"}
    
    async def get_store_reviews_list(self, store_id: int) -> Dict[str, Any]:
        try:
            reviews_collection = mongo_instance.get_collection("StoreReviews")
            
            if isinstance(store_id, str) and store_id.isdigit():
                store_id = int(store_id)
            
            cursor = reviews_collection.find({"store_id": int(store_id)}).sort("created_at", -1)
            
            results = []
            for doc in cursor:
                doc["_id"] = str(doc["_id"])
                results.append({
                    "analysis_id": doc["_id"],
                    "place_id": doc["place_id"],
                    "review_count": doc["review_count"],
                    "average_rating": doc["average_rating"],
                    "sentiment_distribution": doc["sentiment_distribution"],
                    "created_at": doc["created_at"]
                })
            
            return {
                "status": "success",
                "count": len(results),
                "analyses": results
            }
        except Exception as e:
            logger.error(f"리뷰 분석 목록 조회 중 오류: {str(e)}")
            return {"status": "error", "message": f"리뷰 분석 목록 조회 중 오류가 발생했습니다: {str(e)}"}
    
    async def get_review_analysis(self, analysis_id: str) -> Dict[str, Any]:
        try:
            reviews_collection = mongo_instance.get_collection("StoreReviews")
            
            result = reviews_collection.find_one({"_id": ObjectId(analysis_id)})
            
            if not result:
                return {"status": "error", "message": "해당 분석 결과를 찾을 수 없습니다"}
            
            result["_id"] = str(result["_id"])
            return {
                "status": "success",
                "data": result
            }
        except Exception as e:
            logger.error(f"분석 결과 조회 중 오류: {str(e)}")
            return {"status": "error", "message": f"분석 결과 조회 중 오류가 발생했습니다: {str(e)}"}

review_service = ReviewService()