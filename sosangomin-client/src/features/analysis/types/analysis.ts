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
  analysis_result?: any;
}

export interface DataRange {
  start_month: string; // "YYYY-MM" 형식
  end_month: string; // "YYYY-MM" 형식
}

export interface AutoAnalysisResults {
  predict?: {
    total_sales?: number;
    predictions_30?: Record<string, number>; // 날짜별 매출 예측
  };
  cluster?: { [key: string]: string[] }; // 예: cluster0: ["공기밥"]
  summaries?: {
    predict_summary?: {
      summary?: string;
      sales_pattern?: string;
      weekend_effect?: string;
      comparison_with_last_month?: string;
      recommendation?: string;
    };
    cluster_summary?: {
      summary?: string;
      group_insight?: string;
      group_characteristics?: Array<{
        group_id: string | number;
        group_name: string;
        description: string;
        representative_items?: string[];
      }>;
      recommendation?: string;
    };
    [key: string]: any;
  };
}

// 분석 결과 인터페이스 (API 응답 구조)
export interface AnalysisResultResponse {
  status: string;
  result_data: {
    _id: string;
    store_id: number;
    source_ids: string | string[];
    analysis_type: string;
    data_range: DataRange;
    created_at: string;
    status: string;
    eda_result: {
      result_data: {
        basic_stats: DataModule<BasicStats>;
        weekday_sales: DataModule<WeekdaySalesData>;
        hourly_sales: DataModule<HourlySalesData>;
        top_products: DataModule<TopProductsData>;
        time_period_sales: DataModule<TimePeriodSalesData>;
        holiday_sales: DataModule<HolidaySalesData>;
        season_sales: DataModule<SeasonSalesData>;
        weather_sales?: DataModule<WeatherSalesData>;
        temperature_sales?: DataModule<TemperatureSalesData>;
        product_share?: DataModule<ProductShareData>;
        [key: string]: any;
      };
      summary: string;
    };
    auto_analysis_results: AutoAnalysisResults; // 수정된 타입 적용
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
  [key: string]: number; // 예: "평일": 5000000, "공휴일": 7000000
}

export interface SeasonSalesData {
  [key: string]: number; // 예: "봄": 14000000
}

export interface WeatherSalesData {
  [key: string]: number; // 예: "맑음": 8000000, "비": 4000000
}

export interface TemperatureSalesData {
  [key: string]: number; // 예: "0~10℃": 5000000, "10~20℃": 8000000
}

export interface ProductShareData {
  [key: string]: number; // 예: "제품군A": 45.5, "제품군B": 32.8 (%)
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
    weather_sales?: DataModule<WeatherSalesData>;
    temperature_sales?: DataModule<TemperatureSalesData>;
    product_share?: DataModule<ProductShareData>;
    [key: string]: any; // 다른 필드도 허용
  };
  summary: string;
  analysis_id?: string;
  created_at?: string;
  status?: string;
  data_range?: DataRange;
  auto_analysis_results?: AutoAnalysisResults; // 자동 분석 결과 타입 추가
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
