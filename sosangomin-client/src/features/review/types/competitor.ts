// features/competitor/types/competitor.ts

/**
 * 경쟁사 분석 요청 타입
 */
export interface CompetitorAnalysisRequest {
  store_id: number; // 내 매장 ID
  competitor_name: string; // 경쟁사 이름
}

/**
 * 경쟁사 분석 응답 타입
 */
export interface CompetitorAnalysisResponse {
  status: string; // success
  message: string; // 분석 완료 메시지
  competitorAnalysis: any; // 경쟁사 분석 (미사용 가능성 높음)
  comparisonResult: CompetitorComparisonResult; // 비교 분석 결과
}

/**
 * 비교 분석 결과
 */
export interface CompetitorComparisonResult {
  _id: string;
  store_id: number;
  competitor_name: string;
  comparison_data: ComparisonData;
}

/**
 * 실제 비교 데이터
 */
export interface ComparisonData {
  my_store: StoreData;
  competitor: StoreData;
  word_cloud_comparison: WordCloudComparisonData;
  comparison_insight?: string; // 인사이트 요약 텍스트
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
}

/**
 * 워드 클라우드 데이터
 */
export interface WordCloudComparisonData {
  my_store: WordCloudData;
  competitor: WordCloudData;
}

/**
 * 워드 클라우드 단어 데이터
 */
export interface WordCloudData {
  positive_words: Record<string, number>;
  negative_words: Record<string, number>;
}
