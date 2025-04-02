// features/competitor/types/competitor.ts

/**
 * 경쟁사 분석 요청 파라미터
 */
export interface CompetitorAnalysisRequest {
  /** 내 매장 ID (string 형식) */
  store_id: string;
  /** 경쟁사 이름 */
  competitor_name: string;
}

/**
 * 경쟁사 분석 응답
 */
export interface CompetitorAnalysisResponse {
  /** 성공 여부 */
  status: string;
  /** 응답 메시지 */
  message: string;
  /** 경쟁사 분석 데이터 */
  competitor_analysis?: any;
  /** 비교 분석 결과 */
  comparisonResult: CompetitorComparisonResult;
}

/**
 * 경쟁사 비교 결과
 */
export interface CompetitorComparisonResult {
  /** 비교 분석 ID */
  _id: string;
  /** 비교 분석 ID (클라이언트용) */
  comparison_id: string;
  /** 매장 ID */
  store_id: string | number;
  /** 경쟁사 이름 */
  competitor_name: string;
  /** 경쟁사 장소 ID */
  competitor_place_id?: string;
  /** 비교 분석 데이터 */
  comparison_data: ComparisonData;
  /** 분석 인사이트 요약 */
  comparison_insight: string;
  /** 인사이트 */
  summary?: string;
  /** 생성 시간 */
  created_at: string;
}

/**
 * 비교 분석 데이터
 */
export interface ComparisonData {
  my_store: StoreData;
  competitor: StoreData;
  comparison_insight: string;
  word_cloud_comparison: {
    my_store: {
      positive_words: Record<string, number>;
      negative_words: Record<string, number>;
    };
    competitor: {
      positive_words: Record<string, number>;
      negative_words: Record<string, number>;
    };
  };
}

/**
 * 매장 정보
 */
export interface StoreData {
  /** 매장 이름 */
  name?: string;
  /** 리뷰 수 */
  review_count: number;
  /** 평균 평점 */
  average_rating: number;
  /** 감정 분석 분포 */
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  /** 긍정 리뷰 비율 */
  positive_rate: number;
  /** 샘플 리뷰 */
  sample_reviews: string[];
  /** 카테고리 인사이트 */
  category_insights?: Record<string, any>;
}

/**
 * 워드 클라우드 비교 데이터
 */
export interface WordCloudComparisonData {
  /** 내 매장 워드 클라우드 */
  my_store: WordCloudData;
  /** 경쟁사 워드 클라우드 */
  competitor: WordCloudData;
}

/**
 * 워드 클라우드 데이터
 */
export interface WordCloudData {
  /** 긍정 단어 목록 */
  positive_words: Record<string, number>;
  /** 부정 단어 목록 */
  negative_words: Record<string, number>;
}

/**
 * 경쟁사 비교 목록 응답
 */
export interface CompetitorComparisonListResponse {
  /** 성공 여부 */
  status: string;
  /** 비교 분석 수 */
  count: number;
  /** 비교 분석 목록 */
  comparisons: CompetitorComparisonSummary[];
}

/**
 * 경쟁사 비교 요약
 */
export interface CompetitorComparisonSummary {
  /** 비교 분석 ID */
  comparison_id: string;
  /** 경쟁사 이름 */
  competitor_name: string;
  /** 경쟁사 장소 ID */
  competitor_place_id: string;
  /** 생성 시간 */
  created_at: string;
  /** 인사이트 요약 */
  summary: string;
}

/**
 * 경쟁사 비교 상세 결과 응답
 */
export interface CompetitorComparisonResultResponse {
  /** 성공 여부 */
  status: string;
  /** 비교 분석 결과 */
  comparison_result: CompetitorComparisonResult;
}
