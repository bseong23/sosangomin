// src/features/analysis/types/analysisTypes.ts

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

// 분석 결과 데이터 전체 구조
export interface AnalysisResultData {
  result_data: {
    basic_stats: DataModule<BasicStats>;
    weekday_sales: DataModule<WeekdaySalesData>;
    hourly_sales: DataModule<HourlySalesData>;
    top_products: DataModule<TopProductsData>;
    time_period_sales: DataModule<TimePeriodSalesData>;
    holiday_sales: DataModule<HolidaySalesData>;
    season_sales: DataModule<SeasonSalesData>;
  };
  summary: string;
  analysis_id?: string;
  created_at?: string;
  status?: "success" | "pending" | "failed";
}

// 분석 항목 인터페이스
export interface AnalysisItem {
  analysis_id: string;
  created_at: string;
  store_id: number;
  status: "success" | "pending" | "failed";
  name?: string;
}

// 분석 목록 응답 인터페이스
export interface AnalysisListResponse {
  items: AnalysisItem[];
  total: number;
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
