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
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
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
