import React from "react";
import LineChart from "@/components/chart/LineChart";
import { AnalysisResultData } from "../../types/analysis";

interface PredictedSalesSectionProps {
  data: AnalysisResultData;
}

const PredictedSalesSection: React.FC<PredictedSalesSectionProps> = ({
  data
}) => {
  // 예측 매출 데이터
  const predictions =
    data?.auto_analysis_results?.predict?.predictions_30 || {};
  const predictSummary =
    data?.auto_analysis_results?.summaries?.predict_summary || {};

  // 날짜와 매출 데이터 추출
  const labels = Object.keys(predictions).map((date) => {
    // YYYYMMDD 형식의 날짜를 MM/DD 형식으로 변환
    return `${date.slice(4, 6)}/${date.slice(6, 8)}`;
  });

  const salesData = Object.values(predictions);

  const datasets = [
    {
      label: "예측 매출",
      data: salesData,
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.3
    }
  ];

  // 요약 텍스트 축약 함수
  const truncateSummary = (
    summary: string | undefined,
    maxLength = 300
  ): string => {
    if (!summary) return "";
    return summary.length > maxLength
      ? `${summary.substring(0, maxLength)}...`
      : summary;
  };

  // 예측 데이터가 없으면 디버깅 정보 출력 후 빈 컴포넌트 반환
  if (!predictions || Object.keys(predictions).length === 0) {
    console.log("예측 데이터가 없습니다:", {
      predictions,
      autoAnalysisResults: data?.auto_analysis_results
    });

    return (
      <div className="bg-basic-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          30일 매출 예측
        </h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">매출 예측 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        30일 매출 예측
      </h2>
      <div className="mb-4" style={{ width: "100%", height: "350px" }}>
        <LineChart
          labels={labels}
          datasets={datasets}
          yAxisTitle="예상 매출 (원)"
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-base font-medium mb-2 text-comment">예측 분석</h3>
          <p className="text-sm text-comment-text">
            {truncateSummary(predictSummary?.summary)}
          </p>

          {/* 추가 정보가 있는 경우 표시 */}
          {predictSummary?.sales_pattern && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-1">매출 패턴</h4>
              <p className="text-xs text-gray-600">
                {predictSummary.sales_pattern}
              </p>
            </div>
          )}

          {predictSummary?.weekend_effect && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-1">주말 효과</h4>
              <p className="text-xs text-gray-600">
                {predictSummary.weekend_effect}
              </p>
            </div>
          )}

          {predictSummary?.recommendation && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium mb-1">추천 사항</h4>
              <p className="text-xs text-gray-600">
                {predictSummary.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictedSalesSection;
