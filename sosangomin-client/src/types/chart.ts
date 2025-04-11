// 데이터 타입 정의
export interface PieChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
}

export interface DoughnutChartProps {
  chartData: {
    labels: string[];
    datasets: {
      label?: string; // 선택적으로 변경
      data: number[];
      backgroundColor: string[];
      borderColor?: string[]; // 선택적으로 변경
      borderWidth: number;
    }[];
  };
}

export interface LineChartProps {
  /** 차트 상단에 표시될 제목 */
  title?: string;

  /** X축에 표시될 레이블 배열 */
  labels: string[];

  /** 차트에 표시될 데이터셋 배열 */
  datasets: {
    /** 데이터셋 이름 */
    label: string;

    /** 데이터 포인트 배열 */
    data: number[];

    /** 선 색상 */
    borderColor: string;

    /** 영역 채우기 색상 */
    backgroundColor: string;

    /** 선의 곡률 (0: 직선, 1: 최대 곡률) */
    tension?: number;

    /** 점 반경 */
    pointRadius?: number;

    /** 호버 시 점 반경 */
    pointHoverRadius?: number;

    /** 선 두께 */
    borderWidth?: number;

    /** 선 아래 영역 채우기 여부 */
    fill?: boolean;
  }[];

  /** Y축 제목 */
  yAxisTitle?: string;
}

export interface MixedChartDataset {
  type: "line" | "bar"; // 차트 유형 (선 또는 막대)
  label: string; // 데이터셋 레이블
  data: number[]; // 데이터 배열
  backgroundColor?: string | string[]; // 배경색
  borderColor?: string | string[]; // 테두리 색상
  borderWidth?: number; // 테두리 두께
  fill?: boolean; // 선 그래프 영역 채우기 여부
  tension?: number; // 선 그래프 곡선 정도 (0: 직선, 1: 최대 곡선)
  pointBackgroundColor?: string | string[]; // 포인트 배경색
  pointBorderColor?: string | string[]; // 포인트 테두리 색상
  pointRadius?: number; // 포인트 반지름
  pointHoverRadius?: number; // 마우스 오버 시 포인트 반지름
  yAxisID?: string; // Y축 ID (다중 Y축 사용 시)
  stack?: string; // 스택 그룹 ID (막대 누적 시)
  order?: number; // 그리기 순서 (낮은 값이 먼저 그려짐)
  barPercentage?: number; // 막대 너비 비율 (0~1)
  categoryPercentage?: number; // 카테고리 너비 비율 (0~1)
  borderRadius?: number; // 막대 모서리 둥근 정도
  hoverBackgroundColor?: string | string[]; // 마우스 오버 시 배경색
  hoverBorderColor?: string | string[]; // 마우스 오버 시 테두리 색상
  hoverBorderWidth?: number; // 마우스 오버 시 테두리 두께
}

// MixedChart 컴포넌트 Props 타입 정의
export interface MixedChartProps {
  labels: string[];
  datasets: MixedChartDataset[];
  height?: number;
  width?: number;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legend?: boolean;
  legendPosition?: "top" | "right" | "bottom" | "left";
  gridLines?: boolean;
  beginAtZero?: boolean;
  tooltips?: boolean;
  animation?: boolean;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  stacked?: boolean;
  onClick?: (event: any, elements: any) => void;
  className?: string;
  id?: string;
  multiAxis?: boolean;
  rightYAxisLabel?: string;
  leftMin?: number; // 추가: 왼쪽 y축 최소값
  rightMin?: number; // 추가: 오른쪽 y축 최소값
}

// 기본 차트 데이터 타입
export interface ChartData {
  labels: string[];
  datasets: MixedChartDataset[];
}

// 차트 옵션 타입 (기본적인 공통 옵션만 정의)
export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: "top" | "right" | "bottom" | "left";
    };
    title?: {
      display?: boolean;
      text?: string;
      font?: {
        size?: number;
      };
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: any;
    y?: any;
    y1?: any;
  };
  animation?: boolean | { duration: number };
  onClick?: (event: any, elements: any) => void;
}

// BarChart 데이터셋 타입 정의
export interface BarChartDataset {
  label: string; // 데이터셋 이름 (범례에 표시)
  data: number[]; // 실제 데이터 값 배열
  backgroundColor?: string | string[]; // 막대 배경색 (단일 색상 또는 배열)
  borderColor?: string | string[]; // 막대 테두리 색상
  borderWidth?: number; // 테두리 두께 (픽셀)
  borderRadius?: number; // 막대 모서리 둥근 정도
  hoverBackgroundColor?: string | string[]; // 마우스 오버 시 배경색
  hoverBorderColor?: string | string[]; // 마우스 오버 시 테두리 색상
  hoverBorderWidth?: number; // 마우스 오버 시 테두리 두께
  barPercentage?: number; // 막대 너비 비율 (0~1)
  categoryPercentage?: number; // 카테고리 너비 비율 (0~1)
  options?: any;
}

// BarChart 컴포넌트 Props 타입 정의
export interface BarChartProps {
  // 필수 속성
  labels: string[]; // X축 레이블 배열 (요일, 카테고리 등)
  datasets: BarChartDataset[]; // 차트 데이터셋 배열

  // 선택적 속성
  customOptions?: any; // 차트.js의 추가 옵션을 위한 객체
  height?: number; // 차트 높이 (픽셀)
  width?: number; // 차트 너비 (픽셀), 미지정 시 컨테이너 너비
  horizontal?: boolean; // true면 수평 막대, false면 수직 막대
  stacked?: boolean; // true면 데이터셋 누적 표시
  title?: string; // 차트 상단 제목
  xAxisLabel?: string; // X축 레이블
  yAxisLabel?: string; // Y축 레이블
  legend?: boolean; // 범례 표시 여부
  legendPosition?: "top" | "right" | "bottom" | "left"; // 범례 위치
  gridLines?: boolean; // 그리드 라인 표시 여부
  beginAtZero?: boolean; // Y축 0부터 시작 여부
  tooltips?: boolean; // 툴팁 표시 여부
  animation?: boolean; // 애니메이션 효과 여부
  responsive?: boolean; // 반응형 디자인 여부
  maintainAspectRatio?: boolean; // 종횡비 유지 여부
  onClick?: (event: any, elements: any) => void; // 클릭 이벤트 핸들러
  className?: string; // 추가 CSS 클래스
  id?: string; // 차트 HTML ID
  unit?: string;
}
