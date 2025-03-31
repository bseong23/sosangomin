// features/analysis/types/analysis.ts

// 분석 요청 매개변수 타입
export interface AnalysisRequest {
  store_id: number;
  source_ids: string[];
  pos_type: string;
}

// 분석 결과 타입
export interface AnalysisResult {
  analysis_id: string;
  store_id: number;
  status: "success" | "pending" | "failed";
  analysis_type: string;
  created_at: string;
  completed_at: string;
  data: Record<string, any>;
  eda_result: Record<string, any>;
  auto_analysis_results: Record<string, any>;
  summaries: Record<string, any>;
}

// 에러 응답 타입
export interface ErrorResponse {
  error: string;
  message: string;
}

// 분석 상태 타입 (hooks에서 사용)
export interface AnalysisState {
  data: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

// API 응답을 나타내는 유니온 타입
export type ApiResponse<T> = T | ErrorResponse;
