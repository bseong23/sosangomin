import React from "react";
import { MixedChartProps } from "@/types/chart";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title,
  ChartOptions,
  Scale
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Chart.js 필요한 컴포넌트 등록
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  Title
);

const MixedChart: React.FC<MixedChartProps> = ({
  labels,
  datasets,
  height = 400,
  width,
  title = "",
  xAxisLabel = "",
  yAxisLabel = "업소 수",
  legend = true,
  legendPosition = "top",
  gridLines = true,
  beginAtZero = true,
  tooltips = true,
  animation = true,
  responsive = true,
  maintainAspectRatio = false,
  stacked = false,
  onClick,
  className = "",
  id = "mixed-chart",
  rightYAxisLabel = "비율 (%)",
  leftMin = 0,
  rightMin = 50
}) => {
  // 데이터셋에 yAxisID 추가
  const processedDatasets = datasets.map((dataset) => {
    // bar 타입은 왼쪽 y축(y), line 타입은 오른쪽 y축(y1)에 할당
    const yAxisID = dataset.type === "bar" ? "y" : "y1";

    // 바 차트에만 너비 조절 옵션 추가
    if (dataset.type === "bar") {
      return {
        ...dataset,
        yAxisID,
        barThickness: 100,
        maxBarThickness: 100,
        categoryPercentage: 0.8,
        barPercentage: 0.5
      };
    }

    // 선 그래프에는 yAxisID만 추가
    return {
      ...dataset,
      yAxisID
    };
  });

  const data = {
    labels,
    datasets: processedDatasets
  };

  // 타입스크립트 에러 해결을 위한 옵션 타입 캐스팅
  const options: ChartOptions<"bar" | "line"> = {
    responsive,
    maintainAspectRatio,
    plugins: {
      legend: {
        display: legend,
        position: legendPosition,
        labels: {
          usePointStyle: true,
          padding: 15
        }
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: "bold" }
      },
      tooltip: {
        enabled: tooltips,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }

            const value = context.parsed.y;
            if (value !== null) {
              // bar 타입(업소수)는 정수로, line 타입(비율)은 소수점 첫째 자리까지 표시
              if (context.dataset.type === "bar") {
                label += value.toLocaleString() + "개";
              } else {
                label += value.toFixed(1) + "%";
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: { size: 12 }
        },
        grid: { display: false },
        stacked,
        ticks: {
          font: { size: 12 },
          // 타입 시그니처 수정 - Chart.js 기대하는 형식으로 변경
          callback: function (
            this: Scale,
            _value: string | number,
            index: number
          ) {
            const label = labels[index];
            if (typeof label === "string" && label.includes(" ")) {
              return label.split(" ");
            }
            return label;
          }
        }
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero,
        min: leftMin,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: { size: 12 }
        },
        grid: { display: gridLines, drawOnChartArea: true },
        ticks: {
          font: { size: 12 },
          // 타입 시그니처 수정
          callback: function (this: Scale, tickValue: string | number) {
            const value =
              typeof tickValue === "string" ? parseFloat(tickValue) : tickValue;
            return value + "개";
          }
        },
        stacked
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        beginAtZero: false,
        min: rightMin,
        max: 100,
        title: {
          display: !!rightYAxisLabel,
          text: rightYAxisLabel,
          font: { size: 12 }
        },
        grid: {
          display: false,
          drawOnChartArea: false
        },
        ticks: {
          font: { size: 12 },
          // 타입 시그니처 수정
          callback: function (this: Scale, tickValue: string | number) {
            const value =
              typeof tickValue === "string" ? parseFloat(tickValue) : tickValue;
            return value + "%";
          }
        }
      }
    },
    animation: animation ? { duration: 1000 } : { duration: 0 },
    onClick
  };

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div
        id={id}
        className="chart-container w-full"
        style={{
          height: `${height}px`,
          width: width ? `${width}px` : "100%",
          position: "relative"
        }}
        data-testid="mixed-chart"
      >
        <Chart type="bar" data={data} options={options} />
      </div>
    </div>
  );
};

export default MixedChart;
