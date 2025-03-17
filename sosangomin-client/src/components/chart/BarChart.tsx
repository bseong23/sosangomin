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
import { BarChartProps } from "@/types/chart"; // 분리된 타입 임포트

// Chart.js 필요한 컴포넌트 등록
ChartJS.register(
  CategoryScale, // X축 카테고리 스케일 (범주형 데이터용)
  LinearScale, // Y축 선형 스케일 (숫자 데이터용)
  BarElement, // 막대 차트 요소
  Title, // 차트 제목
  Tooltip, // 툴팁 (데이터 포인트에 마우스 오버 시)
  Legend // 범례 (각 데이터셋 구분)
);

/**
 * 재사용 가능한 BarChart 컴포넌트
 *
 * Chart.js와 react-chartjs-2를 기반으로 한 커스터마이징 가능한 막대 차트 컴포넌트입니다.
 * 다양한 props를 통해 차트의 모양, 기능, 스타일을 조정할 수 있습니다.
 *
 * @example
 * // 기본 사용법
 * <BarChart
 *   labels={["월", "화", "수", "목", "금"]}
 *   datasets={[{
 *     label: "매출",
 *     data: [5000, 3000, 4000, 7000, 6000],
 *     backgroundColor: "rgba(75, 192, 192, 0.6)"
 *   }]}
 *   height={350}
 *   title="요일별 매출"
 * />
 */
const BarChart: React.FC<BarChartProps> = ({
  labels, // X축에 표시될 레이블 배열
  datasets, // 차트 데이터셋 배열
  height = 400, // 차트 높이 (기본값: 400px)
  width, // 차트 너비 (미지정 시 컨테이너 너비 사용)
  horizontal = false, // 막대 방향 (기본값: 수직 막대)
  stacked = false, // 누적 막대 여부 (기본값: 비누적)
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
  onClick, // 차트 요소 클릭 시 실행될 함수
  className = "", // 추가 CSS 클래스
  id = "bar-chart" // 차트 HTML ID (기본값: "bar-chart")
}) => {
  // 차트 옵션 구성 - Chart.js 옵션 객체
  const options = {
    indexAxis: horizontal ? ("y" as const) : ("x" as const), // 막대 방향 설정
    responsive, // 반응형 설정
    maintainAspectRatio, // 종횡비 유지 설정
    plugins: {
      legend: {
        display: legend, // 범례 표시 여부
        position: legendPosition as "top" | "right" | "bottom" | "left" // 범례 위치
      },
      title: {
        display: !!title, // 제목 표시 여부 (제목이 있을 때만)
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
        stacked, // X축 누적 설정
        title: {
          display: !!xAxisLabel, // X축 레이블 표시 여부
          text: xAxisLabel // X축 레이블 텍스트
        },
        grid: {
          display: gridLines // X축 그리드 라인 표시 여부
        }
      },
      y: {
        stacked, // Y축 누적 설정
        beginAtZero, // Y축 0부터 시작 여부
        title: {
          display: !!yAxisLabel, // Y축 레이블 표시 여부
          text: yAxisLabel // Y축 레이블 텍스트
        },
        grid: {
          display: gridLines // Y축 그리드 라인 표시 여부
        }
      }
    },
    animation: animation ? {} : false, // 애니메이션 설정
    onClick // 클릭 이벤트 핸들러
  };

  // 차트 데이터 구성
  const data = {
    labels, // X축 레이블
    datasets // 데이터셋 배열
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
        data-testid="bar-chart" // 테스트용 ID
      >
        <Bar data={data} options={options} />{" "}
        {/* react-chartjs-2 Bar 컴포넌트 */}
      </div>
    </div>
  );
};

export default BarChart;
