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

  // 배열로 변환하여 정렬 (선택사항)
  const topProductsArray = Object.entries(topProducts).map(([name, value]) => ({
    name,
    value
  }));

  // 값을 기준으로 내림차순 정렬 (선택사항)
  topProductsArray.sort((a, b) => (b.value as number) - (a.value as number));

  // 정렬된 배열에서 라벨과 데이터 추출
  const topProductsLabels = topProductsArray.map((item) => item.name);
  const topProductsValues = topProductsArray.map((item) => item.value);

  const topProductsDatasets = [
    {
      label: "상위 제품 매출",
      data: topProductsValues,
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
          unit="원"
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
