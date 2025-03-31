// src/pages/ReviewInsightPage.tsx

import React from "react";
import { useParams } from "react-router-dom";
import LineChart from "@/components/chart/LineChart";
import { useReviewAnalysis } from "@/features/review/hooks/useReviewAnalysis";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/features/review/components/ErrorMessage";

const ReviewInsightPage: React.FC = () => {
  // URL 파라미터에서 분석 ID 가져오기 (옵션)
  const { analysisId } = useParams<{ analysisId?: string }>();

  // 기본 스토어 ID (실제 환경에서는 사용자의 매장 ID를 가져와야 함)
  const defaultStoreId = 1;

  // 리뷰 분석 훅 사용
  const { loading, error, analysisResult } = useReviewAnalysis(
    analysisId,
    defaultStoreId
  );

  // 요일별 레이블 설정 - 기본값
  const defaultLabels = [
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
    "일요일"
  ];

  // 데이터셋 정의 - 기본값
  const defaultDatasets = [
    {
      label: "이번 주 매출",
      data: [120, 145, 138, 156, 210, 252, 198],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      tension: 0.3
    },
    {
      label: "지난 주 매출",
      data: [132, 128, 142, 150, 198, 235, 182],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.3
    }
  ];

  // API 응답에서 데이터 추출 (있을 경우)
  const labels = analysisResult?.insights?.sales_trend?.labels || defaultLabels;
  const datasets =
    analysisResult?.insights?.sales_trend?.datasets || defaultDatasets;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold ml-4 mt-4">매장 매출 분석</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="bg-white px-10 py-6 mt-4 rounded-lg shadow">
          <LineChart
            title="요일별 매출 현황"
            labels={labels}
            datasets={datasets}
            yAxisTitle="매출 (만원)"
          />

          {analysisResult?.insights?.sales_insights && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-700 mb-3">
                매출 인사이트
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                {analysisResult.insights.sales_insights.map(
                  (insight: string, idx: number) => (
                    <li key={idx}>{insight}</li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewInsightPage;
