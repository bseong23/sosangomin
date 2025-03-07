# main.py

# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# System
from dotenv import load_dotenv
import logging
import asyncio

# DB
from database.connector import database_instance as mariadb
# from database.mongo_connector import mongo_instance as mongodb

# Services
from services.news_service import news_service


# 환경 변수 로드
load_dotenv("./config/.env")

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# news 업데이트
async def schedule_news_updates():
    while True:
        try:
            logger.info("일일 뉴스 업데이트 작업 시작")
            await news_service.update_news()
            logger.info("뉴스 업데이트 완료, 다음 업데이트까지 대기")
            await asyncio.sleep(86400)
        except Exception as e:
            logger.error(f"뉴스 업데이트 스케줄링 중 오류 발생: {e}")
            await asyncio.sleep(1800)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(schedule_news_updates())
    logger.info("애플리케이션 시작 및 뉴스 업데이트 작업 스케줄링 완료")

@app.get("/")
def read_root():
    return {"message": "소상공인을 위한 API 서비스가 실행 중입니다."}

@app.get("/trigger-news-update")
async def trigger_news_update():
    """수동으로 뉴스 업데이트를 트리거하는 엔드포인트"""
    try:
        news = await news_service.update_news()
        return {"status": "success", "message": f"{len(news)}개의 뉴스가 업데이트되었습니다."}
    except Exception as e:
        logger.error(f"수동 뉴스 업데이트 중 오류: {e}")
        return {"status": "error", "message": str(e)}