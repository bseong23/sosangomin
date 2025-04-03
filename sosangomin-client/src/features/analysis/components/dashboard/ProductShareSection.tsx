import React from "react";
import PieChart from "@/components/chart/PieChart";
import { AnalysisResultData } from "../../types/analysis";

interface ProductShareSectionProps {
  data: AnalysisResultData;
}

const ProductShareSection: React.FC<ProductShareSectionProps> = ({ data }) => {
  // 제품 점유율 데이터
  const productShare = data?.result_data?.product_share?.data || {};
  const productShareSummary = data?.result_data?.product_share?.summary || "";

  // 파이 차트 데이터 준비
  const productShareChartData = {
    labels: Object.keys(productShare),
    datasets: [
      {
        label: "제품 점유율",
        data: Object.values(productShare),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(199, 199, 199, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength = 300): string => {
    return summary.length > maxLength
      ? `${summary.substring(0, maxLength)}...`
      : summary;
  };

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        제품 점유율 분석
      </h2>
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <PieChart chartData={productShareChartData} />
        </div>
        <div className="w-full md:w-1/2 md:pl-4">
          <div className="space-y-2">
            {Object.entries(productShare).map(([product, share], idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm"
              >
                <span>{product}</span>
                <span className="font-semibold">{share.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-comment">
          {truncateSummary(productShareSummary)}
        </p>
      </div>
    </div>
  );
};

export default ProductShareSection;
