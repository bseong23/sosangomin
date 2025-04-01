// features/competitor/pages/ReviewCompare.tsx

import React, { useState } from "react";
import { requestCompetitorAnalysis } from "@/features/review/api/competitorApi";
import CompareSummary from "@/features/review/components/CompareSummary";
import SentimentComparisonChart from "@/features/review/components/SentimentComparisonChart";
import WordCloudComparison from "@/features/review/components/WordCloudComparison";
import InsightSummary from "@/features/review/components/InsightSummary";
import SampleReviewList from "@/features/review/components/SampleReviewList";
import SearchableMap from "@/components/modal/SearchableMap";

// 🟣 API 리턴 타입 import
import { CompetitorComparisonResult } from "@/features/review/types/competitor";

const ReviewCompare: React.FC = () => {
  const [competitor, setCompetitor] = useState<any>(null);
  const [comparisonData, setComparisonData] =
    useState<CompetitorComparisonResult | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myStoreId = 1; // 임시 매장 ID

  // competitor 선택 핸들러
  const handleSelectCompetitor = (location: any) => {
    setCompetitor(location); // SearchableMap이 넘겨주는 location이 competitor 역할
  };

  // 분석 요청
  const handleAnalyze = async () => {
    if (!competitor) return;
    setLoading(true);
    setError(null);
    setComparisonData(null);

    try {
      const res = await requestCompetitorAnalysis({
        store_id: myStoreId,
        competitor_name: competitor.place_name
      });

      if ("error" in res) {
        setError(res.message || "분석 실패");
      } else {
        setComparisonData(res.comparisonResult);
        if (res.comparisonResult?.comparison_data?.comparison_insight) {
          setInsights([
            res.comparisonResult.comparison_data.comparison_insight
          ]);
        }
      }
    } catch (e) {
      setError("알 수 없는 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-bold mb-4">경쟁사 리뷰 분석 비교</h2>

      {/* 검색 가능한 지도 */}
      <div className="space-y-2">
        <SearchableMap
          width="300px"
          height="300px"
          onSelectLocation={handleSelectCompetitor}
        />
      </div>

      {/* 선택된 경쟁사 표시 */}
      {competitor && (
        <div className="text-sm text-gray-700">
          선택된 경쟁사: <strong>{competitor.name}</strong>
        </div>
      )}

      {/* 분석 버튼 */}
      {competitor && (
        <button
          className="mt-4 bg-bit-main text-white px-4 py-2 rounded hover:bg-blue-800"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "분석중..." : "경쟁사 분석 시작"}
        </button>
      )}

      {/* 로딩 */}
      {loading && (
        <p className="text-center text-sm text-gray-500 mt-4">
          분석중입니다... ⏳
        </p>
      )}

      {/* 에러 */}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {/* 분석 결과 */}
      {!loading && comparisonData && (
        <>
          <CompareSummary
            myStore={comparisonData.comparison_data.my_store}
            competitor={comparisonData.comparison_data.competitor}
          />

          <SentimentComparisonChart
            myStore={comparisonData.comparison_data.my_store}
            competitor={comparisonData.comparison_data.competitor}
          />

          <WordCloudComparison
            myStoreWords={
              comparisonData.comparison_data.word_cloud_comparison.my_store
                .positive_words
            }
            competitorWords={
              comparisonData.comparison_data.word_cloud_comparison.competitor
                .positive_words
            }
          />

          <InsightSummary
            insights={insights.length > 0 ? insights : ["인사이트 없음"]}
          />

          <SampleReviewList
            myStoreReviews={
              comparisonData.comparison_data.my_store.sample_reviews
            }
            competitorReviews={
              comparisonData.comparison_data.competitor.sample_reviews
            }
          />
        </>
      )}
    </div>
  );
};

export default ReviewCompare;
