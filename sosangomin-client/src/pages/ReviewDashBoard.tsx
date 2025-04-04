// features/review/components/ReviewDashboard.tsx
import React, { useEffect } from "react";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import WordCloud from "../features/review/components/WordCloud";
import { useReviewStore } from "@/store/useReviewStore";
import useStoreStore from "@/store/storeStore";
import Markdown from "react-markdown";

const ReviewDashBoard: React.FC = () => {
  // Zustand store에서 가게 정보 가져오기
  const selectedStore = useStoreStore((state) => state.representativeStore);

  // 리뷰 관련 Zustand store 활용
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

  // 현재 선택된 매장의 분석 목록
  const analysisList = selectedStore?.store_id
    ? analysisListCache[selectedStore.store_id] || []
    : [];

  // 현재 선택된 분석 상세 정보
  const analysisData = selectedAnalysisId
    ? analysisDetailCache[selectedAnalysisId]
    : null;

  // 컴포넌트 마운트 시 기존 분석 결과 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (selectedStore?.store_id) {
        const storeId = selectedStore.store_id;
        const list = await getAnalysisList(storeId);

        // 목록이 있고 최신 ID가 있으면 자동으로 상세정보 가져오기
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

  // 분석 ID 선택 시 해당 분석 상세 정보 로드
  const handleAnalysisChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const analysisId = e.target.value;

    if (analysisId === "") {
      setSelectedAnalysisId(null);
      return;
    }

    setSelectedAnalysisId(analysisId);

    // 캐시에 없는 경우에만 API 호출
    if (!analysisDetailCache[analysisId]) {
      await getAnalysisDetail(analysisId);
    }
  };

  // 새 리뷰 분석 요청
  const handleAnalysis = async () => {
    if (!selectedStore?.store_id || !selectedStore?.place_id) {
      return;
    }

    await requestNewAnalysis(selectedStore.store_id, selectedStore.place_id);
  };

  // 감정 분석 데이터 가공
  const sentimentData = {
    labels: ["긍정", "중립", "부정"],
    datasets: [
      {
        label: "감정 분포",
        data: [
          analysisData?.sentiment_distribution?.positive || 0,
          analysisData?.sentiment_distribution?.neutral || 0,
          analysisData?.sentiment_distribution?.negative || 0
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(255, 99, 132, 0.7)"
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

  // 감정 분석 퍼센티지 계산
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

  // 카테고리 키워드 추출 (음식 카테고리)
  const foodCategoryKeywords =
    analysisData?.category_insights?.음식?.keywords || {};
  const foodKeywordLabels = Object.keys(foodCategoryKeywords);
  const foodKeywordValues = Object.values(foodCategoryKeywords) as number[];

  // 날짜를 한국어 형식으로 변환 (ISO 문자열 -> YYYY년 MM월 DD일)
  // 날짜 포맷팅 함수 - 한국 시간(UTC+9)으로 변환하여 표시
  const formatDateKorean = (dateString: string): string => {
    const date = new Date(dateString);

    // UTC 시간을 한국 시간으로 변환 (UTC+9)
    const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Seoul" // 명시적으로 한국 시간대 설정
    }).format(koreaTime);
  };

  // 선택된 분석의 생성 날짜 찾기
  const getSelectedAnalysisDate = (): string | null => {
    if (!selectedAnalysisId) return null;
    const selectedAnalysis = analysisList.find(
      (item) => item.analysis_id === selectedAnalysisId
    );
    return selectedAnalysis ? selectedAnalysis.created_at : null;
  };

  // 매장 정보가 없는 경우 안내 메시지 표시
  if (!selectedStore) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 rounded-lg">
        <div className="text-center bg-yellow-50 border border-yellow-100 rounded-lg p-8 mb-6">
          <svg
            className="w-12 h-12 text-yellow-400 mx-auto mb-4"
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
      {/* 매장 정보를 별도 영역에 배치 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold">{selectedStore.store_name}</h2>
      </div>
      {/* 리뷰 분석 문구와 버튼을 같은 줄에 정렬 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold">
          네이버 리뷰를 통한{" "}
          <span className="text-xl text-blue-400">손님들이 생각</span>하는 우리
          가게는?
        </h3>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* 분석 결과 선택 드롭다운 */}
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
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          )}

          {/* 분석 버튼 */}
          <button
            onClick={handleAnalysis}
            className="btn bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs disabled:opacity-50 whitespace-nowrap"
            disabled={loading}
          >
            {loading ? "분석 중..." : "리뷰 분석하기"}
          </button>
        </div>
      </div>
      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            개발자 콘솔을 확인하여 자세한 오류 정보를 확인하세요.
          </p>
        </div>
      )}
      {/* 분석 결과가 없고, 로딩 중이 아니고, 에러가 없는 경우 - 가이드 메시지 */}
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
          <p className="text-blue-800 text-lg mb-4">
            아직 리뷰 분석 결과가 없습니다
          </p>
          <p className="text-blue-600 mb-4">
            상단의 [리뷰 분석하기] 버튼을 눌러
            <br />
            고객 리뷰에 대한 AI 분석을 시작해보세요
          </p>
          <p className="text-sm text-blue-500">
            리뷰 분석을 통해 고객이 말하는 우리 가게의 강점과 개선점을 파악할 수
            있습니다
          </p>
        </div>
      )}
      {/* 로딩 중 표시 */}
      {loading && (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6 animate-pulse">
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
          <p className="text-blue-800 text-lg mb-4">네이버 리뷰 분석 중...</p>
          <p className="text-blue-600">
            리뷰 데이터를 수집하고 AI로 분석하는 중입니다.
            <br />
            잠시만 기다려주세요.
          </p>
        </div>
      )}
      {/* 분석 결과 보여주기 */}
      {analysisData && !loading && (
        <>
          {/* 선택된 분석 날짜 표시 */}
          {getSelectedAnalysisDate() && (
            <div className="mb-6 text-right">
              <span className="text-sm text-gray-500">
                분석 날짜:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateKorean(getSelectedAnalysisDate()!)}
                </span>
              </span>
            </div>
          )}

          {/* 워드 클라우드 */}
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

          {/* 요약 지표 */}
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

          {/* 차트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-basic-white p-4 rounded-md shadow">
              <h2 className="text-lg font-bold mb-4 text-comment">
                감정 분석 분포
              </h2>
              <div className="w-80 h-80 mx-auto">
                <DoughnutChart chartData={sentimentData} />
              </div>
            </div>

            <div className="bg-basic-white p-4 rounded-md shadow">
              <h2 className="text-lg font-bold mb-4 text-comment">
                카테고리별 긍정 리뷰 수
              </h2>
              <BarChart
                labels={foodKeywordLabels}
                datasets={[
                  {
                    label: "음식 카테고리 키워드",
                    data: foodKeywordValues,
                    backgroundColor: "rgba(54, 162, 235, 0.7)"
                  }
                ]}
                height={300}
                xAxisLabel="키워드"
                yAxisLabel="빈도"
              />
            </div>
          </div>

          {/* 리포트 */}
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
