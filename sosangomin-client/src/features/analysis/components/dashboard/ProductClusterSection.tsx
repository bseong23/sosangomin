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

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength = 300): string => {
    if (!summary) return "";
    return summary.length > maxLength
      ? `${summary.substring(0, maxLength)}...`
      : summary;
  };

  // 데이터가 없을 경우 null 반환
  if (!data || !clusters || Object.keys(clusters).length === 0) {
    return (
      <div className="bg-basic-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          연관 상품 분석
        </h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-base text-gray-500">
            연관 상품 분석 데이터가 없습니다.
          </p>
        </div>
      </div>
    );
  }

  // group_characteristics가 없으면 디버깅 정보 출력
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

    // 기본 요약만 보여주는 컴포넌트 렌더링
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
      </div>
    );
  }

  // 클러스터 데이터가 있고 group_characteristics가 있는 경우 전체 컴포넌트 렌더링
  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        연관 상품 분석
      </h2>
      <div className="flex gap-4">
        {Array.isArray(clusterSummary.group_characteristics) ? (
          clusterSummary.group_characteristics.map((group) => (
            <div key={group.group_id} className="p-4 rounded-lg">
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
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-500">
              그룹 특성 데이터가 배열 형식이 아닙니다:{" "}
              {JSON.stringify(clusterSummary.group_characteristics)}
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 p-4 rounded-lg">
        <h3 className="text-base font-medium mb-2 text-comment">
          연관 상품 요약
        </h3>
        <div className="text-base text-comment bg-blue-50 p-4 rounded-lg">
          <p>{truncateSummary(clusterSummary.summary || "")}</p>
          {clusterSummary.group_insight && (
            <p>{truncateSummary(clusterSummary.group_insight, 500)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductClusterSection;
