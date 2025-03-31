// features/review/types/Review.ts

/**
 * API 관련 인터페이스
 */

/**
 * API 응답 인터페이스 (성공 또는 에러)
 */
export type ApiResponse<T> = T | ErrorResponse;

/**
 * 에러 응답 인터페이스
 */
export interface ErrorResponse {
  /** 에러 메시지 */
  error: string;
  /** 에러 코드 */
  message: string;
}

/**
 * 리뷰 분석 요청 파라미터 인터페이스
 */
export interface ReviewAnalysisRequest {
  /** 매장 ID */
  store_id: number;
  /** 장소 ID (네이버/구글 등의 플랫폼에서의 ID) */
  place_id: string;
}

/**
 * 리뷰 분석 결과 인터페이스
 */
export interface ReviewAnalysisResult {
  /** 분석 결과 ID */
  analysis_id: string;
  /** 매장 ID */
  store_id: number;
  /** 매장 이름 */
  store_name: string;
  /** 분석 상태 (success, pending, failed 등) */
  status: string;
  /** 리뷰 개수 */
  review_count: number;
  /** 평균 평점 */
  average_rating: number;
  /** 감정 분석 분포 데이터 */
  sentiment_distribution: {
    positive?: number;
    neutral?: number;
    negative?: number;
    [key: string]: number | undefined;
  };
  /** 인사이트 데이터 (차트 데이터, 추천 사항 등) */
  insights: {
    category_data?: any;
    keyword_data?: any;
    positive_sentiment_words?: any;
    satisfaction_points?: string[];
    improvement_points?: string[];
    recommendations?: string[];
    sales_trend?: {
      labels: string[];
      datasets: any[];
    };
    sales_insights?: string[];
    [key: string]: any;
  };
  /** 워드 클라우드 데이터 */
  word_cloud_data: {
    positive_words: Record<string, number>;
    negative_words: Record<string, number>;
    [key: string]: any;
  };
  /** 분석 완료 시간 */
  completed_at: string;
  /** 분석 요청 시간 */
  created_at: string;
}

/**
 * 리뷰 분석 요약 인터페이스
 */
export interface ReviewAnalysisSummary {
  /** 분석 결과 ID */
  analysis_id: string;
  /** 분석 상태 */
  status: string;
  /** 리뷰 개수 */
  review_count: number;
  /** 평균 평점 */
  average_rating: number;
  /** 긍정 리뷰 비율 */
  positive_percentage: number;
  /** 상위 키워드 (콤마로 구분된 문자열) */
  top_keywords: string;
  /** 분석 요청 시간 */
  created_at: string;
}

/**
 * 매장 리뷰 분석 목록 인터페이스
 */
export interface StoreReviewAnalyses {
  /** 매장 ID */
  store_id: number;
  /** 매장 이름 */
  store_name: string;
  /** 총 분석 결과 수 */
  total_count: number;
  /** 리뷰 분석 요약 목록 */
  reviews_analyses: ReviewAnalysisSummary[];
}

/**
 * 컴포넌트 인터페이스
 */

/**
 * ReviewDashBoard 컴포넌트 props 인터페이스
 */
export interface ReviewDashBoardProps {
  /** 분석 데이터 */
  analysisData?: ReviewAnalysisResult;
  /** 분석 요청 함수 */
  onRequestAnalysis?: () => void;
}

/**
 * 차트 데이터 인터페이스
 */
export interface ChartData {
  /** 라벨 목록 */
  labels: string[];
  /** 데이터셋 배열 */
  datasets: Array<{
    /** 데이터셋 라벨 */
    label: string;
    /** 데이터 값 배열 */
    data: number[];
    /** 배경색 */
    backgroundColor: string | string[];
    /** 테두리색 */
    borderColor: string | string[];
    /** 테두리 두께 */
    borderWidth: number;
  }>;
}

/**
 * WordCloud 컴포넌트 props 인터페이스
 */
export interface WordCloudProps {
  /** 단어와 빈도수 매핑 */
  words: Record<string, number>;
  /** 워드 클라우드 제목 */
  title?: string;
  /** 색상 설정 */
  colors?: {
    /** 주 색상 */
    primary: string;
    /** 보조 색상 */
    secondary: string;
  };
  /** 최대 표시 단어 수 */
  maxWords?: number;
  /** 높이 CSS 클래스 */
  height?: string;
}

/**
 * 단어 위치 정보 인터페이스
 */
export interface WordPosition {
  /** X 좌표 (%) */
  x: number;
  /** Y 좌표 (%) */
  y: number;
  /** 폰트 크기 (px) */
  fontSize: number;
  /** 불투명도 (0-1) */
  opacity: number;
  /** 애니메이션 지연 시간 (초) */
  delay: number;
}

/**
 * 오류 메시지 컴포넌트 props 인터페이스
 */
export interface ErrorMessageProps {
  /** 오류 메시지 */
  message: string;
  /** 액션 버튼 라벨 (선택사항) */
  actionLabel?: string;
  /** 액션 버튼 클릭 핸들러 (선택사항) */
  onAction?: () => void;
  /** 추가 CSS 클래스 (선택사항) */
  className?: string;
}
