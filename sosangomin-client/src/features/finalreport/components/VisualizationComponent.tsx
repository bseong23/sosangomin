// src/features/finalreport/components/VisualizationComponent.tsx
import React from "react";
import { FinalReportDetail } from "../types/finalReport";

interface VisualizationComponentProps {
  data: FinalReportDetail;
}

const VisualizationComponent: React.FC<VisualizationComponentProps> = ({
  data
}) => {
  return (
    <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-lg p-6 mb-6">
      {/* 추천사항 우선순위 차트 */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        개선 제안 우선순위
      </h3>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="space-y-3">
          {data.swot_analysis.recommendations.map((recommendation, idx) => (
            <div key={idx} className="flex items-center">
              <div className="w-32 text-sm text-gray-700 flex-shrink-0 truncate">
                {recommendation.split(":")[0]}
              </div>
              <div className="flex-grow">
                <div
                  className={`h-6 rounded-full ${
                    idx < 2
                      ? "bg-red-500"
                      : idx < 4
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${100 - idx * 10}%` }}
                ></div>
              </div>
              <div className="ml-3 text-sm font-medium">
                {idx < 2 ? "높음" : idx < 4 ? "중간" : "낮음"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizationComponent;
