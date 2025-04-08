// 종합분석 보고서 데이터 구조 및 API 요청/응답 타입 정의

// SWOT 분석 보고서 데이터 타입
export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  summary: string;
  recommendations: string[];
}

// 관련 분석 ID 타입
export interface RelatedAnalyses {
  review_analysis_id: string;
  combined_analysis_id: string;
  competitor_analysis_id: string;
}

// 보고서 상세 정보 타입
export interface FinalReportDetail {
  store_id: number;
  store_name: string;
  created_at: string;
  swot_analysis: SWOTAnalysis;
  full_response: string;
  related_analyses: RelatedAnalyses;
}

// 보고서 목록 항목 타입
export interface FinalReportListItem {
  report_id: string;
  store_name: string;
  created_at: string;
  summary: string;
}

// 보고서 생성 요청 타입
export interface CreateFinalReportRequest {
  store_id: string;
}

// 보고서 생성 응답 타입
export interface CreateFinalReportResponse {
  report_id: string;
  store_name: string;
  created_at: string;
  swot_analysis: SWOTAnalysis;
  full_response: string;
  related_analyses: RelatedAnalyses;
  status: string;
  message: string;
}

// 보고서 상세 조회 응답 타입
export interface GetFinalReportResponse {
  status: string;
  report: FinalReportDetail;
  message: string | null;
}

// 보고서 목록 조회 응답 타입
export interface GetFinalReportListResponse {
  status: string;
  count: number;
  reports: FinalReportListItem[];
  message: string | null;
}

// API 오류 응답 타입
export interface ErrorResponse {
  error: string;
  message: string;
}
