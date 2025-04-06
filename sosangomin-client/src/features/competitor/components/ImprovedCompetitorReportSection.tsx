// features/competitor/components/ImprovedCompetitorReportSection.tsx
import React, { useState } from "react";
import WordCloud from "@/features/review/components/WordCloud";
import PercentageDoughnutChart from "./PercentageDoughnutChart";
import useStoreStore from "@/store/storeStore";
import { CompetitorComparisonResult } from "@/features/competitor/types/competitor";

interface ImprovedCompetitorReportSectionProps {
  data: CompetitorComparisonResult;
}

interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

const filterWords = (words: Record<string, number>, exclude: string[]) => {
  return Object.fromEntries(
    Object.entries(words).filter(([word]) => !exclude.includes(word))
  );
};

const ImprovedCompetitorReportSection: React.FC<
  ImprovedCompetitorReportSectionProps
> = ({ data }) => {
  // representativeStore에서 정보 가져오기
  const representativeStore = useStoreStore(
    (state) => state.representativeStore
  );

  if (!data) return null;

  // 워드클라우드 토글 상태 관리
  const [showPositive, setShowPositive] = useState(true);

  // 제외할 단어 목록
  const excludeWords = ["보기", "여자", "남자"];

  const makeSentimentData = (distribution: SentimentDistribution) => {
    return {
      labels: ["긍정", "중립", "부정"],
      datasets: [
        {
          data: [
            distribution.positive,
            distribution.neutral,
            distribution.negative
          ],
          backgroundColor: [
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 99, 132, 0.6)"
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 99, 132, 1)"
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // 현재 토글 상태에 따라 표시할 단어들 필터링
  const filteredMyStoreWords = showPositive
    ? filterWords(
        data.comparison_data.word_cloud_comparison.my_store.positive_words,
        excludeWords
      )
    : filterWords(
        data.comparison_data.word_cloud_comparison.my_store.negative_words,
        excludeWords
      );

  const filteredCompetitorWords = showPositive
    ? filterWords(
        data.comparison_data.word_cloud_comparison.competitor.positive_words,
        excludeWords
      )
    : filterWords(
        data.comparison_data.word_cloud_comparison.competitor.negative_words,
        excludeWords
      );

  // 색상 설정
  const colorMap = showPositive
    ? { primary: "#1E40AF", secondary: "#3B82F6" } // 긍정(파란색)
    : { primary: "#B91C1C", secondary: "#EF4444" }; // 부정(빨간색)

  // 샘플 리뷰 확인
  // 샘플 리뷰 구조는 배열로 되어있음
  const myStoreSampleReviews =
    data.comparison_data.my_store.sample_reviews || [];
  const competitorSampleReviews =
    data.comparison_data.competitor.sample_reviews || [];

  // 현재 토글 상태에 맞는 리뷰만 필터링 (임시 로직)
  // 실제 API에서 positive/negative 속성을 제공하지 않으므로 임의로 구분
  // 긍정/부정 리뷰를 구분하는 로직은 실제 데이터 구조에 맞게 수정 필요
  const getFilteredReviews = (reviews: string[]) => {
    if (!reviews || reviews.length === 0) return [];

    // 토글 상태가 긍정이면 리뷰의 앞부분을, 부정이면 뒷부분을 보여주는 임시 로직
    // 실제로는 API에서 긍정/부정 구분된 리뷰를 제공해야 함
    if (showPositive) {
      return reviews.slice(0, Math.ceil(reviews.length * 0.7)); // 앞 70%를 긍정으로 가정
    } else {
      return reviews.slice(Math.ceil(reviews.length * 0.7)); // 뒤 30%를 부정으로 가정
    }
  };

  const filteredMyReviews = getFilteredReviews(myStoreSampleReviews);
  const filteredCompetitorReviews = getFilteredReviews(competitorSampleReviews);

  // 리뷰 렌더링 함수
  const renderReview = (review: string) => {
    const cleanedReview = review.endsWith("더보기")
      ? review.slice(0, -3)
      : review;

    return (
      <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
        <p className="text-sm text-gray-700">{cleanedReview}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 토글 방식 워드클라우드 및 샘플 리뷰 */}
      <h2 className="text-lg font-bold mb-4 text-gray-800">
        리뷰 주요 키워드 비교
      </h2>
      <section className="bg-white p-6 rounded-xl shadow border border-gray-100">
        {/* 토글 버튼 */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setShowPositive(true)}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                showPositive
                  ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              긍정 키워드
            </button>
            <button
              type="button"
              onClick={() => setShowPositive(false)}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                !showPositive
                  ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              부정 키워드
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center mb-6">
          <p>키워드 크기는 해당 단어가 리뷰에서 언급된 빈도를 나타냅니다</p>
        </div>

        {/* 워드클라우드 비교 영역 */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-5 flex flex-col justify-center items-center">
            <div className="font-bold text-xl text-bit-main mb-2">
              {representativeStore?.store_name || "내 매장"}
            </div>
            <WordCloud
              words={filteredMyStoreWords}
              colors={colorMap}
              maxWords={15}
              height="h-64"
            />
          </div>

          <div className="col-span-2 flex items-center justify-center text-center">
            <div className="font-bold text-gray-800">vs</div>
          </div>

          <div className="col-span-5 flex flex-col justify-center items-center">
            <div className="font-bold text-xl text-bit-main mb-2">
              {data.comparison_data.competitor.name}
            </div>
            <WordCloud
              words={filteredCompetitorWords}
              colors={colorMap}
              maxWords={15}
              height="h-64"
            />
          </div>
        </div>

        {/* 샘플 리뷰 표시 영역 */}
        {(myStoreSampleReviews.length > 0 ||
          competitorSampleReviews.length > 0) && (
          <>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-5">
                <div className="overflow-auto max-h-64">
                  {filteredMyReviews.length > 0 ? (
                    filteredMyReviews.map((review, index) => (
                      <div key={`my-${index}`}>{renderReview(review)}</div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">
                      표시할 리뷰가 없습니다.
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <h3 className="text-md font-bold text-gray-700 mb-4 mt-6 text-center">
                  {showPositive ? "긍정 리뷰" : "부정 리뷰"}
                </h3>
              </div>

              <div className="col-span-5">
                <div className="overflow-auto max-h-64">
                  {filteredCompetitorReviews.length > 0 ? (
                    filteredCompetitorReviews.map((review, index) => (
                      <div key={`comp-${index}`}>{renderReview(review)}</div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-4">
                      표시할 리뷰가 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 감정 분포 비교 */}
      <h2 className="text-lg font-bold mb-4 text-gray-800">감정 분포 비교</h2>
      <section className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <div className="grid grid-cols-12 gap-4">
          {/* 내 매장 영역 */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="font-bold text-lg text-bit-main mb-2">
              {representativeStore?.store_name || "내 매장"}
            </div>
            <PercentageDoughnutChart
              chartData={makeSentimentData(
                data.comparison_data.my_store.sentiment_distribution
              )}
            />
            <div className="mt-2 text-sm text-bit-main font-semibold">
              긍정 리뷰 비율:{" "}
              {data.comparison_data.my_store.positive_rate.toFixed(1)}%
            </div>
          </div>

          {/* 중앙 'vs' */}
          <div className="col-span-2 flex items-center justify-center text-center">
            <div className="font-bold text-gray-800">vs</div>
          </div>

          {/* 경쟁사 영역 */}
          <div className="col-span-5 flex flex-col items-center">
            <div className="font-bold text-bit-main text-lg mb-2">
              {data.comparison_data.competitor.name}
            </div>
            <PercentageDoughnutChart
              chartData={makeSentimentData(
                data.comparison_data.competitor.sentiment_distribution
              )}
            />
            <div className="mt-2 text-sm text-bit-main font-semibold">
              긍정 리뷰 비율:{" "}
              {data.comparison_data.competitor.positive_rate.toFixed(1)}%
            </div>
          </div>
        </div>
      </section>

      {/* AI 인사이트 */}
      <h2 className="text-lg font-bold mb-4 text-gray-800">AI 분석 요약</h2>
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {data.comparison_insight ? (
          <div className="prose max-w-none">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-blue-100 p-4 rounded-lg">
              {data.comparison_insight}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">AI 분석 결과가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default ImprovedCompetitorReportSection;
