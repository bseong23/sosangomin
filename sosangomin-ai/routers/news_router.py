# routers/news_router.py

from fastapi import APIRouter, HTTPException
import logging
from services.news_service import news_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api",
    tags=["뉴스"],
    responses={404: {"description": "찾을 수 없음"}},
)

@router.get("/trigger-news-update")
async def trigger_news_update():
    """수동으로 뉴스 업데이트를 트리거하는 엔드포인트"""
    try:
        news = await news_service.update_news()
        return {"status": "success", "message": f"{len(news)}개의 뉴스가 업데이트되었습니다."}
    except Exception as e:
        logger.error(f"수동 뉴스 업데이트 중 오류: {e}")
        return {"status": "error", "message": str(e)}