# models/chat_models.py

from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    user_id: int
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    bot_message: str