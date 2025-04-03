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

  // 예측 데이터가 없으면 디버깅 정보 출력 후 빈 컴포넌트 반환
  if (!predictions || Object.keys(predictions).length === 0) {
    console.log("예측 데이터가 없습니다:", {
      predictions,
      autoAnalysisResults: data?.auto_analysis_results
    });

    return (
      <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
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
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-10">
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
        <div className="grid grid-cols-4 gap-10 bg-white rounded-lg">
          <div className="flex flex-col">
            <h4 className="text-sm text-center px-6 font-medium mb-1">
              예측 분석
            </h4>
            <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
              {predictSummary?.summary}
            </p>
          </div>

          {predictSummary?.sales_pattern && (
            <div className="flex flex-col">
              <h4 className="text-sm text-center px-6 font-medium mb-1">
                매출 패턴
              </h4>
              <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
                {predictSummary.sales_pattern}
              </p>
            </div>
          )}

          {predictSummary?.weekend_effect && (
            <div className="flex flex-col">
              <h4 className="text-sm text-center px-6 font-medium mb-1">
                주말 효과
              </h4>
              <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
                {predictSummary.weekend_effect}
              </p>
            </div>
          )}

          {predictSummary?.recommendation && (
            <div className="flex flex-col">
              <h4 className="text-sm text-center px-6 font-medium mb-1">
                추천 사항
              </h4>
              <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
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
