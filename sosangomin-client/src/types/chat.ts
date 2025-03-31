// API 요청 타입
export interface ChatRequest {
  user_id: string;
  message: string;
  session_id: string | null;
  store_id?: number;
}

// API 응답 타입
export interface ChatResponse {
  session_id: string;
  bot_message: string;
  message_type?: string;
}

// 에러 응답 타입
export interface ErrorResponse {
  error: string;
  message: string;
}
