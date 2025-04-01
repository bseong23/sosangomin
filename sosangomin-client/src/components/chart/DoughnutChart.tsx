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

const DoughnutChart: React.FC<
  DoughnutChartProps & { legendPosition?: "top" | "bottom" | "left" | "right" }
> = ({ chartData, legendPosition = "top" }) => {
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        position: legendPosition // 동적 설정
      },
      title: {
        display: false
      }
    },
    cutout: "50%"
  };

  return (
    <div className="chart-container">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
