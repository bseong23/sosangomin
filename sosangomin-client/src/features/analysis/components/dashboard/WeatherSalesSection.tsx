import React from "react";
import { AnalysisResultData } from "../../types/analysis";
import Sun from "@/assets/sun.png";
import Cloud from "@/assets/cloud.png";

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

  // 날씨 아이콘 매핑
  const weatherIcons: { [key: string]: string } = {
    맑음: Sun,
    "비/눈": Cloud
  };

  return (
    <div className="w-full mb-6 bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        날씨별 매출 분석
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(weatherSales).map(([weather, amount], idx) => {
          const percentage = ((amount / total) * 100).toFixed(1);

          return (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={weatherIcons[weather]}
                alt={`${weather} 날씨 아이콘`}
                className="w-50 h-50 mb-2"
              />
              <p className="text-sm font-semibold">{weather}</p>
              <p className="text-sm">{percentage}%</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-comment">
          {truncateSummary(weatherSalesSummary)}
        </p>
      </div>
    </div>
  );
};

export default WeatherSalesSection;
