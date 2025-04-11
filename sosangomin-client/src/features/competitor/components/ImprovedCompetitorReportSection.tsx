// features/competitor/components/ImprovedCompetitorReportSection.tsx
import React, { useState } from "react";
import WordCloud from "@/features/review/components/WordCloud";
import PercentageDoughnutChart from "./PercentageDoughnutChart";
import useStoreStore from "@/store/storeStore";
import { CompetitorComparisonResult } from "@/features/competitor/types/competitor";
import Markdown from "react-markdown";

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
    ? {
        primary: "#1E3A8A", // 진한 파랑
        secondary: "#2563EB", // 중간 파랑
        accent: "#93C5FD" // 밝은 파랑
      }
    : {
        primary: "#ab3030", // 진한 빨강
        secondary: "#DC2626", // 중간 빨강
        accent: "#FCA5A5" // 밝은 빨강
      };

  // 샘플 리뷰 확인
  // 샘플 리뷰 구조는 배열로 되어있음
  const myStoreSampleReviews = data.comparison_data.my_store.sample_reviews || {
    positive: [],
    negative: []
  };
  const competitorSampleReviews = data.comparison_data.competitor
    .sample_reviews || {
    positive: [],
    negative: []
  };

  // 현재 토글 상태에 맞는 리뷰 배열 가져오기
  const filteredMyReviews = showPositive
    ? myStoreSampleReviews.positive
    : myStoreSampleReviews.negative;

  const filteredCompetitorReviews = showPositive
    ? competitorSampleReviews.positive
    : competitorSampleReviews.negative;

  // 리뷰 렌더링 함수 수정 (text 필드 기준으로)
  const renderReview = (review: { text: string }) => {
    const cleanedReview = review.text.endsWith("더보기")
      ? review.text.slice(0, -3)
      : review.text;

    return (
      <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
        <p className="text-sm text-gray-700">{cleanedReview}</p>
      </div>
    );
  };

  const emphasizeQuotedText = (text: string): string => {
    return text
      .replace(/"([^"]+)"/g, (_, quoted) => `**${quoted}**`)
      .replace(/'([^']+)'/g, (_, quoted) => `**${quoted}**`);
  };

  // 마크다운 렌더링을 위한 스타일
  const markdownComponents = {
    h1: (props: any) => (
      <h1 className="text-2xl font-bold my-4 text-bit-main" {...props} />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-semibold my-3 mt-10 text-bit-main"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3 className="text-lg font-medium my-2 text-bit-main" {...props} />
    ),
    p: (props: any) => {
      // 단락 내부의 줄바꿈(\n) 처리를 위한 로직
      if (props.children && typeof props.children === "string") {
        // 줄바꿈을 <br /> 태그로 변환
        const parts = props.children.split("\n");
        if (parts.length > 1) {
          return (
            <p className="my-2 text-base mt-5 text-comment">
              {parts.map((part: any, i: any) => (
                <React.Fragment key={i}>
                  {part}
                  {i < parts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        }
      }
      // 줄바꿈이 없는 일반 텍스트는 그대로 표시
      return <p className="my-2 text-base text-comment" {...props} />;
    },
    ul: (props: any) => (
      <ul className="list-disc ml-5 mb-5 pl-5 my-2" {...props} />
    ),
    ol: (props: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
    li: (props: any) => {
      // 목록 항목 내부의 줄바꿈(\n) 처리
      if (props.children && typeof props.children === "string") {
        const parts = props.children.split("\n");
        if (parts.length > 1) {
          return (
            <li className="my-1">
              {parts.map((part: any, i: any) => (
                <React.Fragment key={i}>
                  {part}
                  {i < parts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </li>
          );
        }
      }
      return <li className="my-1" {...props} />;
    },
    span: (props: any) => <span className="text-sm text-gray-600" {...props} />,
    blockquote: (props: any) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic my-2"
        {...props}
      />
    ),
    // 줄바꿈 태그 처리 (마크다운에서 줄 끝에 공백 두 개로 삽입됨)
    br: (props: any) => <br className="my-1" {...props} />,
    // 코드 블록 스타일링
    code: (props: any) => (
      <code
        className="bg-gray-100 px-1 py-0.5 rounded text-red-600 text-sm"
        {...props}
      />
    ),
    // 강조 스타일링
    strong: (props: any) => (
      <strong className="font-semibold text-gray-900" {...props} />
    ),
    // 이탤릭 스타일링
    em: (props: any) => <em className="italic text-gray-800" {...props} />
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
        <div className="grid grid-cols-12 gap-4 mb-8 md:grid-cols-12 md:grid">
          <div className="col-span-12 md:col-span-5 flex flex-col justify-center items-center">
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

          <div className="hidden md:flex col-span-12 md:col-span-2 items-center justify-center text-center">
            <div className="font-bold text-gray-800">vs</div>
          </div>

          <div className="col-span-12 md:col-span-5 flex flex-col justify-center items-center">
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
        {(myStoreSampleReviews.positive.length +
          myStoreSampleReviews.negative.length >
          0 ||
          competitorSampleReviews.positive.length +
            competitorSampleReviews.negative.length >
            0) && (
          <>
            <div className="hidden md:grid grid-cols-12 gap-6">
              <div className="col-span-5">
                <div className="overflow-auto max-h-64 break-keep">
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
                <div className="overflow-auto max-h-64 break-keep">
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
        <div className="flex flex-col gap-y-10 md:grid md:grid-cols-12 gap-4">
          {/* 내 매장 영역 */}
          <div className="md:col-span-5 flex flex-col items-center">
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
          <div className="hidden md:flex col-span-12 md:col-span-2 items-center justify-center text-center">
            <div className="font-bold text-gray-800">vs</div>
          </div>

          {/* 경쟁사 영역 */}
          <div className="md:col-span-5 flex flex-col items-center">
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
            <div className="bg-blue-50 rounded-lg p-4 break-keep">
              <Markdown components={markdownComponents}>
                {emphasizeQuotedText(data.comparison_insight)}
              </Markdown>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">AI 분석 결과가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default ImprovedCompetitorReportSection;
