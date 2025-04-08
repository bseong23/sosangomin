import React from "react";
import { AnalysisResultData } from "../../types/analysis";
import Sun from "@/assets/sun.png";
import Cloud from "@/assets/cloud.png";
import Markdown from "react-markdown";

interface WeatherSalesSectionProps {
  data: AnalysisResultData;
}

const markdownComponents = {
  h1: (props: any) => (
    <h1 className="text-2xl font-bold my-4 text-bit-main" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-xl font-semibold my-3 mb-5 text-bit-main" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-lg font-medium my-2 text-bit-main" {...props} />
  ),
  p: (props: any) => <p className="my-2 text-base  text-comment" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 my-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
  li: (props: any) => <li className="my-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic my-2"
      {...props}
    />
  )
};

const WeatherSalesSection: React.FC<WeatherSalesSectionProps> = ({ data }) => {
  // 날씨별 매출 데이터
  const weatherSales = data?.result_data?.weather_sales?.data || {};
  const weatherSalesSummary = data?.result_data?.weather_sales?.summary || "";

  // 총 매출 계산
  const total = Object.values(weatherSales).reduce(
    (sum: any, val) => sum + val,
    0
  );

  // 날씨 아이콘 매핑
  const weatherIcons: { [key: string]: string } = {
    맑음: Sun,
    "비/눈": Cloud
  };

  return (
    <div className="w-full mb-6 bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-15 text-comment">
        날씨별 매출 분석
      </h2>

      <div className="flex justify-around items-center gap-4 h-[350px]">
        {Object.entries(weatherSales).map(([weather, amount], idx) => {
          const percentage = ((amount / total) * 100).toFixed(1);

          return (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={weatherIcons[weather]}
                alt={`${weather} 날씨 아이콘`}
                className="w-30 h-30 mb-10"
              />
              <p className="text-sm font-semibold">{weather}</p>
              <p className="text-sm">{percentage}%</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-comment">
          <Markdown components={markdownComponents}>
            {weatherSalesSummary}
          </Markdown>
        </p>
      </div>
    </div>
  );
};

export default WeatherSalesSection;
