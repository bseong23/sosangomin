import React from "react";
import SalesRankingCard from "./SalesRankingCard";
import { AnalysisResultData } from "../../types/analysis";

interface TopProductsSectionProps {
  data: AnalysisResultData;
}

const TopProductsSection: React.FC<TopProductsSectionProps> = ({ data }) => {
  // 상위 제품 데이터
  const topProducts = data?.result_data?.top_products?.data || {};
  const topProductsSummary = data?.result_data?.top_products?.summary || "";

  const topProductsLabels = Object.keys(topProducts);
  const topProductsDatasets = [
    {
      label: "상위 제품 매출",
      data: Object.values(topProducts),
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)"
      ],
      borderWidth: 1
    }
  ];

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-10 text-comment">
        인기 메뉴 랭킹
      </h2>
      <div className="mb-20" style={{ width: "100%", height: "350px" }}>
        <SalesRankingCard
          title=""
          labels={topProductsLabels}
          datasets={topProductsDatasets}
          height={350}
          horizontal={true}
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-comment">{topProductsSummary}</p>
        </div>
      </div>
    </div>
  );
};

export default TopProductsSection;
