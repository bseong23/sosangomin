# routers/chat_router.py

from fastapi import APIRouter, HTTPException
import logging
from typing import Optional
from pydantic import BaseModel
from services.chat_service import chat_service

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api",
    tags=["채팅"],
    responses={404: {"description": "찾을 수 없음"}},
)

class ChatRequest(BaseModel):
    user_id: int
    message: str
    session_id: Optional[str] = None
    store_id: Optional[int] = None

class ChatResponse(BaseModel):
    session_id: str
    bot_message: str
    message_type: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """통합 챗봇 API 엔드포인트"""
    try:
        result = await chat_service.process_chat(
            user_id=request.user_id,
            user_message=request.message,
            session_id=request.session_id,
            store_id = request.store_id
        )
        return result
    except Exception as e:
        logger.error(f"챗팅 처리 중 오류: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
