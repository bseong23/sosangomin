import React from "react";
import { AnalysisResultData } from "../../types/analysis";

interface WeatherSalesSectionProps {
  data: AnalysisResultData;
}

const WeatherSalesSection: React.FC<WeatherSalesSectionProps> = ({ data }) => {
  // 날씨별 매출 데이터
  const weatherSales = data?.result_data?.weather_sales?.data || {};
  const weatherSalesSummary = data?.result_data?.weather_sales?.summary || "";

  // 총 매출 계산
  const total = Object.values(weatherSales).reduce(
    (sum: any, val) => sum + val,
    0
  );

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength = 200): string => {
    return summary.length > maxLength
      ? `${summary.substring(0, maxLength)}...`
      : summary;
  };

  return (
    <div className="w-full mb-10 bg-basic-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        날씨별 매출 분석
      </h2>
      <div className="space-y-3">
        {Object.entries(weatherSales).map(([weather, amount], idx) => {
          const percentage = ((amount / total) * 100).toFixed(1);
          const bgColors = [
            "bg-blue-500 bg-opacity-70",
            "bg-red-500 bg-opacity-70"
          ];

          return (
            <div key={idx} className="w-full">
              <div className="flex justify-between text-xs mb-1">
                <span>{weather}</span>
                <span>
                  ₩{amount.toLocaleString("ko-KR")} ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${
                    bgColors[idx % bgColors.length]
                  } h-2.5 rounded-full`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-comment-text">
          {truncateSummary(weatherSalesSummary)}
        </p>
      </div>
    </div>
  );
};

export default WeatherSalesSection;
