// src/features/analysis/components/dashboard/HourlySalesSection.tsx
import React from "react";
import SalesTrendCard from "./SalesTrendCard";

interface HourlySalesSectionProps {
  data: any; // 타입은 실제 데이터 구조에 맞게 정의하는 것이 좋습니다
}

const HourlySalesSection: React.FC<HourlySalesSectionProps> = ({ data }) => {
  // 시간별 매출 데이터
  const hourlySales = data?.result_data?.hourly_sales?.data || {
    "11": 420000,
    "12": 1714000,
    "13": 1999000,
    "14": 1274000,
    "15": 103000,
    "16": 26000,
    "17": 1019000,
    "18": 1776000,
    "19": 3603000,
    "20": 2155000
  };

  const hourlySalesSummary = data?.result_data?.hourly_sales?.summary || "";

  const hourlySalesLabels = Object.keys(hourlySales).map((hour) => `${hour}시`);
  const hourlySalesDatasets = [
    {
      label: "시간별 매출",
      data: Object.values(hourlySales),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.3
    }
  ];

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength: number = 300) => {
    if (!summary) return "";
    return summary.length > maxLength
      ? summary.substring(0, maxLength) + "..."
      : summary;
  };

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        우리 가게 시간별 매출액
      </h2>
      <div className="mb-20" style={{ width: "100%", height: "350px" }}>
        <SalesTrendCard
          title=""
          labels={hourlySalesLabels}
          datasets={hourlySalesDatasets}
          height={350}
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-base font-medium mb-2 text-comment">
            데이터 분석
          </h3>
          <p className="text-sm text-comment-text">
            {truncateSummary(hourlySalesSummary)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HourlySalesSection;
