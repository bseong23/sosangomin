// src/pages/ReviewInsightPage.tsx

import React from "react";
import LineChart from "@/components/chart/LineChart";

const ReviewInsightPage: React.FC = () => {
  // 요일별 레이블 설정
  const labels = [
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
    "일요일"
  ];

  // 데이터셋 정의
  const datasets = [
    {
      label: "이번 주 매출",
      data: [120, 145, 138, 156, 210, 252, 198],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      tension: 0.3
    },
    {
      label: "지난 주 매출",
      data: [132, 128, 142, 150, 198, 235, 182],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.3
    }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold ml-4 mt-4">매장 매출 분석</h1>
      <div className="bg-white px-10 py-6">
        <LineChart
          title="요일별 매출 현황"
          labels={labels}
          datasets={datasets}
          yAxisTitle="매출 (만원)"
        />
      </div>
    </div>
  );
};

export default ReviewInsightPage;
