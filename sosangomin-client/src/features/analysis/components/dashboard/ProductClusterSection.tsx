import React from "react";
import { AnalysisResultData } from "../../types/analysis";

interface ProductClusterSectionProps {
  data: AnalysisResultData | null | undefined;
}

const ProductClusterSection: React.FC<ProductClusterSectionProps> = ({
  data
}) => {
  // 클러스터 데이터 - 수정된 경로로 접근
  const clusters = data?.auto_analysis_results?.cluster || {};
  const clusterSummary =
    data?.auto_analysis_results?.summaries?.cluster_summary || {};

  // 추천 텍스트 가져오기 - 다양한 위치에서 찾아본다
  const recommendationText =
    clusterSummary.recommendation ||
    data?.auto_analysis_results?.summaries?.predict_summary?.recommendation ||
    "";

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength = 300): string => {
    if (!summary) return "";
    return summary.length > maxLength
      ? `${summary.substring(0, maxLength)}...`
      : summary;
  };

  // 추천 사항 처리 함수
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

  // 데이터가 없을 경우 null 반환
  if (!data || !clusters || Object.keys(clusters).length === 0) {
    return (
      <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          연관 상품 분석
        </h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-base text-gray-500">
            연관 상품 분석 데이터가 없습니다.
          </p>
        </div>

        {/* 추천 전략 섹션 추가 */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 text-comment">
            소상고민이 제안하는 추천 운영 방안
          </h2>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500">
              현재 제안된 전략이 없습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // group_characteristics가 없으면 기본 요약과 추천 사항 표시
  if (!clusterSummary || !clusterSummary.group_characteristics) {
    console.log("클러스터 요약 데이터가 없거나 형식이 다릅니다:", {
      clusterSummary,
      hasGroupCharacteristics:
        clusterSummary &&
        Object.prototype.hasOwnProperty.call(
          clusterSummary,
          "group_characteristics"
        ),
      type: clusterSummary && typeof clusterSummary.group_characteristics
    });

    // 기본 요약과 추천 사항 컴포넌트 렌더링
    return (
      <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          연관 상품 분석
        </h2>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-base font-medium mb-2 text-comment">
            연관 상품 요약
          </h3>
          <p className="text-sm text-comment-text">
            {truncateSummary(clusterSummary.summary || "")}
          </p>
        </div>

        {/* 추천 전략 섹션 추가 */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 text-comment">
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
      </div>
    );
  }

  // 클러스터 데이터가 있고 group_characteristics가 있는 경우 전체 컴포넌트 렌더링
  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      {/* 연관 상품 분석 섹션 */}
      <h2 className="text-lg font-semibold mb-4 text-comment">
        연관 상품 분석
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        {Array.isArray(clusterSummary.group_characteristics) ? (
          clusterSummary.group_characteristics.map((group) => (
            <div key={group.group_id} className="p-4 rounded-lg bg-gray-50">
              <h3 className="text-base font-semibold mb-4 text-comment">
                {group.group_name}
              </h3>
              <p className="text-base text-comment-text mb-4">
                {group.description}
              </p>
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-base font-medium mb-1">대표 상품</h4>
                <ul className="list-disc list-inside text-xs text-comment">
                  {group.representative_items
                    ?.slice(0, 3)
                    .map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-100 rounded-lg w-full">
            <p className="text-sm text-gray-500">
              그룹 특성 데이터가 배열 형식이 아닙니다:{" "}
              {JSON.stringify(clusterSummary.group_characteristics)}
            </p>
          </div>
        )}
      </div>

      {/* 연관 상품 요약 */}
      {/* <div className="mt-6 p-4 rounded-lg bg-gray-50">
        <h3 className="text-base font-medium mb-2 text-comment">
          연관 상품 요약
        </h3>
        <div className="text-sm text-comment bg-blue-50 p-4 rounded-lg">
          <p className="mb-2">
            {truncateSummary(clusterSummary.summary || "", 500)}
          </p>
          {clusterSummary.group_insight && (
            <p>{truncateSummary(clusterSummary.group_insight, 500)}</p>
          )}
        </div>
      </div> */}

      {/* 추천 전략 섹션 추가 */}
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold mb-4 text-comment">
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
    </div>
  );
};

export default ProductClusterSection;
