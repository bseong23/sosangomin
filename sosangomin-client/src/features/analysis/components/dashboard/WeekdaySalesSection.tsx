// src/features/analysis/components/dashboard/WeekdaySalesSection.tsx
import React from "react";
import SalesRankingCard from "./SalesRankingCard";

import { AnalysisResultData } from "../../types/analysis";

interface WeekdaySalesSectionProps {
  data: AnalysisResultData;
}

const WeekdaySalesSection: React.FC<WeekdaySalesSectionProps> = ({ data }) => {
  // 요일별 매출 데이터
  const weekdaySales = data?.result_data?.weekday_sales?.data || {
    Saturday: 3264000,
    Sunday: 3703000,
    Thursday: 2649000,
    Tuesday: 1836000,
    Wednesday: 2637000
  };

  const weekdaySalesSummary = data?.result_data?.weekday_sales?.summary || "";

  const weekdaySalesLabels = Object.keys(weekdaySales).map((day) => {
    const koreanDays: { [key: string]: string } = {
      Monday: "월요일",
      Tuesday: "화요일",
      Wednesday: "수요일",
      Thursday: "목요일",
      Friday: "금요일",
      Saturday: "토요일",
      Sunday: "일요일"
    };
    return koreanDays[day] || day;
  });

  const weekdaySalesDatasets = [
    {
      label: "요일별 매출",
      data: Object.values(weekdaySales),
      backgroundColor: "rgba(75, 192, 192, 0.6)"
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
    <div className="bg-basic-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        요일별 매출 현황
      </h2>
      <div
        className="mb-4"
        style={{ width: "100%", height: "350px", overflow: "hidden" }}
      >
        <SalesRankingCard
          title=""
          labels={weekdaySalesLabels}
          datasets={weekdaySalesDatasets}
          height={350}
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-base font-medium mb-2 text-comment">
            요일별 분석
          </h3>
          <p className="text-sm text-comment-text">
            {truncateSummary(weekdaySalesSummary)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeekdaySalesSection;
