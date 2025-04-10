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

// 타입 정의
interface LineChartProps {
  title?: string;
  labels?: string[];
  datasets?: {
    label?: string;
    data?: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
    pointRadius?: number;
    pointHoverRadius?: number;
    borderWidth?: number;
    fill?: boolean;
  }[];
  yAxisTitle?: string;
  legend?: boolean;
  unit?: "원" | "개" | "%";
  referenceYear?: string;
  customOptions?: any; // 커스텀 옵션 프로퍼티 추가
}

const LineChart: React.FC<LineChartProps> = ({
  title = "",
  labels = [],
  datasets = [],
  yAxisTitle,
  legend,
  unit = "원",
  referenceYear = "",
  customOptions = {} // 커스텀 옵션 기본값 추가
}) => {
  // 기본 차트 옵션
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: legend,
        labels: {
          font: { size: 12 }
        }
      },
      title: {
        display: !!title || !!referenceYear,
        text: () => {
          const titleText = title ? [title] : [];
          if (referenceYear) titleText.push(`기준시점: ${referenceYear}`);
          return titleText;
        },
        font: {
          size: 16,
          weight: "bold" as const
        },
        align: "end" as const,
        position: "top",
        color: (ctx: any) => (ctx.titleIndex === 0 ? "#000000" : "#4B5563")
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 10,
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || "";
            if (label) label += ": ";
            if (context.parsed.y !== null) {
              label +=
                new Intl.NumberFormat("ko-KR").format(context.parsed.y) + unit;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        offset: true, // 👈 이 부분 추가,
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false
        },
        ticks: {
          font: { size: 12 },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
          callback: (index: number) => {
            const label = labels?.[index] || "";
            return label.includes(" ") ? label.split(" ") : label;
          }
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
          drawOnChartArea: false,
          drawTicks: false
        },
        ticks: {
          font: { size: 12 },
          callback: (value: number) =>
            new Intl.NumberFormat("ko-KR").format(value) + unit
        },
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle,
          font: { size: 13 },
          padding: { bottom: 10 }
        }
      }
    },
    interaction: { mode: "index" as const, intersect: false },
    animation: { duration: 1000 }
  };

  // 기본 옵션과 커스텀 옵션 병합
  const mergedOptions = {
    ...defaultOptions,
    ...customOptions
  };

  // 차트 데이터
  const data = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data || [],
      borderColor: dataset.borderColor || "#4BC0C0",
      backgroundColor: dataset.backgroundColor || "rgba(75, 192, 192, 0.5)"
    }))
  };

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
      <Line options={mergedOptions} data={data} />
    </div>
  );
};

export default LineChart;
