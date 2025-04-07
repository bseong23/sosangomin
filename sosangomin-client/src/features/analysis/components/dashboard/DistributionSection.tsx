import React from "react";
import BarChart from "@/components/chart/BarChart";
import { AnalysisResultData } from "../../types/analysis";

interface DistributionSectionProps {
  data: AnalysisResultData;
}

const DistributionSection: React.FC<DistributionSectionProps> = ({ data }) => {
  // 평일/휴일 매출 데이터
  const holidaySales = data?.result_data?.holiday_sales?.data || {};
  const holidaySalesSummary = data?.result_data?.holiday_sales?.summary || "";

  // 시간대별 매출 데이터
  const timePeriodSales = data?.result_data?.time_period_sales?.data || {};
  const timePeriodSalesSummary =
    data?.result_data?.time_period_sales?.summary || "";

  // 시간대별 매출 데이터 (막대 그래프용)
  const timePeriodLabels = Object.keys(timePeriodSales);
  const timePeriodValues = Object.values(timePeriodSales);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 식사 시간대별 매출 비율 */}
      <div className="grid grid-rows-[auto,1fr,auto] bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
        <h2 className="text-lg font-semibold mb-10 text-comment">
          식사 시간대별 매출
        </h2>

        {/* 차트와 범례를 분리해서 배치 */}
        <div className="flex flex-col justify-center items-center">
          <div className="w-64 h-64 mb-10" style={{ width: "100%" }}>
            <BarChart
              labels={timePeriodLabels}
              datasets={[
                {
                  label: "시간대별 매출",
                  data: timePeriodValues,
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
                  barPercentage: 0.6
                }
              ]}
              height={280}
              legend={false}
            />
          </div>
        </div>

        {/* 요약 - 전체 텍스트 표시 */}
        <div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-comment">{timePeriodSalesSummary}</p>
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
          <div className="w-64 h-64 mb-10" style={{ width: "100%" }}>
            <BarChart
              labels={["평일", "주말"]}
              datasets={[
                {
                  label: "평일/휴일 매출",
                  data: Object.values(holidaySales),
                  backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 99, 132, 0.6)"
                  ],
                  borderColor: [
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 99, 132, 1)"
                  ],
                  barPercentage: 0.6
                }
              ]}
              height={280}
              legend={false}
            />
          </div>
        </div>

        {/* 요약 - 전체 텍스트 표시 */}
        <div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-comment">{holidaySalesSummary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionSection;
