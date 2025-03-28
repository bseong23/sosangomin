import React, { useState } from "react";
import { ReportData } from "../types";

interface RecommendationsComponentProps {
  data: ReportData;
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

  // 표시할 개선 제안 (3개 또는 전체)
  const displayRecommendations = showAll
    ? data.swot_analysis.recommendations
    : data.swot_analysis.recommendations.slice(0, 3);

  return (
    <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-lg p-6 h-full">
      <div className="flex items-center mb-6">
        <svg
          className="w-6 h-6 text-indigo-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">개선 제안</h2>
      </div>

      <div className="space-y-3">
        {displayRecommendations.map((recommendation, index) => (
          <div key={index} className="bg-blue-50 rounded-lg p-4">
            <div className="flex">
              <div className="bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center mr-3 flex-shrink-0">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-800">
                  {recommendation}
                </div>
                <div className="mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    {priorityLabels[index]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {data.swot_analysis.recommendations.length > 3 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
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
