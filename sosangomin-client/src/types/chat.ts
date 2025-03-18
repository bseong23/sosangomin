// API 요청 타입
export interface ChatRequest {
  user_id: number;
  message: string;
  session_id: string | null;
}

// API 응답 타입
export interface ChatResponse {
  session_id: string;
  bot_message: string;
}

// 에러 응답 타입
export interface ErrorResponse {
  error: string;
  message: string;
}
