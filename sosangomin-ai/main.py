# main.py

# FastAPI
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# System
from dotenv import load_dotenv
import logging
import asyncio

# DB
from database.connector import database_instance as mariadb
# from database.mongo_connector import mongo_instance as mongodb

# Services
from services.news_service import news_service
from services.chat_service import chat_service
from services.automl import predict_next_month_sales, perform_clustering

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

# 요청 모델
class ChatRequest(BaseModel):
    user_id: int
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    bot_message: str

# ChatBot 엔드포인트트
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """채팅 API 엔드포인트"""
    try:
        result = await chat_service.process_chat(
            user_id=request.user_id,
            user_message=request.message,
            session_id=request.session_id
        )
        return result
    except Exception as e:
        logger.error(f"채팅 처리 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
    
@app.post("/predict_sales/")
async def sales_forecast(file: UploadFile = File(...)):
    """ 다음달 매출 예측 API """
    result = await predict_next_month_sales(file) 
    return result

@app.post("/cluster/")
async def cluster_analysis(file: UploadFile = File(...)):
    """ 클러스터링 실행 후 OpenAI를 활용하여 인사이트 분석 """
    result = await perform_clustering(file)

    # OpenAI API를 통해 클러스터링 분석 요청
    # if "clusters" in result:
    #     openai_response = analyze_clusters(result["clusters"])
    #     result["openai_analysis"] = openai_response

    return result


