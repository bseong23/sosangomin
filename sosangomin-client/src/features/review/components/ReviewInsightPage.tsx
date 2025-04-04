import React from "react";
import { useParams } from "react-router-dom";
import LineChart from "@/components/chart/LineChart";
import { useReviewAnalysis } from "@/features/review/hooks/useReviewAnalysis";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/features/review/components/ErrorMessage";

const ReviewInsightPage: React.FC = () => {
  const { analysisId } = useParams<{
    analysisId?: string;
    placeId?: string;
  }>();

  const { loading, error, analysisResult } = useReviewAnalysis(analysisId);

  const labels = analysisResult?.insights?.sales_trend?.labels;
  const datasets = analysisResult?.insights?.sales_trend?.datasets;
  const insights = analysisResult?.insights?.sales_insights;

  return (
    <div className="container mx-auto min-h-[500px]">
      <h1 className="text-2xl font-bold ml-4 mt-4">매장 매출 분석</h1>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (!labels || !datasets) && (
        <ErrorMessage message="분석된 데이터가 없습니다." />
      )}
      {!loading && !error && labels && datasets && (
        <div className="bg-white px-10 py-6 mt-4 rounded-lg shadow">
          <LineChart
            title="요일별 매출 현황"
            labels={labels}
            datasets={datasets}
            yAxisTitle="매출 (만원)"
          />

          {insights && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">
                매출 인사이트
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                {insights.map((insight: string, idx: number) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewInsightPage;
