# services/chat_service.py

import os
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, List, Any
from anthropic import Anthropic
import uuid
import json
import re
from bson import ObjectId
from dotenv import load_dotenv

from db_models import ChatHistory, ChatSession, Store
from database.connector import database_instance
from database.mongo_connector import mongo_instance
from services.rag_service import rag_service

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self):
        load_dotenv("./config/.env")
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            logger.error("Anthropic API 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
            raise ValueError("API 키가 설정되지 않았습니다.")
        
        self.client = Anthropic(api_key=api_key)
        
        # 시스템 프롬프트 설정
        self.system_prompt = """
        당신은 자영업자를 위한 비즈니스 도우미 '고미니'입니다.
        반드시 다음 규칙을 지키세요:
        - 사용자의 메시지가 짧거나 단순 인사, 감사일 경우, 간단히 인사만 하세요.
        - 항상 2-3문장으로만 답변할 것.
        - 쉬운 말로 친근하게 대화할 것.
        - 자영업자의 고민에 공감하면서 실용적인 조언을 제공할 것.
        - 중요한 점이나 단계를 설명할 때는 줄바꿈(\\n)을 사용하여 가독성을 높이세요.
        - 항목을 나열할 때는 각 항목 앞에 - 를 붙이고 줄바꿈을 사용하세요.
        - 꼭 완성된 답변으로 제공하세요.
        
        제공된 검색 결과가 있다면 이를 기반으로 답변하되, 없는 내용을 지어내지 마세요.
        데이터 분석 정보가 제공된 경우 이를 참고하여 구체적인 비즈니스 인사이트를 제공하세요.
        검색 결과가 없거나 관련이 없는 경우 솔직하게 모른다고 답변하세요.
        """
        
        # 데이터 분석 관련 키워드
        self.data_keywords = [
            "매출", "데이터", "분석", "통계", "차트", "그래프", "매출액", 
            "고객수", "고객 수", "판매량", "점심", "저녁", "시간대", "요일", 
            "상품", "시간별", "시즌", "공휴일", "매장", "가게", "메뉴",
            "매출 현황", "성과", "실적", "인기 메뉴", "매출 추이", "영업",
            '우리', '가게', '프로모션', '마케팅',
        ]
        
    async def process_chat(self, user_id: int, user_message: str, session_id: Optional[str] = None, store_id: Optional[int] = None) -> Dict:
        """통합된 챗팅 메시지 처리 메인 함수"""
        db = database_instance.pre_session()
        
        try:
            logger.info(f"사용자 {user_id}의 챗팅 처리 시작")
            
            session_id = self._get_or_create_session(db, user_id, session_id)
            
            history = self._get_chat_history(db, session_id)
            
            msg_type = self._classify_message(user_message)
            logger.info(f"메시지 분류 결과: {msg_type}")

            augmented_content = ""
            analysis_id = None

            retrieval_results = rag_service.retrieve(user_message, top_k_stage1=10, top_k_stage2=3)
            if retrieval_results:
                augmented_content = self._prepare_rag_content(retrieval_results)
                logger.info("RAG 검색 결과 적용")
            
            if not store_id and msg_type == "data_analysis":
                main_store = db.query(Store).filter(Store.user_id == user_id, Store.is_main == True).first()
                if main_store:
                    store_id = main_store.store_id
                    logger.info(f"사용자 {user_id}의 메인 매장(ID: {store_id}) 찾음")

            if msg_type == "data_analysis" and store_id:
                analysis_id = await self._get_latest_analysis_id(store_id)
                if analysis_id:
                    eda_result = await self._load_eda_result(analysis_id)
                    if eda_result:
                        eda_content = self._prepare_eda_content(eda_result, user_message)
                        if eda_content:
                            if augmented_content:
                                augmented_content += "\n\n" + eda_content
                            else:
                                augmented_content = eda_content
                            logger.info("EDA 결과 적용")
            
            messages = self._prepare_messages(history, user_message, augmented_content)
            response = await self._get_claude_response(messages)
            
            self._save_chat_history(db, session_id, user_id, user_message, response, analysis_id)
            
            db.commit()
            
            logger.info(f"사용자 {user_id}의 챗팅 처리 완료")
            return {
                "session_id": session_id,
                "bot_message": response,
                "message_type": msg_type
            }
        except Exception as e:
            db.rollback()
            logger.error(f"챗팅 처리 중 오류 발생: {str(e)}")
            raise
        finally:
            db.close()

    async def _get_latest_analysis_id(self, store_id: int) -> Optional[str]:
        """가장 최근 분석 결과의 ID 가져오기"""
        try:
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            result = analysis_results.find_one(
                {"store_id": store_id, "analysis_type": "combined_analysis"},
                sort=[("created_at", -1)]  
            )
            
            if result:
                return str(result["_id"])
            
            logger.warning(f"store_id {store_id}에 대한 분석 결과를 찾을 수 없습니다.")
            return None
        except Exception as e:
            logger.error(f"최신 분석 ID 조회 중 오류: {str(e)}")
        return None
    
    def _get_or_create_session(self, db, user_id: int, session_id: Optional[str] = None) -> str:
        """채팅 세션 조회 또는 생성"""
        try:
            current_time = datetime.now(timezone.utc)
            
            if not session_id:
                new_session = ChatSession(
                    uid=str(uuid.uuid4()),
                    user_id=user_id,
                    created_at=current_time,
                    updated_at=current_time
                )
                db.add(new_session)
                db.flush()
                logger.debug(f"새 세션 생성: {new_session.uid}")
                return new_session.uid
            
            session = db.query(ChatSession).filter(ChatSession.uid == session_id).first()
            if session:
                session.updated_at = current_time
                logger.debug(f"기존 세션 갱신: {session.uid}")
                return session.uid
            
            new_session = ChatSession(
                uid=session_id,
                user_id=user_id,
                created_at=current_time,
                updated_at=current_time
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
                max_tokens=500,
                temperature=0.1,
                system=system_message,  
                messages=user_assistant_messages  
            )
              
            text = response.content[0].text
            # text = text.replace("\\n", " ").replace("\\t", " ")
            # text = text.replace("\n", " ").replace("\t", " ")
            # text = text.replace("\n\n", "")
            return text
        except Exception as e:
            logger.error(f"Claude API 오류: {str(e)}")
            return "죄송합니다, 현재 응답을 생성하는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
    
    def _prepare_messages(self, history: List[ChatHistory], user_message: str, augmented_content: str = "") -> list:
        """Claude API 요청을 위한 메시지 준비 (RAG 또는 EDA 결과 포함)"""
        messages = [{"role": "system", "content": self.system_prompt}]
        
        for h in history:
            messages.append({"role": "user", "content": h.user_message})
            messages.append({"role": "assistant", "content": h.bot_message})
        
        if augmented_content:
            augmented_user_message = (
                f"{user_message}\n\n"
                f"---\n"
                f"{augmented_content}"
            )
            messages.append({"role": "user", "content": augmented_user_message})
        else:
            messages.append({"role": "user", "content": user_message})
        
        return messages
    
    def _save_chat_history(self, db, session_id: str, user_id: int, user_message: str, bot_message: str, 
                           analysis_id: Optional[str] = None):
        """채팅 내역 저장"""
        try:
            current_time = datetime.now(timezone.utc)
            chat_history = ChatHistory(
                session_id=session_id,
                user_id=user_id,
                user_message=user_message,
                bot_message=bot_message,
                created_at=current_time,
                updated_at=current_time
            )
            db.add(chat_history)
            db.flush()
            logger.debug(f"채팅 내역 저장 완료: 세션 {session_id}")
        except Exception as e:
            logger.error(f"채팅 내역 저장 중 오류: {str(e)}")
            raise
    
    def _classify_message(self, message: str) -> str:
        """메시지 유형 분류 (일반 또는 데이터 분석 관련)"""
        try:
            message_lower = message.lower()
            
            for keyword in self.data_keywords:
                if keyword in message_lower:
                    return "data_analysis"
            
            return "general"
        except Exception as e:
            logger.error(f"메시지 분류 중 오류: {str(e)}")
            return "general"  
    
    def _prepare_rag_content(self, retrieval_results: List[Dict]) -> str:
        """RAG 검색 결과를 Claude에 전달할 형식으로 준비"""
        try:
            if not retrieval_results:
                return ""
            
            content = "검색 결과:\n\n"
            for i, result in enumerate(retrieval_results, 1):
                content += f"{i}. 질문: {result['question']}\n"
                content += f"   답변: {result['answer']}\n\n"
            
            return content
        except Exception as e:
            logger.error(f"RAG 콘텐츠 준비 중 오류: {str(e)}")
            return ""
    
    async def _load_eda_result(self, analysis_id: str) -> Optional[Dict]:
        try:
            analysis_results = mongo_instance.get_collection("AnalysisResults")
            result = analysis_results.find_one({
                "_id": ObjectId(analysis_id),
                "analysis_type": "combined_analysis" 
            })
            
            if not result:
                logger.warning(f"ID가 {analysis_id}인 EDA 결과를 찾을 수 없습니다.")
                return None
            
            result["_id"] = str(result["_id"])
            
            if "source_ids" in result and isinstance(result["source_ids"], list):
                result["source_ids"] = [str(source_id) for source_id in result["source_ids"]]
            
            logger.info(f"EDA 결과 로드 성공: {analysis_id}")
            return result
        except Exception as e:
            logger.error(f"EDA 결과 로드 중 오류: {str(e)}")
            return None
    
    def _prepare_eda_content(self, eda_result: Dict, user_message: str) -> str:
        try:
            if "eda_result" in eda_result and "result_data" in eda_result["eda_result"]:
                actual_result_data = eda_result["eda_result"]["result_data"]
                overall_summary = eda_result["eda_result"].get("summary", "")
            elif "result_data" in eda_result:  # 이전 구조도 지원
                actual_result_data = eda_result["result_data"]
                overall_summary = eda_result.get("summary", "")
            else:
                logger.warning("EDA 결과에 result_data가 없습니다.")
                return ""
            
            keywords = self._extract_keywords_from_message(user_message)
            logger.info(f"추출된 키워드: {keywords}")
            
            content = "데이터 분석 결과:\n\n"
            
            if overall_summary:
                content += f"전체 요약:\n{overall_summary[:500]}...\n\n"
            
            if "basic_stats" in actual_result_data:
                content += "기본 통계:\n"
                content += f"{json.dumps(actual_result_data['basic_stats']['data'], ensure_ascii=False, indent=2)}\n\n"
            
            for chart_name, chart_data in actual_result_data.items():
                if chart_name == "basic_stats":
                    continue
                
                is_relevant = False
                for keyword in keywords:
                    if keyword in chart_name.lower() or self._check_relevance(keyword, chart_data):
                        is_relevant = True
                        break
                
                if is_relevant or not keywords:
                    content += f"{chart_name} 데이터:\n"
                    content += f"{json.dumps(chart_data['data'], ensure_ascii=False, indent=2)}\n"
                    
                    if "summary" in chart_data:
                        summary_extract = chart_data["summary"].split("\n")
                        content += f"요약: {' '.join(summary_extract)}\n\n"
            
            logger.info(f"EDA 컨텐츠 준비 완료: {len(content)} 바이트")
            return content
        except Exception as e:
            logger.error(f"EDA 콘텐츠 준비 중 오류: {str(e)}")
            return ""
    
    def _extract_keywords_from_message(self, message: str) -> List[str]:
        """사용자 메시지에서 관련 키워드 추출"""
        try:
            words = re.findall(r'\b\w+\b', message.lower())
            
            return [word for word in words if word in [kw.lower() for kw in self.data_keywords]]
        except Exception as e:
            logger.error(f"키워드 추출 중 오류: {str(e)}")
            return []
    
    def _check_relevance(self, keyword: str, chart_data: Dict) -> bool:
        """키워드와 차트 데이터 간의 관련성 확인"""
        try:
            data_str = json.dumps(chart_data, ensure_ascii=False).lower()
            return keyword in data_str
        except Exception as e:
            logger.error(f"관련성 확인 중 오류: {str(e)}")
            return False

chat_service = ChatService()