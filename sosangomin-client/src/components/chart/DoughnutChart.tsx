import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { DoughnutChartProps } from "@/types/chart";
// Chart.js 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC<DoughnutChartProps> = ({ chartData }) => {
  // 차트 옵션 설정
  const options: ChartOptions<"doughnut"> = {
    // "Doughnut"에서 "doughnut"으로 수정 (소문자)
    responsive: true, // 창 크기에 따라 그래프 크기 조절
    plugins: {
      legend: {
        position: "top" // 범례 위치
      },
      title: {
        display: true
      }
    },
    cutout: "50%" // 도넛 차트의 중앙 구멍 크기 설정 (기본값은 '50%')
  };

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
