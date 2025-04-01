// src/features/analysis/types/analysis.ts

// API 통신 관련 타입
export interface ErrorResponse {
  error: string;
  message: string;
}

export type ApiResponse<T> = T | ErrorResponse;

// 분석 상태 관련 인터페이스 (누락되었던 타입)
export interface AnalysisState {
  data: any | null;
  isLoading: boolean;
  error: string | null;
}

// 분석 요청 매개변수 인터페이스
export interface AnalysisRequest {
  store_id: string;
  source_ids: string[];
  pos_type: string;
}

// 분석 결과 인터페이스 (API 응답 구조)
export interface AnalysisResultResponse {
  status: string;
  analysis_result: {
    _id: string;
    store_id: number;
    source_ids: string;
    analysis_type: string;
    created_at: string;
    status: string;
    eda_result: {
      result_data: {
        basic_stats: {
          data: BasicStats;
          summary: string;
        };
        weekday_sales: {
          data: WeekdaySalesData;
          summary: string;
        };
        hourly_sales: {
          data: HourlySalesData;
          summary: string;
        };
        top_products: {
          data: TopProductsData;
          summary: string;
        };
        time_period_sales: {
          data: TimePeriodSalesData;
          summary: string;
        };
        holiday_sales: {
          data: HolidaySalesData;
          summary: string;
        };
        season_sales: {
          data: SeasonSalesData;
          summary: string;
        };
        [key: string]: any; // 다른 필드도 허용
      };
      summary: string;
    };
    auto_analysis_results: {
      predict: any;
      cluster: any;
      summaries: any;
    };
  };
}

// 기본 통계 데이터 인터페이스
export interface BasicStats {
  total_sales: number;
  avg_transaction: number;
  total_transactions: number;
  unique_products: number;
  customer_avg: number;
}

// 데이터 모듈에 대한 공통 인터페이스 (데이터와 요약 포함)
export interface DataModule<T> {
  data: T;
  summary: string;
}

// 각 분석 모듈에 대한 인터페이스
export interface WeekdaySalesData {
  [key: string]: number; // 예: "Monday": 1500000
}

export interface HourlySalesData {
  [key: string]: number; // 예: "12": 1500000
}

export interface TopProductsData {
  [key: string]: number; // 예: "제품명": 1500000
}

export interface TimePeriodSalesData {
  [key: string]: number; // 예: "점심": 5000000
}

export interface HolidaySalesData {
  [key: string]: number; // 인덱스 시그니처 추가
  평일: number;
  휴일: number;
}

export interface SeasonSalesData {
  [key: string]: number; // 예: "봄": 14000000
}

// 분석 결과 데이터 전체 구조 (컴포넌트에서 사용하는 형식)
export interface AnalysisResultData {
  result_data: {
    basic_stats: DataModule<BasicStats>;
    weekday_sales: DataModule<WeekdaySalesData>;
    hourly_sales: DataModule<HourlySalesData>;
    top_products: DataModule<TopProductsData>;
    time_period_sales: DataModule<TimePeriodSalesData>;
    holiday_sales: DataModule<HolidaySalesData>;
    season_sales: DataModule<SeasonSalesData>;
    [key: string]: any; // 다른 필드도 허용
  };
  summary: string;
  analysis_id?: string;
  created_at?: string;
  status?: string;
}

// 분석 항목 인터페이스
export interface AnalysisItem {
  analysis_id: string;
  created_at: string;
  store_id: number | string;
  status: string;
}

// 분석 목록 응답 인터페이스 (API 응답 스키마)
export interface AnalysisListResponse {
  status: string;
  count: number;
  analyses?: {
    analysis_id: string;
    created_at: string;
  }[];
  analysisList?: {
    analysisId: string;
    createdAt: string;
  }[];
}

// 분석 결과 Hook 응답 타입
export interface AnalysisDataResponse {
  data: AnalysisResultData | null;
  loading: boolean;
  error: any;
}

// 범례 항목 인터페이스
export interface LegendItem {
  color: string;
  label: string;
  value: string;
}
