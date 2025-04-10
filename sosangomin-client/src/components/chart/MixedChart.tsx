import React, { useMemo } from "react"; // useMemo 추가
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
  rightMin // 오른쪽 Y축 최소값 추가
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
  const barDatasets = useMemo(() => {
    return datasets.filter((dataset) => dataset.type === "bar");
  }, [datasets]);

  const leftYAxisRange = useMemo(() => {
    const allBarValues = barDatasets.flatMap((dataset) => dataset.data);

    if (allBarValues.length === 0) {
      return { min: 0, max: 10 };
    }

    const maxValue = Math.max(...allBarValues);

    let roundedMax = 10;

    if (maxValue < 100) {
      // 1의 자리에서 올림
      roundedMax = Math.ceil(maxValue / 1) * 1;
    } else if (maxValue < 1000) {
      // 10의 자리에서 올림
      roundedMax = Math.ceil(maxValue / 10) * 10;
    } else {
      // 100의 자리에서 올림
      roundedMax = Math.ceil(maxValue / 100) * 100;
    }

    return {
      min: 0,
      max: roundedMax
    };
  }, [barDatasets]);

  // 선 그래프 데이터만 필터링
  const lineDatasets = useMemo(() => {
    return datasets.filter((dataset) => dataset.type === "line");
  }, [datasets]);

  // 선 그래프 데이터의 최소값과 최대값 계산
  const { minValue, maxValue } = useMemo(() => {
    // 모든 선 그래프 데이터를 하나의 배열로 합치기
    const allLineValues = lineDatasets.flatMap((dataset) => dataset.data);

    if (allLineValues.length === 0) {
      return { minValue: 0, maxValue: 100 }; // 기본값
    }

    const min = Math.min(...allLineValues);
    const max = Math.max(...allLineValues);

    return { minValue: min, maxValue: max };
  }, [lineDatasets]);

  // Y축 범위 동적 계산 (최소값에서 -5%, 최대값에서 +5%)
  const yAxisRange = useMemo(() => {
    // 데이터 범위
    const range = maxValue - minValue;

    // 사용자 지정 최소값이 있으면 사용
    const calculatedMin =
      rightMin !== undefined
        ? rightMin
        : Math.max(0, Math.floor(minValue - range * 0.05));

    // 범위가 너무 작은 경우 (10% 미만)
    if (range < 10) {
      // 최소 범위를 확보
      const buffer = Math.max(5, 10 - range);
      return {
        min: calculatedMin,
        max: Math.ceil(maxValue + buffer)
      };
    } else {
      // 정상적인 경우: 최소값에서 -5%, 최대값에서 +5%
      const buffer = range * 0.05;
      return {
        min: calculatedMin,
        max: Math.ceil(maxValue + buffer)
      };
    }
  }, [minValue, maxValue, rightMin]);

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
        min: leftMin, // ← 수정
        max: leftYAxisRange.max, // ← 수정
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: { size: 12 }
        },
        grid: { display: false, drawOnChartArea: true },
        ticks: {
          font: { size: 12 },
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
        display: lineDatasets.length > 0, // 선 그래프가 있을 때만 표시
        position: "right",
        beginAtZero: false,
        min: yAxisRange.min, // 동적으로 계산된 최소값
        max: yAxisRange.max, // 동적으로 계산된 최대값
        title: {
          display: !!rightYAxisLabel && lineDatasets.length > 0,
          text: rightYAxisLabel,
          font: { size: 12 }
        },
        grid: {
          display: false,
          drawOnChartArea: false
        },
        ticks: {
          font: { size: 12 },
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
