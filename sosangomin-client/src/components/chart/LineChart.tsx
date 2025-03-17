// src/components/LineChart.tsx

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { LineChartProps } from "@/types/chart";

// Chart.js에 필요한 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * LineChart 컴포넌트
 *
 * @component
 * @example
 * // 기본 사용법
 * const labels = ["월요일", "화요일", "수요일", "목요일", "금요일"];
 * const datasets = [
 *   {
 *     label: "일일 매출",
 *     data: [120, 145, 138, 156, 210],
 *     borderColor: "rgb(255, 99, 132)",
 *     backgroundColor: "rgba(255, 99, 132, 0.5)",
 *     tension: 0.3  // 선의 곡률 (0: 직선, 1: 최대 곡률)
 *   }
 * ];
 *
 * <LineChart
 *   title="매출 현황"
 *   labels={labels}
 *   datasets={datasets}
 *   yAxisTitle="금액 (만원)"
 * />
 *
 * @param {Object} props
 * @param {string} [props.title="Line Chart"] - 차트 상단에 표시될 제목
 * @param {string[]} props.labels - X축에 표시될 레이블 배열
 * @param {Object[]} props.datasets - 차트에 표시될 데이터셋 배열
 * @param {string} props.datasets[].label - 데이터셋 이름
 * @param {number[]} props.datasets[].data - 데이터 포인트 배열
 * @param {string} props.datasets[].borderColor - 선 색상
 * @param {string} props.datasets[].backgroundColor - 영역 채우기 색상
 * @param {number} [props.datasets[].tension] - 선의 곡률 (0-1)
 * @param {string} [props.yAxisTitle] - Y축 제목
 * @returns {JSX.Element} 라인 차트 컴포넌트
 */
const LineChart: React.FC<LineChartProps> = ({
  title = "Line Chart",
  labels,
  datasets,
  yAxisTitle
}) => {
  // 차트 옵션 설정
  const options = {
    responsive: true, // 반응형 차트 설정
    plugins: {
      legend: {
        position: "top" as const // 범례 위치
      },
      title: {
        display: !!title, // title이 있을 경우에만 표시
        text: title
      }
    },
    scales: {
      y: {
        beginAtZero: true, // Y축 0부터 시작
        title: {
          display: !!yAxisTitle, // yAxisTitle이 있을 경우에만 표시
          text: yAxisTitle
        }
      }
    }
  };

  // 차트 데이터 구성
  const data = {
    labels,
    datasets
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
