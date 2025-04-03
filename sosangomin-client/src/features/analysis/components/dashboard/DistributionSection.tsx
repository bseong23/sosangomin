import React, { useState } from "react";
import PieChart from "@/components/chart/PieChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { AnalysisResultData } from "../../types/analysis";

interface DistributionSectionProps {
  data: AnalysisResultData;
}

const DistributionSection: React.FC<DistributionSectionProps> = ({ data }) => {
  // 상태 추가 (각 요약 텍스트의 확장 상태)
  const [expandedSections, setExpandedSections] = useState({
    timePeriod: false,
    holidaySales: false
  });

  // 평일/휴일 매출 데이터
  const holidaySales = data?.result_data?.holiday_sales?.data || {};
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
  const timePeriodSales = data?.result_data?.time_period_sales?.data || {};
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

  // 요약 텍스트 축약 및 확장 함수
  const renderSummary = (
    summary: string,
    sectionKey: "timePeriod" | "holidaySales",
    maxLength: number = 150
  ) => {
    const isExpanded = expandedSections[sectionKey];

    // 텍스트 토글 함수
    const toggleExpand = () => {
      setExpandedSections((prev) => ({
        ...prev,
        [sectionKey]: !prev[sectionKey]
      }));
    };

    // 텍스트가 maxLength보다 짧으면 그대로 표시
    if (summary.length <= maxLength) {
      return <p className="text-sm text-comment">{summary}</p>;
    }

    return (
      <div>
        <p className="text-sm text-comment">
          {isExpanded ? summary : summary.substring(0, maxLength) + "..."}
          <button
            onClick={toggleExpand}
            className="text-xs ml-4 text-blue-500 hover:text-blue-700 mt-1"
          >
            {isExpanded ? "접기" : "더 보기"}
          </button>
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* 식사 시간대별 매출 비율 */}
      <div className="grid grid-rows-[auto,1fr,auto] bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
        <h2 className="text-lg font-semibold mb-10 text-comment">
          식사 시간대별 매출 비율
        </h2>

        {/* 차트와 범례를 분리해서 배치 */}
        <div className="flex flex-col justify-center items-center">
          <div className="w-64 h-64 mb-10">
            <PieChart chartData={timePeriodData} />
          </div>
        </div>

        {/* 요약 */}
        <div>
          <div className="p-3 bg-blue-50 rounded-lg">
            {renderSummary(timePeriodSalesSummary, "timePeriod")}
          </div>
        </div>
      </div>

      {/* 평일/휴일 매출 비율 */}
      <div className="grid grid-rows-[auto,1fr,auto] bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
        <h2 className="text-lg font-semibold mb-10 text-comment">
          평일/휴일 매출 비율
        </h2>

        {/* 차트와 범례를 분리해서 배치 */}
        <div className="flex flex-col justify-center items-center">
          <div className="w-64 h-64 mb-10">
            <DoughnutChart chartData={holidaySalesData} />
          </div>
        </div>

        {/* 요약 */}
        <div>
          <div className="p-3 bg-blue-50 rounded-lg">
            {renderSummary(holidaySalesSummary, "holidaySales")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionSection;
