import React, { useState } from "react";
import { FinalReportDetail } from "../types/finalReport";

interface RecommendationsComponentProps {
  data: FinalReportDetail;
}

const RecommendationsComponent: React.FC<RecommendationsComponentProps> = ({
  data
}) => {
  const [showAll, setShowAll] = useState(false);

  // 실제 데이터에서는 우선순위가 포함되어 있지 않으므로 고정된 값을 사용합니다
  const priorityLabels = [
    "높은 우선순위",
    "높은 우선순위",
    "중간 우선순위",
    "중간 우선순위",
    "낮은 우선순위"
  ];

  // 우선순위에 따른 색상 설정
  const getPriorityColor = (index: number) => {
    if (index < 2) return { bg: "bg-red-100", text: "text-red-700" }; // 높은 우선순위
    if (index < 4) return { bg: "bg-yellow-100", text: "text-yellow-700" }; // 중간 우선순위
    return { bg: "bg-green-100", text: "text-green-700" }; // 낮은 우선순위
  };

  // 표시할 개선 제안 (3개 또는 전체)
  const displayRecommendations = showAll
    ? data.swot_analysis.recommendations
    : data.swot_analysis.recommendations.slice(0, 3);

  return (
    <div className="bg-basic-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-lg p-4 mb-6 h-full">
      <div className="flex p-4 items-center mb-6">
        <h2 className="text-xl font-semibold text-bit-main">개선 제안</h2>
      </div>

      <div className="space-y-2 md:space-y-3">
        {displayRecommendations.map((recommendation, index) => {
          const priorityColor = getPriorityColor(index);
          return (
            <div
              key={index}
              className="bg-blue-50 bg-opacity-50 rounded-lg p-3 md:p-4 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex">
                <div className="bg-bit-main text-basic-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-bit-main text-sm md:text-base lg:text-lg">
                    {recommendation}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`text-xs md:text-sm px-2 py-0.5 rounded-full ${priorityColor.bg} ${priorityColor.text}`}
                    >
                      {priorityLabels[index]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {data.swot_analysis.recommendations.length > 3 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-bit-main hover:text-opacity-80 text-sm md:text-base font-medium transition-colors duration-200"
            >
              {showAll ? "접기" : "더보기"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsComponent;
