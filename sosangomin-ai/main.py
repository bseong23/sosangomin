# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from dotenv import load_dotenv
import os

# 라우터 임포트
from routers import chat_router, news_router, data_analysis_router, s3_router

# 스케줄러 임포트
from schedulers.news_scheduler import start_news_scheduler

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

app = FastAPI(
    title="소상공인 데이터 분석 플랫폼 API",
    description="소상공인을 위한, 데이터 분석, 예측, 채팅 및 뉴스 API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router.router)
app.include_router(news_router.router)
app.include_router(data_analysis_router.router)
app.include_router(s3_router.router)

@app.get("/")
def read_root():
    return {"message": "소상공인을 위한 API 서비스가 실행 중입니다."}

@app.on_event("startup")
async def startup_event():
    start_news_scheduler()
    logger.info("애플리케이션 시작 및 뉴스 업데이트 작업 스케줄링 완료")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("애플리케이션 종료")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    
    # 개발 환경에서 실행
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)