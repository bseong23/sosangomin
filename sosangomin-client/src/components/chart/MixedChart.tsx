import React from "react";
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
  Title
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { MixedChartProps } from "@/types/chart"; // 분리된 타입 임포트

// Chart.js 필요한 컴포넌트 등록
ChartJS.register(
  LinearScale, // Y축 선형 스케일
  CategoryScale, // X축 카테고리 스케일
  BarElement, // 막대 차트 요소
  PointElement, // 선 그래프의 데이터 포인트
  LineElement, // 선 그래프의 선
  Legend, // 범례
  Tooltip, // 툴팁
  LineController, // 선 그래프 컨트롤러
  BarController, // 막대 그래프 컨트롤러
  Title // 차트 제목
);

/**
 * 막대 그래프와 선 그래프를 혼합하여 표시할 수 있는 MixedChart 컴포넌트
 *
 * Chart.js와 react-chartjs-2를 기반으로 한 커스터마이징 가능한 혼합 차트 컴포넌트입니다.
 * 하나의 차트에 막대 그래프와 선 그래프를 동시에 표시할 수 있으며,
 * 다양한 props를 통해 차트의 모양, 기능, 스타일을 조정할 수 있습니다.
 *
 * @example
 * // 기본 사용법
 * <MixedChart
 *   labels={["1월", "2월", "3월", "4월"]}
 *   datasets={[
 *     {
 *       type: 'bar',
 *       label: "매출",
 *       data: [5000, 3000, 4000, 7000],
 *       backgroundColor: "rgba(75, 192, 192, 0.6)"
 *     },
 *     {
 *       type: 'line',
 *       label: "목표",
 *       data: [4000, 4000, 4000, 4000],
 *       borderColor: "rgba(255, 99, 132, 1)",
 *       fill: false
 *     }
 *   ]}
 *   height={350}
 *   title="월별 매출 및 목표"
 * />
 */
const MixedChart: React.FC<MixedChartProps> = ({
  labels,
  datasets,
  height = 400,
  width,
  title = "",
  xAxisLabel = "",
  yAxisLabel = "",
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
  multiAxis = false,
  rightYAxisLabel = ""
}) => {
  const data = {
    labels,
    datasets: datasets.map((dataset) => {
      // 바 차트에만 너비 조절 옵션 추가
      if (dataset.type === "bar") {
        return {
          ...dataset,
          barThickness: 30, // 막대 두께 (px)
          maxBarThickness: 40, // 최대 두께
          categoryPercentage: 0.8, // 카테고리 영역 비율
          barPercentage: 0.5 // 막대 영역 비율
        };
      }
      return dataset;
    })
  };

  const options = {
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
        font: { size: 16 }
      },
      tooltip: { enabled: tooltips }
    },
    scales: {
      x: {
        title: { display: !!xAxisLabel, text: xAxisLabel },
        grid: { display: gridLines },
        stacked,
        // 추가: x축 레벨에서 너비 제어
        barThickness: 30,
        categoryPercentage: 0.8,
        barPercentage: 0.5
      },
      y: {
        beginAtZero,
        title: { display: !!yAxisLabel, text: yAxisLabel },
        grid: { display: gridLines },
        stacked
      },
      ...(multiAxis && {
        y1: {
          beginAtZero,
          position: "right" as const,
          title: { display: !!rightYAxisLabel, text: rightYAxisLabel },
          grid: { display: false }
        }
      })
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
