// features/review/components/ReviewDashboard.tsx
import React, { useEffect, useState, useMemo } from "react";
import BarChart from "@/components/chart/BarChart";
import WordCloud from "../features/review/components/WordCloud";
import { useReviewStore } from "@/store/useReviewStore";
import useStoreStore from "@/store/storeStore";
import Markdown from "react-markdown";
import Loading from "@/components/common/Loading";

const ReviewDashBoard: React.FC = () => {
  const selectedStore = useStoreStore((state) => state.representativeStore);
  // 초기 데이터 로딩 상태를 추적하기 위한 state
  const [initialLoading, setInitialLoading] = useState(false);

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

  // 오늘 날짜 분석이 있는지 확인하는 로직
  const todayAnalysis = useMemo(() => {
    if (!analysisList || analysisList.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 00:00:00 시간으로 설정

    // 오늘 날짜에 생성된 분석 찾기
    return analysisList.find((analysis) => {
      const analysisDate = new Date(analysis.created_at);
      analysisDate.setHours(0, 0, 0, 0); // 분석 날짜도 00:00:00 시간으로 설정하여 날짜만 비교
      return analysisDate.getTime() === today.getTime();
    });
  }, [analysisList]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedStore?.store_id) {
        setInitialLoading(true); // 초기 데이터 로딩 시작
        try {
          const storeId = selectedStore.store_id;
          const list = await getAnalysisList(storeId);
          if (list.length > 0) {
            // 오늘 분석이 있으면 오늘 분석을 보여주고, 없으면 아무것도 선택하지 않음
            const todayAnalysis = list.find((item) => {
              const itemDate = new Date(item.created_at);
              const today = new Date();
              return (
                itemDate.getDate() === today.getDate() &&
                itemDate.getMonth() === today.getMonth() &&
                itemDate.getFullYear() === today.getFullYear()
              );
            });

            // 오늘 분석이 있는 경우에만 자동으로 선택
            if (todayAnalysis) {
              setSelectedAnalysisId(todayAnalysis.analysis_id);

              // 상세 정보 불러오기
              if (!analysisDetailCache[todayAnalysis.analysis_id]) {
                await getAnalysisDetail(todayAnalysis.analysis_id);
              }
            } else {
              // 오늘 분석이 없는 경우 선택된 분석 ID 초기화
              setSelectedAnalysisId(null);
            }
          } else {
            // 분석 데이터가 없는 경우 선택된 분석 ID 초기화
            setSelectedAnalysisId(null);
          }
        } catch (error) {
          console.error("데이터 로딩 중 오류 발생:", error);
        } finally {
          setInitialLoading(false); // 초기 데이터 로딩 완료
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
      timeZone: "Asia/Seoul"
    }).format(koreaTime);
  };

  // 오늘 날짜인지 확인하는 함수
  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // 초기 로딩 중에는 Loading 컴포넌트만 표시
  if (initialLoading) {
    return (
      <div className="max-w-[1000px] mx-auto p-4 md:p-6 rounded-lg">
        <Loading />
      </div>
    );
  }

  // 매장이 등록되어 있지 않은 경우
  if (!selectedStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-basic-white rounded-lg shadow-2xl p-8 max-w-md text-center border border-gray-200">
          <svg
            className="w-16 h-16 text-bit-main mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-bit-main mb-4">
            등록된 매장이 없습니다
          </h2>
          <p className="text-comment mb-6">
            분석 보고서를 생성하기 위해서는 매장 등록이 필요합니다.
          </p>
          <a
            href="/mypage" // 매장 등록 페이지 경로로 수정
            className="inline-block py-3 px-6 bg-bit-main text-basic-white rounded-md hover:bg-opacity-90 transition duration-200"
          >
            매장 등록하기
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-6 rounded-lg">
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

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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
              className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="">분석 날짜 선택</option>
              {analysisList.map((item) => (
                <option key={item.analysis_id} value={item.analysis_id}>
                  {formatDateKorean(item.created_at)} 분석
                  {isToday(item.created_at) && " (오늘)"}
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

      {/* 분석 데이터가 없고, 로딩 중도 아닌 경우 안내 메시지 표시 */}
      {!analysisData && !loading && !error && (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6">
          <svg
            className="w-12 h-12 text-blue-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-blue-600 text-semibold text-lg mb-4">
            <span className="font-semibold">
              {todayAnalysis ? "" : "[리뷰 분석하기]"}
            </span>
            {todayAnalysis
              ? "오늘 분석한 결과를 불러오는 중입니다."
              : " 버튼을 눌러 "}
            <br />
            {todayAnalysis ? "" : "오늘의 우리 매장 리뷰 분석을 시작해보세요."}
          </p>
          <p className="text-blue-500 text-base mb-4">
            <span className="font-semibold"></span>
            {todayAnalysis
              ? "잠시만 기다려주세요."
              : " 이전에 분석했던 기록은 상단 목록에서 조회해 보세요."}
          </p>
          <p className="text-sm text-blue-500">
            {todayAnalysis
              ? "리뷰 분석을 통해 고객이 말하는 우리 가게의 강점과 개선점을 파악할 수 있습니다."
              : ""}
          </p>
        </div>
      )}

      {/* 새로운 분석 요청 중일 때는 기존 SVG 로딩 UI 사용 */}
      {loading && (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6 animate-pulse">
          {/* 로딩 아이콘 */}
          <svg
            className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>

          {/* 매장 이름 포함한 로딩 텍스트 */}
          <p className="text-blue-800 text-lg mb-4">
            {selectedStore?.store_name
              ? `'${selectedStore.store_name}' 리뷰 분석 중...`
              : "리뷰 분석 중..."}
          </p>
          <p className="text-blue-600">
            리뷰 데이터를 수집하고 AI로 분석하는 중입니다.
            <br />
            정확한 분석을 위해 약 1분 ~ 2분 정도 소요될 수 있습니다.
            <br />
            잠시만 기다려주세요.
          </p>
        </div>
      )}

      {analysisData && !loading && (
        <>
          {/* ✅ 워드클라우드 섹션 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="mt-4 flex justify-end gap-4 text-sm text-gray-600 px-3">
              <span>
                <span className="text-blue-500 font-semibold">
                  {percentages.positive}%
                </span>{" "}
                긍정
              </span>
              <span>
                <span className="text-green-600 font-semibold">
                  {percentages.neutral}%
                </span>{" "}
                중립
              </span>
              <span>
                <span className="text-red-600 font-semibold">
                  {percentages.negative}%
                </span>{" "}
                부정
              </span>
            </div>
          </div>

          {/* ✅ 바 차트 + 요약 카드 섹션 */}
          <h2 className="text-lg font-bold text-comment mb-4">
            카테고리별 긍정/부정 리뷰 수
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 border rounded-xl border-gray-100 p-6 shadow-sm bg-white">
              <BarChart
                labels={Object.keys(analysisData.category_insights || {})}
                datasets={[
                  {
                    label: "긍정 리뷰 수",
                    data: Object.values(
                      analysisData.category_insights || {}
                    ).map((item: any) => item.positive || 0),
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                  },
                  {
                    label: "부정 리뷰 수",
                    data: Object.values(
                      analysisData.category_insights || {}
                    ).map((item: any) => item.negative || 0),
                    backgroundColor: "rgba(255, 99, 132, 0.7)"
                  }
                ]}
                customOptions={{
                  scales: {
                    y: {
                      min: 0 // Y축 최소값을 0으로 설정
                    }
                  }
                }}
                height={300}
                xAxisLabel="카테고리"
                yAxisLabel="리뷰 수"
              />
            </div>

            <div className="border rounded-xl border-gray-100 p-6 shadow-sm bg-white flex flex-col">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                카테고리 요약
              </h3>
              <div className="flex flex-col gap-2">
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
          </div>

          {/* ✅ 인사이트 리포트 */}
          <h2 className="text-lg font-bold text-comment mb-4">
            리뷰 분석 리포트
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {typeof analysisData.insights === "string" && (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-1">
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
                      className={`${section.bg} p-4 rounded-lg shadow text-xs whitespace-pre-wrap break-keep`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-6 ${section.color}`}
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
                              !/^[0-9]+\./.test(line.trim()) &&
                              ![
                                "고객들이 가장 만족하는 점",
                                "개선이 필요한 부분",
                                "매장 운영에 도움이 될만한 구체적인 제안"
                              ].includes(line.trim())
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
