import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { PieChartProps } from "@/types/chart";
// Chart.js 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({ chartData }) => {
  // 차트 옵션 설정
  const options: ChartOptions<"pie"> = {
    responsive: true, // 창 크기에 따라 그래프 크기 조절
    plugins: {
      legend: {
        position: "top" // 색깔 위치치
      }
    }
  };

  return (
    <div className="chart-container">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
