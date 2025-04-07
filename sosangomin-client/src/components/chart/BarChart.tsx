import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BarChartProps } from "@/types/chart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC<BarChartProps> = ({
  labels,
  datasets,
  height = 400,
  width,
  horizontal = false,
  stacked = false,
  title = "",
  xAxisLabel = "",
  yAxisLabel = "",
  legend = true,
  legendPosition = "top",
  beginAtZero = true,
  tooltips = true,
  animation = true,
  responsive = true,
  maintainAspectRatio = false,
  onClick,
  className = "",
  customOptions = {},
  unit = "",
  id = "bar-chart"
}) => {
  // 단위 설정을 위한 변수
  const unitSuffix = unit ? ` ${unit}` : "";

  // Y축 제목에 단위 추가
  const yAxisTitleWithUnit = yAxisLabel
    ? unit
      ? `${yAxisLabel} (${unit})`
      : yAxisLabel
    : "";

  // 차트 옵션 구성
  const options = {
    indexAxis: horizontal ? ("y" as const) : ("x" as const),
    responsive,
    maintainAspectRatio,
    plugins: {
      legend: {
        display: legend,
        position: legendPosition as "top" | "right" | "bottom" | "left"
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16
        }
      },
      tooltip: {
        enabled: tooltips,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label +=
                new Intl.NumberFormat("ko-KR").format(context.parsed.y) +
                unitSuffix;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        stacked,
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel
        },
        grid: {
          color: "transparent"
        }
      },
      y: {
        stacked,
        beginAtZero,
        title: {
          display: !!yAxisTitleWithUnit,
          text: yAxisTitleWithUnit,
          font: {
            size: 12
          }
        },
        grid: {
          color: "transparent"
        },
        ticks: {
          callback: function (value: number) {
            return new Intl.NumberFormat("ko-KR").format(value) + unitSuffix;
          }
        }
      }
    },
    animation: animation ? {} : false,
    onClick
  };

  // 사용자 정의 옵션 병합 (중첩 객체를 올바르게 병합)
  const mergedOptions = {
    ...options,
    ...customOptions,
    scales: {
      ...options.scales,
      ...(customOptions.scales || {}),
      // Y축 옵션을 올바르게 병합
      y: {
        ...options.scales.y,
        ...(customOptions.scales?.y || {}),
        // title과 ticks를 보존
        title: {
          ...options.scales.y.title,
          ...(customOptions.scales?.y?.title || {})
        },
        ticks: {
          ...options.scales.y.ticks,
          ...(customOptions.scales?.y?.ticks || {})
        }
      }
    },
    plugins: {
      ...options.plugins,
      ...(customOptions.plugins || {}),
      // tooltip 콜백 함수 보존
      tooltip: {
        ...options.plugins.tooltip,
        ...(customOptions.plugins?.tooltip || {}),
        callbacks: {
          ...options.plugins.tooltip.callbacks,
          ...(customOptions.plugins?.tooltip?.callbacks || {})
        }
      }
    }
  };

  // 차트 데이터 구성
  const data = {
    labels,
    datasets
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
        data-testid="bar-chart"
      >
        <Bar data={data} options={mergedOptions} />
      </div>
    </div>
  );
};

export default BarChart;
