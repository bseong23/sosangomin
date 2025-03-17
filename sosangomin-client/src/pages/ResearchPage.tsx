import React from "react";
import BarChart from "@/components/chart/BarChart"; // 앞서 작성한 BarChart 컴포넌트 import

const ResearchPage: React.FC = () => {
  // 요일별 매출 데이터
  const labels = ["일요일", "Tuesday", "Wednesday", "Thursday", "Saturday"];
  const data = [3703000, 1836000, 2637000, 2649000, 3264000];

  // 데이터셋 정의
  const datasets = [
    {
      label: "요일별 매출 (원)",
      data: data,
      backgroundColor: "rgba(54, 162, 235, 0.7)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    }
  ];

  /*
  BarChart 쓰는 방법
    - labels: X축 레이블
    - datasets: 차트 데이터셋 (y축은 자동동)
    - height: 차트 높이
    - title: 차트 제목
    - xAxisLabel: X축 레이블
    - yAxisLabel: Y축 레이블
  */

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">요일별 매출 차트</h1>

      <div className="bg-white rounded-lg shadow p-4">
        <BarChart
          labels={labels}
          datasets={datasets}
          height={500}
          title="요일별 매출 현황"
          xAxisLabel="요일"
          yAxisLabel="매출 (원)"
        />
      </div>
    </div>
  );
};

export default ResearchPage;
