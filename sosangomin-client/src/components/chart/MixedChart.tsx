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
  labels, // X축에 표시될 레이블 배열
  datasets, // 차트 데이터셋 배열
  height = 400, // 차트 높이 (기본값: 400px)
  width, // 차트 너비 (미지정 시 컨테이너 너비 사용)
  title = "", // 차트 제목
  xAxisLabel = "", // X축 레이블
  yAxisLabel = "", // Y축 레이블
  legend = true, // 범례 표시 여부 (기본값: 표시)
  legendPosition = "top", // 범례 위치 (기본값: 상단)
  gridLines = true, // 그리드 라인 표시 여부 (기본값: 표시)
  beginAtZero = true, // Y축 0부터 시작 여부 (기본값: 0부터 시작)
  tooltips = true, // 툴팁 표시 여부 (기본값: 표시)
  animation = true, // 애니메이션 효과 (기본값: 사용)
  responsive = true, // 반응형 차트 (기본값: 반응형)
  maintainAspectRatio = false, // 종횡비 유지 여부 (기본값: 유지 안 함)
  stacked = false, // 막대 그래프 누적 여부 (기본값: 비누적)
  onClick, // 차트 요소 클릭 시 실행될 함수
  className = "", // 추가 CSS 클래스
  id = "mixed-chart", // 차트 HTML ID (기본값: "mixed-chart")
  multiAxis = false, // 다중 Y축 사용 여부 (기본값: 단일 축)
  rightYAxisLabel = "" // 오른쪽 Y축 레이블
}) => {
  // 차트 데이터 설정
  const data = {
    labels,
    datasets: multiAxis
      ? datasets.map((dataset) => {
          // 다중 Y축 사용 시 선 그래프는 오른쪽 축에, 막대 그래프는 왼쪽 축에 기본 할당
          if (!dataset.yAxisID) {
            return {
              ...dataset,
              yAxisID: dataset.type === "line" ? "y1" : "y"
            };
          }
          return dataset;
        })
      : datasets
  };

  // 차트 옵션 구성
  const options = {
    responsive, // 반응형 설정
    maintainAspectRatio, // 종횡비 유지 설정
    plugins: {
      legend: {
        display: legend, // 범례 표시 여부
        position: legendPosition as "top" | "right" | "bottom" | "left" // 범례 위치
      },
      title: {
        display: !!title, // 제목 표시 여부
        text: title, // 제목 텍스트
        font: {
          size: 16 // 제목 폰트 크기
        }
      },
      tooltip: {
        enabled: tooltips // 툴팁 표시 여부
      }
    },
    scales: {
      x: {
        title: {
          display: !!xAxisLabel, // X축 레이블 표시 여부
          text: xAxisLabel // X축 레이블 텍스트
        },
        grid: {
          display: gridLines // X축 그리드 라인 표시 여부
        },
        stacked: stacked // X축 누적 설정
      },
      y: {
        beginAtZero, // Y축 0부터 시작 여부
        title: {
          display: !!yAxisLabel, // Y축 레이블 표시 여부
          text: yAxisLabel // Y축 레이블 텍스트
        },
        grid: {
          display: gridLines // Y축 그리드 라인 표시 여부
        },
        stacked: stacked // Y축 누적 설정
      },
      ...(multiAxis
        ? {
            y1: {
              beginAtZero, // 오른쪽 Y축 0부터 시작 여부
              position: "right" as const, // 오른쪽에 위치
              title: {
                display: !!rightYAxisLabel, // 오른쪽 Y축 레이블 표시 여부
                text: rightYAxisLabel // 오른쪽 Y축 레이블 텍스트
              },
              grid: {
                display: false // 오른쪽 Y축 그리드 라인 표시 안 함
              }
            }
          }
        : {})
    },
    animation: animation ? { duration: 1000 } : { duration: 0 }, // 애니메이션 설정
    onClick // 클릭 이벤트 핸들러
  };

  // 반응형 개선을 위한 wrapper div 추가
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div
        id={id} // HTML ID
        className="chart-container w-full" // CSS 클래스
        style={{
          height: `${height}px`, // 높이 설정
          width: width ? `${width}px` : "100%", // 너비 설정 (지정되지 않으면 100%)
          position: "relative" // 포지션 설정
        }}
        data-testid="mixed-chart" // 테스트용 ID
      >
        <Chart type="bar" data={data} options={options} />
        {/* type="bar"로 설정해도 dataset 내의 type 속성에 따라 다양한 차트 유형이 표시됨 */}
      </div>
    </div>
  );
};

export default MixedChart;
