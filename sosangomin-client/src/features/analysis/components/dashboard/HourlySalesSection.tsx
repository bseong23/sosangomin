import React from "react";
import SalesTrendCard from "./SalesTrendCard";
import { AnalysisResultData } from "../../types/analysis";

interface HourlySalesSectionProps {
  data: AnalysisResultData;
}

const HourlySalesSection: React.FC<HourlySalesSectionProps> = ({ data }) => {
  // 하드코딩된 데이터 대신 props 데이터 사용
  const hourlySales = data?.result_data?.hourly_sales?.data || {};
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

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-10 text-comment">
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
        {/* 요약 - 축약 없이 전체 텍스트 표시 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-base text-comment">{hourlySalesSummary}</p>
        </div>
      </div>
    </div>
  );
};

export default HourlySalesSection;
