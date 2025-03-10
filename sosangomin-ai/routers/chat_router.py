# routers/chat_router.py

from fastapi import APIRouter, HTTPException
import logging
from models.chat_models import ChatRequest, ChatResponse
from services.chat_service import chat_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api",
    tags=["채팅"],
    responses={404: {"description": "찾을 수 없음"}},
)

@router.post("/chat", response_model=ChatResponse)
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