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

// 타입 정의
interface LineChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
    pointRadius?: number;
    pointHoverRadius?: number;
    borderWidth?: number;
    fill?: boolean;
  }[];
  yAxisTitle?: string;
}

/**
 * 재사용 가능한 라인 차트 컴포넌트
 */
const LineChart: React.FC<LineChartProps> = ({
  title = "",
  labels,
  datasets,
  yAxisTitle
}) => {
  // 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12
          },
          boxWidth: 15,
          padding: 15
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: "bold" as const
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label +=
                new Intl.NumberFormat("ko-KR").format(context.parsed.y) + "원";
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        },
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        }
      },
      y: {
        // beginAtZero: true, // 이 줄 제거
        // min 속성 제거
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function (value: number) {
            return new Intl.NumberFormat("ko-KR").format(value) + "원";
          }
        },
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle,
          font: {
            size: 13
          },
          padding: {
            bottom: 10
          }
        }
      }
    },
    interaction: {
      mode: "index" as const,
      intersect: false
    },
    animation: {
      duration: 1000
    }
  };

  // 차트 데이터
  const data = {
    labels,
    datasets
  };

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
      <Line
        // @ts-ignore
        options={options}
        // @ts-ignore
        data={data}
      />
    </div>
  );
};

export default LineChart;
