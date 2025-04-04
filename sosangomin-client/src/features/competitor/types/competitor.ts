// features/competitor/types/competitor.ts

export interface Review {
  text: string;
  rating: number;
  date: string;
  sentiment: "positive" | "neutral" | "negative";
  keywords: string[];
  sentiment_score: number;
  matched_sentiment_words: string[];
}

export interface AnalysisResult {
  competitor_name: string;
  place_id: string;
  reviews: Review[];
  review_count: number;
  average_rating: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  word_cloud_data: {
    positive_words: Record<string, number>;
    negative_words: Record<string, number>;
  };
  insights: string;
  analysis_time: string;
}

export interface CompetitorAnalysis {
  status: string;
  message: string;
  competitor_info: {
    store_name: string;
    address: string;
    place_id: string;
    category: string;
    phone: string;
    latitude: number;
    longitude: number;
  };
  analysis_result: AnalysisResult;
}

/**
 * 경쟁사 분석 요청 파라미터
 */
export interface CompetitorAnalysisRequest {
  store_id: string;
  competitor_name: string;
}

/**
 * 경쟁사 분석 응답
 */
export interface CompetitorAnalysisResponse {
  status: string;
  message: string;
  /** 경쟁사 분석 데이터 */
  competitor_analysis?: CompetitorAnalysis;
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
  store_id: string | number;
  competitor_name: string;
  competitor_place_id?: string;
  comparison_data: ComparisonData;
  comparison_insight: string;
  summary?: string;
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
  name?: string;
  review_count: number;
  average_rating: number;
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  positive_rate: number;
  sample_reviews: string[];
  reviews?: Review[];
  category_insights?: Record<string, any>;
}

/**
 * 워드 클라우드 비교 데이터
 */
export interface WordCloudComparisonData {
  my_store: WordCloudData;
  competitor: WordCloudData;
}

/**
 * 워드 클라우드 데이터
 */
export interface WordCloudData {
  positive_words: Record<string, number>;
  negative_words: Record<string, number>;
}

/**
 * 경쟁사 비교 목록 응답
 */
export interface CompetitorComparisonListResponse {
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
  comparison_id: string;
  competitor_name: string;
  competitor_place_id: string;
  created_at: string;
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
