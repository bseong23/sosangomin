// src/features/analysis/components/dashboard/DateRangeDisplay.tsx
import React from "react";
import { DataRange } from "../../types/analysis";

interface DateRangeSectionProps {
  dataRange?: DataRange;
}

const DateRangeSection: React.FC<DateRangeSectionProps> = ({ dataRange }) => {
  if (!dataRange) {
    return null;
  }

  // YYYY-MM 형식의 날짜를 YYYY년 MM월 형식으로 변환
  const formatMonth = (dateString: string) => {
    const [year, month] = dateString.split("-");
    return `${year}년 ${month}월`;
  };

  const startMonth = formatMonth(dataRange.start_month);
  const endMonth = formatMonth(dataRange.end_month);

  return (
    <div className="flex justify-end items-center gap-3 bg-white rounded-lg p-4 mb-4">
      <h2 className="text-base font-semibold text-comment">
        매장 분석 기간 :{" "}
      </h2>
      <div className="  rounded-lg">
        <span className="text-sm text-gray-600 font-medium">{startMonth}</span>
        <span className="mx-3 text-gray-400">~</span>
        <span className="text-sm text-gray-600 font-medium">{endMonth}</span>
      </div>
    </div>
  );
};

export default DateRangeSection;
