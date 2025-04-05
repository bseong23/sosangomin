import React from "react";
import { AnalysisResultData } from "../../types/analysis";

const StrategySection: React.FC<{ data: AnalysisResultData }> = ({ data }) => {
  // recommendation 데이터 추출 (타입에 맞게 수정)
  const clusterSummary =
    data?.auto_analysis_results?.summaries?.cluster_summary || {};

  // 디버깅 로그 추가
  console.log("StrategySection 데이터:", {
    clusterSummary,
    predictSummary: data?.auto_analysis_results?.summaries?.predict_summary,
    fullData: data
  });

  // 추천 텍스트 가져오기 - 다양한 위치에서 찾아본다
  const recommendationText =
    clusterSummary.recommendation ||
    data?.auto_analysis_results?.summaries?.predict_summary?.recommendation ||
    "";

  console.log("추천 텍스트:", recommendationText);

  const preprocessRecommendations = (text: string) => {
    if (!text) return [];

    // 추천 사항 형식이 다양할 수 있으므로 여러 정규식 시도

    // 1. 한글 숫자(①②③)로 시작하는 경우
    const koreanNumRegex = /[①②③④⑤⑥⑦⑧⑨⑩][\s)]*(.*?)(?=[①②③④⑤⑥⑦⑧⑨⑩]|$)/g;

    // 2. 숫자 + 점(1. 2. 등)으로 시작하는 경우
    const numDotRegex = /(\d+)[\.\s)]+(.*?)(?=\d+[\.\s)]|$)/g;

    // 3. '-' 또는 '*' 기호로 시작하는 경우
    const bulletRegex = /[-\*][\s)]+(.*?)(?=[-\*][\s)]|$)/g;

    // 여러 정규식으로 시도하고 결과 반환
    let matches = [...text.matchAll(koreanNumRegex)];

    if (matches.length === 0) {
      matches = [...text.matchAll(numDotRegex)];
    }

    if (matches.length === 0) {
      matches = [...text.matchAll(bulletRegex)];
    }

    // 정규식으로 매칭되지 않으면 줄바꿈으로 분리
    if (matches.length === 0 && text.includes("\n")) {
      return text
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line, index) => ({
          number: index + 1,
          text: line
            .trim()
            .replace(/^[-\*\d\.\s①②③④⑤⑥⑦⑧⑨⑩]+/, "")
            .trim()
        }));
    }

    // 정규식 매칭 결과 반환
    return matches.map((match, index) => ({
      number: index + 1,
      text: match[match.length - 1].trim()
    }));
  };

  // 추천 사항이 없는 경우 전체 텍스트를 하나의 항목으로 표시
  let recommendations = preprocessRecommendations(recommendationText);

  if (recommendations.length === 0 && recommendationText) {
    recommendations = [
      {
        number: 1,
        text: recommendationText
      }
    ];
  }

  console.log("파싱된 추천 사항:", recommendations);

  return (
    <div className="w-full bg-basic-white p-6 mb-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-10 text-comment">
        소상고민이 제안하는 추천 운영 방안
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
