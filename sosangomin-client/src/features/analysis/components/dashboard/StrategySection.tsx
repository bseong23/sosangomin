import React from "react";
import { AnalysisResultData } from "../../types/analysis";

const StrategySection: React.FC<{ data: AnalysisResultData }> = ({ data }) => {
  // recommendation 데이터 추출 (타입에 맞게 수정)
  const clusterSummary =
    data?.auto_analysis_results?.summaries?.cluster_summary || {};

  const recommendationText =
    clusterSummary.recommendation ||
    data?.auto_analysis_results?.summaries?.predict_summary?.recommendation ||
    "";

  const preprocessRecommendations = (text: string) => {
    if (!text) return [];

    // 한글 숫자와 기호 포함한 정규표현식
    const recommendationRegex = /[①②③④⑤⑥⑦⑧⑨⑩][\s)]*(.*?)(?=[①②③④⑤⑥⑦⑧⑨⑩]|$)/g;

    const matches = [...text.matchAll(recommendationRegex)];

    return matches.map((match, index) => ({
      number: index + 1,
      text: match[1].trim()
    }));
  };

  const recommendations = preprocessRecommendations(recommendationText);

  return (
    <div className="w-full lg:w-1/2 bg-basic-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        영업 전략 제안
      </h2>
      <div className="p-4 bg-blue-50 rounded-lg">
        <ul className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <li key={rec.number} className="flex items-start">
                <div className="flex-shrink-0 w-5 h-5 bg-bit-main rounded-full flex items-center justify-center text-basic-white font-bold mr-2 mt-0.5">
                  {rec.number}
                </div>
                <p className="text-sm text-comment">{rec.text}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">
              현재 제안된 전략이 없습니다.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default StrategySection;
