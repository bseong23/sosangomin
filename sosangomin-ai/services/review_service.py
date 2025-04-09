import os
import logging
import asyncio
from bs4 import BeautifulSoup
import re
import json
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
from dotenv import load_dotenv
from database.mongo_connector import mongo_instance
from bson import ObjectId
import time
from konlpy.tag import Okt  # type: ignore
import pandas as pd  
from collections import Counter  
import concurrent.futures  

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.service import Service
import tempfile
import shutil
import uuid

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
        
        self.okt = Okt()
        
        self.sentiment_dict = self._load_sentiment_dict()
        
        self.stopwords = self._load_stopwords()
    
    def _load_sentiment_dict(self) -> Dict[str, float]:
        """확장된 감성 사전 로드"""
        positive_words = [
            "맛있", "좋", "최고", "훌륭", "친절", "만족", "추천", "깔끔", "청결", "정갈", 
            "부드럽", "쫄깃", "착한가격", "가성비", "푸짐", "다양", "깊은맛", "감칠맛", 
            "최고예요", "존맛", "밥도둑", "단골", "재방문", "또올게", "기분좋", "행복", 
            "완전", "진짜", "정말", "엄청", "감동", "감탄", "굿", "굳", "넉넉", "신선",
            "대박", "짱", "환상", "인기", "후기좋", "특별", "건강", "합리적", "빠르", "혜택",
            "풍부", "근사", "특별", "차별", "독특", "특색", "매력", "편안", "힐링", "여유",
            "안전", "쾌적", "상냥", "감사", "기분좋", "웃음", "편리", "세련", "아늑",
            "호감", "감사", "훈훈", "훈남", "훈녀", "센스", "적극", "신뢰", "편의", "빠름"
        ]
        
        negative_words = [
            "별로", "실망", "비싸", "불친절", "위생", "기다리", "오래", "적", "부족", 
            "짜", "싱겁", "느끼", "퍽퍽", "마름", "비리", "불편", "안좋", "찝찝", 
            "짜증", "더러", "떨어", "아쉽", "맵", "속아파", "고생", "불만", 
            "쓰", "좁", "시끄럽", "더움", "추움", "차가움",
            "후회", "최악", "그냥", "물리", "딱딱", "답답", "불안", "비추", "낚임", "미흡",
            "실패", "과장", "배고프", "치사", "손해", "아깝", "버림", "끔찍", "악취", "불결",
            "기름", "역겨", "불쾌", "화나", "화가나", "엉망", "심한", "괴롭", "억울", "질림",
            "형편없", "피하", "거부", "환불", "사기", "짜증", "거짓", "헛걸", "헛수고", "돈낭비",
            "나빠", 'ㅋㅋㅋㅋㅋㅋㅋㅋㅋ', '나빴고',"황당", "어이없", "당황", "허탈", "기분나쁨", "짜증남", "짜증나", "기가막힘", "기가막히", "화딱지", 
            "스트레스", "고통", "괴로움", "힘들", "고달프", "지친", "지루한", "싫증나", "짜증스러", "지겨운",
            
            "최저", "수준이하", "말도안됨", "말이안됨", "말이되나", "지저분", "냄새나", "비위생적", "신선하지않", "상한",
            "맛없", "맛이없", "못먹", "맛도없", "맛이상", "이상한맛", "혀가얼얼", "입에안맞", "짠맛", "너무짠",
            
            "과대광고", "과대포장", "호갱", "호구", "사기당한", "눈속임", "낚였", "낚시", "뻥튀기", 
            "가성비최악", "배달사고", "배달누락", "반품", "교환", "환불요청", "금액차이", "바가지", "법적대응", "신고",
            
            "불성실", "불량", "불리한", "불합리", "막말", "갑질", "오만", "건방진", "태도나쁨", "태도불량",
            "서비스최악", "무시하는", "무성의", "소통불가", "전화무응답", "연락안됨", "약속불이행", "약속어김", "기본도없", "예의없",
            
            "다신안", "절대로안", "앞으로절대", "다음은없", "마지막방문", "발걸음안", "발길안", "발도못", "이게뭐", "왜이래",
            "이게뭔", "왜그런", "왜이런", "어쩔수없", "망했", "없어졌으면", "사라졌으면", "폐업해", "폐업했", "망하길",
            
            "완전꽝", "개노답", "노답", "쓰레기", "똥", "진짜아님", "내돈내산", "구라", "뻥", "거품", 
            "킹받", "빡치", "극혐", "현타", "멘붕", "현실괴리"
        ]
        
        sentiment_dict = {}
        
        for word in positive_words:
            sentiment_dict[word] = 1.0
            
        for word in negative_words:
            sentiment_dict[word] = -1.0
            
        return sentiment_dict
    
    def _load_stopwords(self) -> List[str]:
        """불용어 사전 로드"""
        stopwords = [
            "이", "그", "저", "것", "수", "은", "는", "이", "가", "을", "를", "에", "에서", "으로",
            "로", "와", "과", "의", "도", "에게", "께", "처럼", "만큼", "이다", "있다", "하다", "그리고",
            "그러나", "그렇지만", "하지만", "또한", "그리고", "및", "또", "또는", "혹은", "이나", "너무",
            "매우", "정말", "진짜", "완전", "아주", "너무나", "굉장히", "대단히", "엄청", "통", "더",
            "그런데", "그래서", "따라서", "그러므로", "그러니까", "때문에", "이때", "그때", "이후", "그후",
            "이전", "그전", "곧", "이미", "방금", "얼마", "있다", "없다", "같다", "바로", "뭐", "애",
            "좀", "많이", "조금", "약간", "다시", "또", "응", "어", "아", "음", "네", "예", "아니",
            "아니요", "아뇨", "왜", "어떻게", "언제", "어디", "누구", "무엇", "어느", "어떤", "몇",
            "거기", "여기", "저기", "그곳", "이곳", "저곳", "요거", "이거", "저거", "그것", "이것", "저것"
        ]
        return stopwords
    
    async def fetch_reviews_with_selenium(self, place_id: str) -> List[Dict[str, Any]]:
        reviews = []
        driver = None

        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument(f"user-agent={self.headers['User-Agent']}")
            chrome_options.add_argument("--incognito")

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
                                
                                rating = 0
                                rating_pattern = r'평점\s*(\d+(\.\d+)?)'
                                rating_match = re.search(rating_pattern, review_text)
                                if rating_match:
                                    try:
                                        rating = float(rating_match.group(1))
                                    except ValueError:
                                        rating = 0
                                
                                date = "알 수 없음"
                                date_pattern = r'(\d{4}-\d{2}-\d{2}|\d{4}\.\d{2}\.\d{2})'
                                date_match = re.search(date_pattern, review_text)
                                if date_match:
                                    date = date_match.group(1)
                                
                                reviews.append({
                                    "text": review_text,
                                    "rating": rating,
                                    "date": date,
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
                logger.info("WebDriver 종료됨")
    
    def _analyze_single_review(self, review: Dict[str, Any]) -> Dict[str, Any]:
        """KoNLPy를 활용한 단일 리뷰 분석"""
        text = review["text"].lower()
        
        morphs = self.okt.pos(text)
        
        sentiment_score = 0
        matched_words = []
        
        for word, pos in morphs:
            if pos in ['Adjective', 'Verb', 'Noun']:
                for sentiment_word, score in self.sentiment_dict.items():
                    if sentiment_word in word:
                        sentiment_score += score
                        matched_words.append(word)
        
        sentiment = "neutral"
        if sentiment_score > 1:
            sentiment = "positive"
        elif sentiment_score < -0.5:
            sentiment = "negative"
        
        keywords = []
        for word, pos in morphs:
            if pos == 'Noun' and len(word) > 1 and word not in self.stopwords:
                keywords.append(word)
        
        keywords = list(dict.fromkeys(keywords))[:5]
        
        review_copy = review.copy()
        review_copy["sentiment"] = sentiment
        review_copy["sentiment_score"] = sentiment_score
        review_copy["keywords"] = keywords
        review_copy["matched_sentiment_words"] = list(set(matched_words))
        
        return review_copy
    
    def _process_reviews_batch(self, batch):
        """리뷰 배치를 처리하는 메소드"""
        return [self._analyze_single_review(review) for review in batch]
    
    async def analyze_sentiment(self, reviews: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """KoNLPy를 활용한 감성 분석 (병렬 처리)"""
        if not reviews:
            return []
        
        def process_reviews_batch(batch):
            return [self._analyze_single_review(review) for review in batch]
        
        batch_size = 10
        review_batches = [reviews[i:i + batch_size] for i in range(0, len(reviews), batch_size)]
        
        analyzed_reviews = []
        for batch in review_batches:
            analyzed_reviews.extend(self._process_reviews_batch(batch))
        
        return analyzed_reviews
    
    async def generate_word_cloud_data(self, reviews: List[Dict[str, Any]]) -> Dict[str, Dict[str, int]]:
        """KoNLPy를 활용한, 개선된 워드 클라우드 데이터 생성"""
        positive_reviews = [r for r in reviews if r.get("sentiment") == "positive"]
        negative_reviews = [r for r in reviews if r.get("sentiment") == "negative"]
        
        positive_nouns = []
        for review in positive_reviews:
            text = review.get("text", "")
            try:
                nouns = self.okt.nouns(text)
                filtered_nouns = [noun for noun in nouns if len(noun) > 1 and noun not in self.stopwords]
                positive_nouns.extend(filtered_nouns)
            except Exception as e:
                logger.warning(f"긍정 리뷰 단어 추출 오류: {e}")
        
        negative_nouns = []
        for review in negative_reviews:
            text = review.get("text", "")
            try:
                nouns = self.okt.nouns(text)
                filtered_nouns = [noun for noun in nouns if len(noun) > 1 and noun not in self.stopwords]
                negative_nouns.extend(filtered_nouns)
            except Exception as e:
                logger.warning(f"부정 리뷰 단어 추출 오류: {e}")
        
        positive_counter = Counter(positive_nouns)
        negative_counter = Counter(negative_nouns)
        
        positive_words = dict(positive_counter.most_common(50))
        negative_words = dict(negative_counter.most_common(50))
        
        return {
            "positive_words": positive_words,
            "negative_words": negative_words
        }
    
    async def generate_category_insights(self, reviews: List[Dict[str, Any]]) -> Dict[str, Any]:
        """리뷰에서 카테고리별 인사이트 생성"""
        categories = {
            "음식": ["맛", "맛있", "메뉴", "요리", "음식", "식사", "식감", "간", "양념", "소스", "밥", "반찬"],
            "서비스": ["서비스", "직원", "종업원", "사장", "알바", "태도", "친절", "응대", "접객", "예약", "대기"],
            "가격": ["가격", "값", "비싸", "저렴", "가성비", "원", "만원", "천원", "비용", "지불", "계산"],
            "분위기": ["분위기", "인테리어", "공간", "자리", "테이블", "좌석", "인테리어", "조명", "음악", "시설", "화장실"],
            "위생": ["위생", "청결", "깨끗", "더러", "먼지", "냄새", "악취", "찝찝", "깔끔"]
        }
        
        category_data = {cat: {"positive": 0, "negative": 0, "keywords": []} for cat in categories.keys()}
        
        for review in reviews:
            text = review.get("text", "")
            sentiment = review.get("sentiment", "neutral")
            
            for category, keywords in categories.items():
                matched = False
                for keyword in keywords:
                    if keyword in text:
                        matched = True
                        if sentiment == "positive":
                            category_data[category]["positive"] += 1
                        elif sentiment == "negative":
                            category_data[category]["negative"] += 1
                        
                        try:
                            nouns = self.okt.nouns(text)
                            for noun in nouns:
                                if len(noun) > 1 and noun not in self.stopwords:
                                    category_data[category]["keywords"].append(noun)
                        except:
                            pass
                            
                        break
                
                if matched:
                    counter = Counter(category_data[category]["keywords"])
                    category_data[category]["keywords"] = dict(counter.most_common(10))
        
        return category_data
    
    async def generate_insights_locally(self, reviews: List[Dict[str, Any]], category_insights: Dict[str, Any]) -> str:
        """외부 API 의존성 없이 자체적으로 리뷰 인사이트 생성"""
        try:
            if not reviews:
                return "리뷰 데이터가 없어 인사이트를 생성할 수 없습니다."
            
            positive_reviews = [r for r in reviews if r.get("sentiment") == "positive"]
            negative_reviews = [r for r in reviews if r.get("sentiment") == "negative"]
            
            strengths = []
            weaknesses = []
            
            if category_insights['음식']['positive'] > category_insights['음식']['negative']:
                food_keywords = list(category_insights['음식']['keywords'].keys())[:3]
                if food_keywords:
                    strengths.append(f"음식 맛과 품질({', '.join(food_keywords)})에 대한 긍정적 평가가 많습니다.")
            elif category_insights['음식']['negative'] > 0:
                food_keywords = list(category_insights['음식']['keywords'].keys())[:3]
                if food_keywords:
                    weaknesses.append(f"음식({', '.join(food_keywords)})에 대한 개선 요구가 있습니다.")
            
            if category_insights['서비스']['positive'] > category_insights['서비스']['negative']:
                strengths.append("직원의 서비스와 응대에 만족하는 고객이 많습니다.")
            elif category_insights['서비스']['negative'] > 0:
                weaknesses.append("서비스 품질에 대한 불만이 있습니다.")
            
            if category_insights['가격']['positive'] > category_insights['가격']['negative']:
                strengths.append("가격 대비 가치가 높다는 평가가 있습니다.")
            elif category_insights['가격']['negative'] > 0:
                weaknesses.append("가격이 비싸다는 의견이 있습니다.")
            
            if category_insights['분위기']['positive'] > category_insights['분위기']['negative']:
                strengths.append("매장 분위기와 인테리어에 만족하는 고객이 많습니다.")
            elif category_insights['분위기']['negative'] > 0:
                weaknesses.append("매장 분위기나 인테리어에 대한 개선 요구가 있습니다.")
            
            if category_insights['위생']['positive'] > category_insights['위생']['negative']:
                strengths.append("매장의 청결함과 위생 상태가 좋다는 평가가 있습니다.")
            elif category_insights['위생']['negative'] > 0:
                weaknesses.append("위생과 청결에 대한 개선이 필요합니다.")
            
            positive_keywords = {}
            for review in positive_reviews:
                for keyword in review.get("keywords", []):
                    positive_keywords[keyword] = positive_keywords.get(keyword, 0) + 1
            
            negative_keywords = {}
            for review in negative_reviews:
                for keyword in review.get("keywords", []):
                    negative_keywords[keyword] = negative_keywords.get(keyword, 0) + 1
            
            top_positive = sorted(positive_keywords.items(), key=lambda x: x[1], reverse=True)[:5]
            top_negative = sorted(negative_keywords.items(), key=lambda x: x[1], reverse=True)[:5]
            
            if top_positive:
                strengths.append(f"고객들이 자주 언급한 긍정적 키워드: {', '.join([k for k, v in top_positive])}")
            
            if top_negative:
                weaknesses.append(f"고객들이 자주 언급한 부정적 키워드: {', '.join([k for k, v in top_negative])}")
            
            recommendations = []
            
            if category_insights['음식']['negative'] > 0:
                recommendations.append("인기 메뉴를 중심으로 맛과 품질 개선에 집중하세요.")
            
            if category_insights['서비스']['negative'] > 0:
                recommendations.append("직원 교육과 서비스 매뉴얼을 강화하세요.")
            
            if category_insights['가격']['negative'] > category_insights['가격']['positive']:
                recommendations.append("가성비 좋은 세트 메뉴나 할인 프로모션을 고려해보세요.")
            
            if category_insights['분위기']['negative'] > 0:
                recommendations.append("인테리어 개선이나 좌석 배치 최적화를 검토해보세요.")
            
            if category_insights['위생']['negative'] > 0:
                recommendations.append("청소 주기를 늘리고 위생 관리를 강화하세요.")
            
            recommendations.append("정기적으로 고객 리뷰를 확인하고 개선 사항을 반영하세요.")
            
            result = "## 리뷰 분석 인사이트\n\n"
            
            result += "### 1. 고객들이 가장 만족하는 점\n"
            if strengths:
                for strength in strengths[:5]: 
                    result += f"- {strength}\n"
            else:
                result += "- 충분한 긍정적 피드백이 없어 분석할 수 없습니다.\n"
            
            result += "\n### 2. 개선이 필요한 부분\n"
            if weaknesses:
                for weakness in weaknesses[:5]:  
                    result += f"- {weakness}\n"
            else:
                result += "- 주요 개선 필요 사항이 발견되지 않았습니다.\n"
            
            result += "\n### 3. 매장 운영에 도움이 될만한 구체적인 제안\n"
            if recommendations:
                for recommendation in recommendations[:5]: 
                    result += f"- {recommendation}\n"
            else:
                result += "- 충분한 데이터가 없어 구체적인 제안을 제공할 수 없습니다.\n"
            
            return result
            
        except Exception as e:
            logger.error(f"로컬 인사이트 생성 중 오류: {e}")
            return "리뷰를 분석한 결과, 이 매장의 강점과 개선점이 있습니다. 상세 분석은 현재 제공할 수 없습니다."
    
    async def call_claude_api(self, prompt: str) -> str:
        """Claude API를 직접 호출하여 인사이트 생성"""
        try:
            import aiohttp
            import os
            
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                logger.warning("ANTHROPIC_API_KEY가 설정되지 않았습니다.")
                return None
                
            url = "https://api.anthropic.com/v1/messages"
            headers = {
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            
            data = {
                "model": "claude-3-7-sonnet-20250219",
                "max_tokens": 4000,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, headers=headers, json=data) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        logger.error(f"Claude API 오류: {response.status}, {error_text}")
                        return None
                        
                    response_json = await response.json()
                    return response_json["content"][0]["text"]
                    
        except Exception as e:
            logger.error(f"Claude API 호출 중 오류: {e}")
            return None
            
    async def generate_insights(self, reviews: List[Dict[str, Any]], place_id: str) -> str:
        """리뷰 인사이트 생성 (Claude API와 로컬 분석 둘 다 사용)"""
        try:
            category_insights = await self.generate_category_insights(reviews)
            
            positive_count = sum(1 for r in reviews if r.get("sentiment") == "positive")
            negative_count = sum(1 for r in reviews if r.get("sentiment") == "negative")
            neutral_count = sum(1 for r in reviews if r.get("sentiment") == "neutral")
            
            total_reviews = len(reviews)
            positive_ratio = positive_count / total_reviews * 100 if total_reviews > 0 else 0
            negative_ratio = negative_count / total_reviews * 100 if total_reviews > 0 else 0
            
            all_keywords = []
            for review in reviews:
                all_keywords.extend(review.get("keywords", []))
            
            top_keywords = dict(Counter(all_keywords).most_common(10))
            
            review_texts = [f"[리뷰] {r['text']} (감성: {r['sentiment']})" 
                           for r in reviews[:20]]  
            
            prompt = f"""
                네이버 장소 ID "{place_id}"인 매장의 리뷰 데이터를 분석하여 매장주를 위한 인사이트를 제공해 주세요.
                
                리뷰 개요:
                - 총 리뷰 수: {total_reviews}개
                - 긍정 리뷰: {positive_count}개 ({positive_ratio:.1f}%)
                - 부정 리뷰: {negative_count}개 ({negative_ratio:.1f}%)
                
                카테고리별 분석:
                - 음식: 긍정 {category_insights['음식']['positive']}개, 부정 {category_insights['음식']['negative']}개
                - 서비스: 긍정 {category_insights['서비스']['positive']}개, 부정 {category_insights['서비스']['negative']}개
                - 가격: 긍정 {category_insights['가격']['positive']}개, 부정 {category_insights['가격']['negative']}개
                - 분위기: 긍정 {category_insights['분위기']['positive']}개, 부정 {category_insights['분위기']['negative']}개
                - 위생: 긍정 {category_insights['위생']['positive']}개, 부정 {category_insights['위생']['negative']}개
                
                자주 언급된 키워드: {', '.join(list(top_keywords.keys()))}
                
                다음은 수집된 리뷰 샘플입니다:
                {chr(10).join(review_texts)}
                
                다음 정보를 포함하는 분석 인사이트를 제공해 주세요:
                1. 고객들이 가장 만족하는 점
                2. 개선이 필요한 부분
                3. 매장 운영에 도움이 될만한 구체적인 제안

                마크다운 형식으로 응답해주세요.
            """
            
            claude_response = await self.call_claude_api(prompt)
            
            if claude_response and len(claude_response) > 100:
                logger.info("Claude API로 인사이트 생성 성공")
                return claude_response
            
            logger.info("Claude API 호출 실패, 로컬 인사이트 생성으로 대체")
            return await self.generate_insights_locally(reviews, category_insights)
            
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
            category_insights = await self.generate_category_insights(analyzed_reviews)
            insights = await self.generate_insights(analyzed_reviews, place_id)
            
            total_reviews = len(analyzed_reviews)
            avg_rating = sum(r.get("rating", 0) for r in analyzed_reviews) / total_reviews if total_reviews > 0 else 0
            sentiment_counts = {
                "positive": sum(1 for r in analyzed_reviews if r.get("sentiment") == "positive"),
                "neutral": sum(1 for r in analyzed_reviews if r.get("sentiment") == "neutral"),
                "negative": sum(1 for r in analyzed_reviews if r.get("sentiment") == "negative")
            }
            api_key = os.getenv("ANTHROPIC_API_KEY")
            result = {
                "store_id": store_id,
                "place_id": place_id,
                "reviews": analyzed_reviews,
                "review_count": total_reviews,
                "average_rating": round(avg_rating, 1),
                "sentiment_distribution": sentiment_counts,
                "word_cloud_data": word_cloud_data,
                "category_insights": category_insights,
                "insights": insights,
                "insights_source": "claude_api" if api_key else "local_analysis",
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