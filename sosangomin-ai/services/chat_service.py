# chat_service.py

import os
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, List
from anthropic import Anthropic
import uuid
from dotenv import load_dotenv

from db_models import ChatHistory, ChatSession
from database.connector import database_instance

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        load_dotenv("./config/.env")
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.error("Anthropic API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            api_key = "NOT_SET"  
        
        self.client = Anthropic(api_key=api_key)
        
        # 시스템 프롬프트 설정
        self.system_prompt = """
        당신은 자영업자를 위한 비즈니스 도우미 '소상고민'입니다.
        반드시 다음 규칙을 지키세요:
        - 항상 2-3문장으로만 답변할 것.
        - 줄바꿈을 사용하지 말고 연속된 텍스트로 응답할 것.
        - 번호 매기기나 글머리 기호를 사용하지 말 것.
        - 쉬운 말로 친근하게 대화할 것.
        - 자영업자의 고민에 공감하면서 실용적인 조언을 제공할 것.
        - 꼭 완성된 답변으로 제공하세요.
        """
    
    async def process_chat(self, user_id: int, user_message: str, session_id: Optional[str] = None) -> Dict:
        """채팅 메시지 처리 메인 함수"""
        # DB 세션 생성
        db = database_instance.pre_session()
        
        try:
            logger.info(f"사용자 {user_id}의 채팅 처리 시작")
            
            # 세션 관리
            session_id = self._get_or_create_session(db, user_id, session_id)
            
            # 채팅 히스토리 조회
            history = self._get_chat_history(db, session_id)
            
            messages = self._prepare_messages(history, user_message)
            response = await self._get_claude_response(messages)
            
            self._save_chat_history(db, session_id, user_id, user_message, response)
            
            db.commit()
            
            logger.info(f"사용자 {user_id}의 채팅 처리 완료")
            return {
                "session_id": session_id,
                "bot_message": response
            }
        except Exception as e:
            db.rollback()
            logger.error(f"채팅 처리 중 오류 발생: {str(e)}")
            raise
        finally:
            db.close()
    
    def _get_or_create_session(self, db, user_id: int, session_id: Optional[str] = None) -> str:
        """채팅 세션 조회 또는 생성"""
        try:
            current_time = datetime.now(timezone.utc)
            
            if not session_id:
                new_session = ChatSession(
                    uid=str(uuid.uuid4()),
                    user_id=user_id,
                    created_at=current_time,
                    last_active=current_time
                )
                db.add(new_session)
                db.flush()
                logger.debug(f"새 세션 생성: {new_session.uid}")
                return new_session.uid
            
            session = db.query(ChatSession).filter(ChatSession.uid == session_id).first()
            if session:
                session.last_active = current_time
                logger.debug(f"기존 세션 갱신: {session.uid}")
                return session.uid
            
            new_session = ChatSession(
                uid=session_id,
                user_id=user_id,
                created_at=current_time,
                last_active=current_time
            )
            db.add(new_session)
            db.flush()
            logger.debug(f"지정된 ID로 새 세션 생성: {new_session.uid}")
            return new_session.uid
        except Exception as e:
            logger.error(f"세션 생성 중 오류: {str(e)}")
            raise
    
    def _get_chat_history(self, db, session_id: str) -> List[ChatHistory]:
        """최근 채팅 내역 조회 (최근 5개)"""
        try:
            history = db.query(ChatHistory)\
                .filter(ChatHistory.session_id == session_id)\
                .order_by(ChatHistory.created_at.desc())\
                .limit(5)\
                .all()
            
            return sorted(history, key=lambda x: x.created_at)
        except Exception as e:
            logger.error(f"채팅 내역 조회 중 오류: {str(e)}")
            return []
    
    async def _get_claude_response(self, messages: list) -> str:
        """Claude API를 통한 응답 생성"""
        try:
            user_assistant_messages = [msg for msg in messages if msg["role"] != "system"]
            system_message = next((msg["content"] for msg in messages if msg["role"] == "system"), "")
            
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=400,
                temperature=0.1,
                system=system_message,  
                messages=user_assistant_messages  
            )
              
            text = response.content[0].text
            text = text.replace("\\n", " ").replace("\\t", " ")
            text = text.replace("\n", " ").replace("\t", " ")
            text = text.replace("\n\n", "")
            return text
        except Exception as e:
            logger.error(f"Claude API 오류: {str(e)}")
            return "죄송합니다, 현재 응답을 생성하는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
    
    def _prepare_messages(self, history, user_message: str) -> list:
        """Claude API 요청을 위한 메시지 준비"""
        messages = [{"role": "system", "content": self.system_prompt}]  
        
        for h in history:
            messages.append({"role": "user", "content": h.user_message})
            messages.append({"role": "assistant", "content": h.bot_message})
        
        messages.append({"role": "user", "content": user_message})
        return messages
    
    def _save_chat_history(self, db, session_id: str, user_id: int, user_message: str, bot_message: str):
        """채팅 내역 저장"""
        try:
            current_time = datetime.now(timezone.utc)
            chat_history = ChatHistory(
                session_id=session_id,
                user_id=user_id,
                user_message=user_message,
                bot_message=bot_message,
                created_at=current_time
            )
            db.add(chat_history)
            db.flush()
            logger.debug(f"채팅 내역 저장 완료: 세션 {session_id}")
        except Exception as e:
            logger.error(f"채팅 내역 저장 중 오류: {str(e)}")
            raise

chat_service = ChatService()