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
        {/* <h3 className="text-base font-medium mb-2 text-comment">차트 분석</h3> */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-base text-comment">
            {truncateSummary(hourlySalesSummary)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HourlySalesSection;
