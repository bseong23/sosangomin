// features/review/components/ReviewDashboard.tsx
import React, { useEffect } from "react";
import BarChart from "@/components/chart/BarChart";
import WordCloud from "../features/review/components/WordCloud";
import { useReviewStore } from "@/store/useReviewStore";
import useStoreStore from "@/store/storeStore";
import Markdown from "react-markdown";

const ReviewDashBoard: React.FC = () => {
  const selectedStore = useStoreStore((state) => state.representativeStore);

  const {
    loading,
    error,
    analysisListCache,
    analysisDetailCache,
    selectedAnalysisId,
    getAnalysisList,
    getAnalysisDetail,
    requestNewAnalysis,
    setSelectedAnalysisId
  } = useReviewStore();

  const analysisList = selectedStore?.store_id
    ? analysisListCache[selectedStore.store_id] || []
    : [];

  const analysisData = selectedAnalysisId
    ? analysisDetailCache[selectedAnalysisId]
    : null;

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStore?.store_id) {
        const storeId = selectedStore.store_id;
        const list = await getAnalysisList(storeId);
        if (list.length > 0) {
          const latestId = list[0].analysis_id;
          setSelectedAnalysisId(latestId);
          if (!analysisDetailCache[latestId]) {
            await getAnalysisDetail(latestId);
          }
        }
      }
    };
    fetchData();
  }, [selectedStore?.store_id]);

  const handleAnalysisChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const analysisId = e.target.value;
    if (analysisId === "") {
      setSelectedAnalysisId(null);
      return;
    }
    setSelectedAnalysisId(analysisId);
    if (!analysisDetailCache[analysisId]) {
      await getAnalysisDetail(analysisId);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedStore?.store_id || !selectedStore?.place_id) {
      return;
    }
    await requestNewAnalysis(selectedStore.store_id, selectedStore.place_id);
  };

  const total =
    (analysisData?.sentiment_distribution?.positive || 0) +
      (analysisData?.sentiment_distribution?.neutral || 0) +
      (analysisData?.sentiment_distribution?.negative || 0) || 1;

  const percentages = {
    positive: (
      ((analysisData?.sentiment_distribution?.positive || 0) / total) *
      100
    ).toFixed(1),
    neutral: (
      ((analysisData?.sentiment_distribution?.neutral || 0) / total) *
      100
    ).toFixed(1),
    negative: (
      ((analysisData?.sentiment_distribution?.negative || 0) / total) *
      100
    ).toFixed(1)
  };

  const formatDateKorean = (dateString: string): string => {
    const date = new Date(dateString);
    const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Seoul"
    }).format(koreaTime);
  };

  if (!selectedStore) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 rounded-lg">
        <div className="text-center bg-yellow-50 border border-yellow-100 rounded-lg p-8 mb-6">
          <svg
            className="w-12 h-12 text-yellow-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-yellow-800 text-lg mb-4">
            대표 매장이 설정되지 않았습니다
          </p>
          <p className="text-yellow-600">
            마이페이지에서 대표 매장을 설정한 후 이용해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 rounded-lg">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedStore.store_name}</h2>
        <button
          onClick={handleAnalysis}
          className="btn bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs disabled:opacity-50 whitespace-nowrap"
          disabled={loading}
        >
          {loading ? "분석 중..." : "리뷰 분석하기"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-15 gap-4">
        <h3 className="text-lg font-bold">
          네이버 리뷰를 통한{" "}
          <span className="text-xl text-blue-400">손님들이 생각</span>하는 우리
          가게는?
        </h3>
        {analysisList.length > 0 && (
          <div className="relative">
            <select
              value={selectedAnalysisId || ""}
              onChange={handleAnalysisChange}
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">분석 날짜 선택</option>
              {analysisList.map((item) => (
                <option key={item.analysis_id} value={item.analysis_id}>
                  {formatDateKorean(item.created_at)} 분석
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        )}
      </div>

      {!analysisData && !loading && !error && (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6">
          <p className="text-blue-800 text-lg mb-4">
            아직 리뷰 분석 결과가 없습니다
          </p>
          <p className="text-blue-600 mb-4">
            상단의 [리뷰 분석하기] 버튼을 눌러 고객 리뷰에 대한 AI 분석을
            시작해보세요
          </p>
          <p className="text-sm text-blue-500">
            리뷰 분석을 통해 고객이 말하는 우리 가게의 강점과 개선점을 파악할 수
            있습니다
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6 animate-pulse">
          <p className="text-blue-800 text-lg mb-4">네이버 리뷰 분석 중...</p>
          <p className="text-blue-600">
            리뷰 데이터를 수집하고 AI로 분석하는 중입니다. 잠시만 기다려주세요.
          </p>
        </div>
      )}

      {analysisData && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <WordCloud
              words={analysisData.word_cloud_data?.positive_words || {}}
              title="긍정적 키워드"
              colors={{ primary: "#1E40AF", secondary: "#3056D3" }}
              maxWords={15}
            />
            <WordCloud
              words={analysisData.word_cloud_data?.negative_words || {}}
              title="부정적 키워드"
              colors={{ primary: "#B91C1C", secondary: "#EF4444" }}
              maxWords={15}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
              <p className="text-sm text-comment-text">긍정 리뷰 비율</p>
              <p className="text-2xl font-bold text-blue-500">
                {percentages.positive}%
              </p>
            </div>
            <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
              <p className="text-sm text-comment-text">중립 리뷰 비율</p>
              <p className="text-2xl font-bold text-green-600">
                {percentages.neutral}%
              </p>
            </div>
            <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
              <p className="text-sm text-comment-text">부정 리뷰 비율</p>
              <p className="text-2xl font-bold text-red-600">
                {percentages.negative}%
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* ✅ 왼쪽 바 차트 */}
            <div className="md:w-2/3 w-full bg-white border border-gray-100 p-5 rounded-lg shadow">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                카테고리별 긍정 리뷰 수
              </h2>
              <BarChart
                labels={Object.keys(analysisData.category_insights || {})}
                datasets={[
                  {
                    label: "긍정 리뷰 수",
                    data: Object.values(
                      analysisData.category_insights || {}
                    ).map((item: any) => item.positive || 0),
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                  }
                ]}
                height={300}
                xAxisLabel="카테고리"
                yAxisLabel="긍정 수"
              />
            </div>

            {/* ✅ 오른쪽 요약 카드 (심플하게) */}
            <div className="md:w-1/3 w-full flex flex-col gap-2">
              <h3 className="text-sm font-medium text-gray-700 mb-1 pl-1">
                카테고리별 요약
              </h3>
              {Object.entries(analysisData?.category_insights || {}).map(
                ([category, values]: any, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-800 font-medium">
                      {category}
                    </span>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      👍 {values.positive} / 👎 {values.negative}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* ✅ 인사이트 리포트 */}
          <div className="bg-basic-white p-6 rounded-md shadow mb-6 whitespace-pre-wrap">
            <h2 className="text-lg font-bold text-comment mb-4">
              리뷰 분석 리포트
            </h2>
            {typeof analysisData.insights === "string" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {(() => {
                  const raw = analysisData.insights as string;
                  const parts = raw.split(/##\s[1-3]\.\s/);

                  if (parts.length < 4) {
                    return (
                      <div className="col-span-full text-red-500">
                        분석 리포트 형식이 올바르지 않아요 🥲
                      </div>
                    );
                  }

                  const sections = [
                    {
                      title: "1. 고객들이 가장 만족하는 점",
                      content: parts[1],
                      color: "text-green-700",
                      bg: "bg-green-50"
                    },
                    {
                      title: "2. 개선이 필요한 부분",
                      content: parts[2],
                      color: "text-yellow-700",
                      bg: "bg-yellow-50"
                    },
                    {
                      title: "3. 매장 운영에 도움이 될만한 구체적인 제안",
                      content: parts[3],
                      color: "text-blue-700",
                      bg: "bg-blue-50"
                    }
                  ];

                  return sections.map((section, idx) => (
                    <div
                      key={idx}
                      className={`${section.bg} p-4 rounded-lg shadow text-xs whitespace-pre-wrap`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-2 ${section.color}`}
                      >
                        {section.title}
                      </h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {section.content
                          .split("\n")
                          .filter(
                            (line: string) =>
                              line.trim() &&
                              !line.trim().startsWith("###") &&
                              !/^[0-9]+\./.test(line.trim())
                          )
                          .map((line: string, i: number) => (
                            <Markdown key={i}>
                              {line.replace(/^[-*]\s?/, "").trim()}
                            </Markdown>
                          ))}
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewDashBoard;
