import React from "react";
import PieChart from "@/components/chart/PieChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { AnalysisResultData } from "../../types/analysis";

interface DistributionSectionProps {
  data: AnalysisResultData;
}

const DistributionSection: React.FC<DistributionSectionProps> = ({ data }) => {
  // 평일/휴일 매출 데이터
  const holidaySales = data?.result_data?.holiday_sales?.data || {
    평일: 7122000,
    휴일: 6967000
  };

  const holidaySalesSummary = data?.result_data?.holiday_sales?.summary || "";

  const holidaySalesData = {
    labels: Object.keys(holidaySales),
    datasets: [
      {
        label: "평일/휴일 매출",
        data: Object.values(holidaySales),
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1
      }
    ]
  };

  // 시간대별 매출 데이터
  const timePeriodSales = data?.result_data?.time_period_sales?.data || {
    기타: 26000,
    저녁: 8553000,
    점심: 5510000
  };

  const timePeriodSalesSummary =
    data?.result_data?.time_period_sales?.summary || "";

  const timePeriodData = {
    labels: Object.keys(timePeriodSales),
    datasets: [
      {
        label: "시간대별 매출",
        data: Object.values(timePeriodSales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // 범례 항목 생성 함수
  const formatLegendItems = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    return Object.entries(data).map(([key, value], idx) => {
      const colors = [
        "bg-red-400",
        "bg-blue-400",
        "bg-yellow-400",
        "bg-green-400",
        "bg-purple-400"
      ];
      const percentage = ((value / total) * 100).toFixed(1);
      return {
        color: colors[idx % colors.length],
        label: key,
        value: `₩${value.toLocaleString("ko-KR")} (${percentage}%)`
      };
    });
  };

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength: number = 150) => {
    if (!summary) return "";
    return summary.length > maxLength
      ? summary.substring(0, maxLength) + "..."
      : summary;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-6">
      {/* 평일/휴일 매출 비율 */}
      <div className="w-full lg:w-1/2 bg-basic-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          평일/휴일 매출 비율
        </h2>

        {/* 차트와 범례를 분리해서 배치 */}
        <div className="flex flex-col mb-4">
          <div className="flex justify-center items-center h-56">
            <div className="w-48 h-48">
              <DoughnutChart chartData={holidaySalesData} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {formatLegendItems(holidaySales).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center px-2 py-1 bg-gray-50 rounded"
              >
                <div className={`w-3 h-3 ${item.color} mr-2 rounded-sm`}></div>
                <div className="text-xs text-comment-text">
                  {item.label}: {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 요약 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-comment-text">
            {truncateSummary(holidaySalesSummary)}
          </p>
        </div>
      </div>

      {/* 식사 시간대별 매출 비율 */}
      <div className="w-full lg:w-1/2 bg-basic-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          식사 시간대별 매출 비율
        </h2>

        {/* 차트와 범례를 분리해서 배치 */}
        <div className="flex flex-col mb-4">
          <div className="flex justify-center items-center h-56">
            <div className="w-48 h-48">
              <PieChart chartData={timePeriodData} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {formatLegendItems(timePeriodSales).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center px-2 py-1 bg-gray-50 rounded"
              >
                <div className={`w-3 h-3 ${item.color} mr-2 rounded-sm`}></div>
                <div className="text-xs text-comment-text">
                  {item.label}: {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 요약 */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-comment-text">
            {truncateSummary(timePeriodSalesSummary)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DistributionSection;
