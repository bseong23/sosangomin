// src/components/chart/LineChart.tsx

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }[];
  yAxisTitle?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  title = "Line Chart",
  labels,
  datasets,
  yAxisTitle
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: !!title,
        text: title
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle
        }
      }
    }
  };

  const data = {
    labels,
    datasets
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
