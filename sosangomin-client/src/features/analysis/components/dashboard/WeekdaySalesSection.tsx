import React from "react";
import SalesRankingCard from "./SalesRankingCard";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

interface WeekdaySalesSectionProps {
  data: AnalysisResultData;
}

const WeekdaySalesSection: React.FC<WeekdaySalesSectionProps> = ({ data }) => {
  // 요일별 매출 데이터
  const weekdaySales = data?.result_data?.weekday_sales?.data || {};
  const weekdaySalesSummary = data?.result_data?.weekday_sales?.summary || "";

  // 요일 순서 정의 (월요일부터 일요일까지)
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  // 요일 이름 매핑
  const koreanDays: { [key: string]: string } = {
    Monday: "월요일",
    Tuesday: "화요일",
    Wednesday: "수요일",
    Thursday: "목요일",
    Friday: "금요일",
    Saturday: "토요일",
    Sunday: "일요일"
  };

  // 정렬된 데이터 배열 생성
  const sortedEntries = dayOrder
    .filter((day) => weekdaySales[day] !== undefined)
    .map((day) => ({
      day: day,
      koreanDay: koreanDays[day] || day,
      value: weekdaySales[day]
    }));

  // 정렬된 데이터에서 라벨과 값 추출
  const weekdaySalesLabels = sortedEntries.map((entry) => entry.koreanDay);
  const weekdaySalesValues = sortedEntries.map((entry) => entry.value);

  const markdownComponents = {
    h1: (props: any) => (
      <h1 className="text-2xl font-bold my-4 text-bit-main" {...props} />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-semibold my-3 mb-5 text-bit-main"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3 className="text-lg font-medium my-2 text-bit-main" {...props} />
    ),
    p: (props: any) => (
      <p className="my-2 text-base  text-comment" {...props} />
    ),
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
  const weekdaySalesDatasets = [
    {
      label: "요일별 매출",
      data: weekdaySalesValues,
      backgroundColor: "rgba(75, 192, 192, 0.6)"
    }
  ];

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        요일별 매출 현황
      </h2>
      <div className="mb-10" style={{ width: "100%", height: "350px" }}>
        <SalesRankingCard
          title=""
          labels={weekdaySalesLabels}
          datasets={weekdaySalesDatasets}
          height={350}
          unit="원"
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-comment">
            <Markdown components={markdownComponents}>
              {weekdaySalesSummary}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeekdaySalesSection;
