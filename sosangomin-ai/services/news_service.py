import os
import logging
import asyncio
import aiohttp
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import News
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup
import re
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class NewsService:
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
            "X-Naver-Client-Secret": self.client_secret
        }
        self.base_url = "https://openapi.naver.com/v1/search/news.json"

        # 소상공인 관련 검색 키워드
        self.keywords = [
            "소상공인 지원",
            "자영업 정책",
            "소상공인 대출",
            "소상공인 세금",
            "창업 지원",
            "소상공인 보조금",
            "상권 분석",
            "프랜차이즈 동향",
            "소상공인 마케팅",
            "자영업자 보험",
            "가게 운영",
            "매출 증대",
            "소비 트렌드",
            "배달 플랫폼"
        ]
        
        # 뉴스 카테고리
        self.categories = {
            "지원정책": ["지원", "정책", "보조금", "자금", "세금", "대출"],
            "창업정보": ["창업", "상권", "프랜차이즈", "사업계획", "입지"],
            "경영관리": ["경영", "관리", "마케팅", "회계", "세무", "인사"],
            "시장동향": ["트렌드", "동향", "소비", "매출", "시장"],
            "플랫폼": ["배달", "온라인", "플랫폼", "앱", "디지털"]
        }
    
    async def fetch_news(self, session, keyword: str, display: int = 10, start: int = 1) -> Dict[str, Any]:
        """네이버 검색 API를 사용하여 뉴스 검색 (비동기)"""
        try:
            params = {
                "query": keyword,
                "display": display,
                "start": start,
                "sort": "date"  
            }
            
            async with session.get(self.base_url, headers=self.headers, params=params) as response:
                response.raise_for_status()
                return await response.json()
        except Exception as e:
            logger.error(f"뉴스 검색 API 호출 중 오류 발생: {e}")
            return {"items": []}
    
    def determine_category(self, title: str, description: str) -> str:
        """뉴스 제목과 설명을 기반으로 카테고리 결정"""
        combined_text = (title + " " + description).lower()
        
        category_scores = {}
        for category, keywords in self.categories.items():
            score = sum(1 for keyword in keywords if keyword in combined_text)
            category_scores[category] = score
        
        max_score = max(category_scores.values(), default=0)
        if max_score > 0:
            for category, score in category_scores.items():
                if score == max_score:
                    return category
        
        return "기타"
    
    def clean_html_text(self, html_text: str) -> str:
        """HTML 태그 제거 및 텍스트 정리"""
        # HTML 태그 제거
        soup = BeautifulSoup(html_text, 'html.parser')
        clean_text = soup.get_text()
        
        # 특수문자 제거 및 공백 정리
        clean_text = re.sub(r'&[a-zA-Z0-9]+;', ' ', clean_text)  # HTML 엔티티 제거
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()  # 연속된 공백 처리
        
        return clean_text
    
    def parse_pub_date(self, date_str: str) -> datetime.date:
        """네이버 API의 pubDate 문자열을 파싱하여 날짜 객체로 변환"""
        try:
            dt = datetime.strptime(date_str, '%a, %d %b %Y %H:%M:%S %z')
            return dt.date()
        except ValueError:
            logger.warning(f"날짜 파싱 실패: {date_str}, 오늘 날짜 사용")
            return datetime.now().date()
    
    async def update_news(self):
        """최신 뉴스를 수집하고 데이터베이스에 저장 (비동기)"""
        # DB 세션 생성
        from database.connector import database_instance as mariadb
        db = mariadb.pre_session()
        
        try:
            logger.info("뉴스 업데이트 작업 시작")
            all_news = []
            saved_count = 0
            skipped_count = 0
            
            current_time = datetime.now(datetime.now().astimezone().tzinfo)
            
            async with aiohttp.ClientSession() as session:
                # 각 키워드별로 검색 수행
                for keyword in self.keywords:
                    logger.info(f"키워드 '{keyword}'로 뉴스 검색 중...")
                    news_data = await self.fetch_news(session, keyword, display=20) 
                    
                    for item in news_data.get("items", []):
                        try:
                            title = self.clean_html_text(item.get("title", ""))
                            description = self.clean_html_text(item.get("description", ""))
                            link = item.get("originallink") or item.get("link", "")
                            pub_date = self.parse_pub_date(item.get("pubDate", ""))
                            
                            # 중복 검사
                            existing_news = db.query(News).filter(News.link == link).first()
                            if existing_news:
                                continue
                            
                            # 카테고리 결정
                            category = self.determine_category(title, description)
                            
                            try:
                                image_url = await self.extract_image_url(session, link)
                                
                                if image_url is None:
                                    logger.info(f"이미지 URL 추출 실패로 항목 건너뜀: {title}")
                                    skipped_count += 1
                                    continue
                                    
                                # 뉴스 객체 생성
                                news = News(
                                    title=title,
                                    link=link,
                                    pub_date=pub_date,
                                    image_url=image_url,
                                    category=category,
                                    created_at=current_time
                                )
                                
                                db.add(news)
                                all_news.append(news)
                                saved_count += 1
                                
                            except UnicodeDecodeError:
                                logger.warning(f"인코딩 오류로 항목 건너뜀: {title}")
                                skipped_count += 1
                                continue
                            except Exception as e:
                                logger.warning(f"이미지 추출 중 오류로 항목 건너뜀: {e}")
                                skipped_count += 1
                                continue
                                
                        except Exception as e:
                            logger.warning(f"뉴스 항목 처리 중 오류 발생 (건너뜀): {e}")
                            skipped_count += 1
                            continue
                    
                    await asyncio.sleep(0.5)
            
            try:
                db.commit()
                logger.info(f"총 {saved_count}개의 새로운 뉴스 기사가 저장되었습니다. {skipped_count}개 항목 건너뜀.")
            except Exception as e:
                db.rollback()
                logger.error(f"뉴스 저장 중 오류 발생: {e}")
            
            return all_news
            
        except Exception as e:
            logger.error(f"뉴스 업데이트 중 오류 발생: {e}")
            return []
        finally:
            db.close()

    async def extract_image_url(self, session, news_url: str) -> Optional[str]:
        """뉴스 링크에서 대표 이미지 URL 추출 시도 (비동기)"""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            
            async with session.get(
                news_url, 
                headers=headers, 
                timeout=aiohttp.ClientTimeout(total=3)  
            ) as response:
                if response.status != 200:
                    return None
                
                html = await response.text()
                
                soup = BeautifulSoup(html, 'html.parser')
                
                og_image = soup.find('meta', property='og:image')
                if og_image and og_image.get('content'):
                    return og_image['content']
                
                return None
                
        except Exception as e:
            logger.warning(f"이미지 URL 추출 실패: {e}")
            return None
    
    def get_recent_news(self, db: Session, category: Optional[str] = None, limit: int = 20) -> List[News]:
        """최근 뉴스 조회 (카테고리별 필터링 옵션)"""
        query = db.query(News).order_by(News.pub_date.desc())
        
        if category and category != "전체":
            query = query.filter(News.category == category)
        
        return query.limit(limit).all()
    
    def get_news_categories(self) -> List[str]:
        """뉴스 카테고리 목록 반환"""
        return ["전체"] + list(self.categories.keys())
    
    def get_news_by_id(self, db: Session, news_id: int) -> Optional[News]:
        """ID로 뉴스 조회"""
        return db.query(News).filter(News.news_id == news_id).first()

news_service = NewsService()