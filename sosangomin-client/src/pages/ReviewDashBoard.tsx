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
  // GET 요청 로딩 상태를 추적하기 위한 state
  const [isGetLoading, setIsGetLoading] = useState(false);

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

  const markdownComponents = {
    h1: (props: any) => (
      <h1 className="text-2xl font-bold my-4 text-bit-main" {...props} />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-semibold my-3 mb-5 text-bit-main"
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
            <p className="my-2 text-base text-comment">
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

    // GET 요청 로딩 상태 설정
    if (!analysisDetailCache[analysisId]) {
      setIsGetLoading(true);
      try {
        await getAnalysisDetail(analysisId);
      } finally {
        setIsGetLoading(false);
      }
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

  // 초기 로딩 또는 GET 요청 로딩 중에는 Loading 컴포넌트만 표시
  if (initialLoading || isGetLoading) {
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
              className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bit-main shadow-sm"
            >
              <option value="">분석 날짜 선택</option>
              {analysisList.map((item) => (
                <option key={item.analysis_id} value={item.analysis_id}>
                  {formatDateKorean(item.created_at)}
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

          {/* ✅ 인사이트 리포트 - 줄바꿈 처리 개선 */}
          <h2 className="text-lg font-bold text-comment mb-4">
            리뷰 분석 리포트
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {typeof analysisData.insights === "string" && (
              <div className="grid grid-cols-1 gap-6 mt-2">
                {(() => {
                  const raw = analysisData.insights as string;

                  // 파싱할 섹션 제목
                  const sectionTitles = [
                    "고객들이 가장 만족하는 점",
                    "개선이 필요한 부분",
                    "매장 운영에 도움이 될만한 구체적인 제안"
                  ];

                  // 섹션 스타일
                  const sectionStyles = [
                    {
                      color: "text-emerald-700",
                      bg: "bg-emerald-50",
                      border: "border-emerald-200",
                      icon: (
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                      )
                    },
                    {
                      color: "text-amber-700",
                      bg: "bg-amber-50",
                      border: "border-amber-200",
                      icon: (
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      )
                    },
                    {
                      color: "text-blue-700",
                      bg: "bg-blue-50",
                      border: "border-blue-200",
                      icon: (
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      )
                    }
                  ];

                  // 각 섹션의 내용 추출
                  const sections = [];

                  for (let i = 0; i < sectionTitles.length; i++) {
                    const title = sectionTitles[i];

                    try {
                      // 글자 앞에 숫자가 있는 경우도 포함하여 패턴 매치
                      const titlePattern = new RegExp(
                        `(?:##\\s*)?(?:\\d+\\.?\\s*)?${title}`,
                        "i"
                      );
                      const titleMatch = raw.match(titlePattern);

                      // 매치가 있고 인덱스가 유효한 경우만 처리
                      if (titleMatch && titleMatch.index !== undefined) {
                        const startIndex = titleMatch.index;
                        let endIndex;

                        // 다음 섹션 찾기
                        if (i < sectionTitles.length - 1) {
                          const nextTitle = sectionTitles[i + 1];
                          const nextTitlePattern = new RegExp(
                            `(?:##\\s*)?(?:\\d+\\.?\\s*)?${nextTitle}`,
                            "i"
                          );
                          const remainingText = raw.slice(startIndex);
                          const nextTitleMatch =
                            remainingText.match(nextTitlePattern);

                          if (
                            nextTitleMatch &&
                            nextTitleMatch.index !== undefined
                          ) {
                            endIndex = startIndex + nextTitleMatch.index;
                          } else {
                            endIndex = raw.length;
                          }
                        } else {
                          endIndex = raw.length;
                        }

                        // 섹션 제목과 내용 저장
                        let content = raw.slice(startIndex, endIndex).trim();

                        // 제목 줄 제거 (숫자와 함께)
                        content = content.replace(titlePattern, "").trim();

                        // '##' 마크다운 헤더 표시 제거
                        content = content.replace(/^##\s+/m, "").trim();

                        // 서브섹션 제목에서 숫자 제거
                        content = content.replace(/###\s*\d+\.\s*/g, "### ");

                        // 마크다운 줄바꿈 처리를 위한 변환
                        // 1. 단일 줄바꿈은 <br>로 변환 (마크다운에서 줄바꿈 보존)
                        // 2. 빈 줄 두 개 이상은 하나의 빈 줄로 통일
                        content = content
                          .replace(/\n(?!\n)/g, "  \n") // 단일 줄바꿈 뒤에 공백 두 개 추가 (마크다운 줄바꿈)
                          .replace(/\n{3,}/g, "\n\n"); // 연속된 세 개 이상의 줄바꿈은 두 개로 통일

                        sections.push({
                          title: title,
                          content: content,
                          style: sectionStyles[i]
                        });
                      }
                    } catch (error) {
                      console.error(`섹션 파싱 중 오류 발생: ${title}`, error);
                    }
                  }

                  if (sections.length === 0) {
                    // 대체 방법: 전체 내용을 하나의 섹션으로 표시
                    try {
                      // 줄바꿈 처리
                      let cleanedContent = raw
                        .replace(/\n(?!\n)/g, "  \n") // 단일 줄바꿈 뒤에 공백 두 개 추가
                        .replace(/\n{3,}/g, "\n\n"); // 연속된 세 개 이상의 줄바꿈은 두 개로 통일

                      const fallbackSection = {
                        title: "분석 인사이트",
                        content: cleanedContent,
                        style: sectionStyles[0]
                      };

                      return (
                        <div
                          className={`${fallbackSection.style.bg} p-6 rounded-lg shadow-sm border ${fallbackSection.style.border}`}
                        >
                          <h3
                            className={`text-lg font-semibold mb-4 ${fallbackSection.style.color} flex items-center`}
                          >
                            {fallbackSection.style.icon}
                            {fallbackSection.title}
                          </h3>

                          <div className="prose max-w-none">
                            <Markdown components={markdownComponents}>
                              {fallbackSection.content}
                            </Markdown>
                          </div>
                        </div>
                      );
                    } catch (error) {
                      return (
                        <div className="p-5 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center">
                          <svg
                            className="w-6 h-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          분석 리포트를 표시할 수 없습니다
                        </div>
                      );
                    }
                  }

                  return sections.map((section, idx) => {
                    const style = section.style;

                    return (
                      <div
                        key={idx}
                        className={`${style.bg} p-6 rounded-lg shadow-sm border ${style.border}`}
                      >
                        <h3
                          className={`text-lg font-semibold mb-4 ${style.color} flex items-center`}
                        >
                          {style.icon}
                          {section.title}
                        </h3>

                        <div className="prose prose-sm max-w-none">
                          <Markdown components={markdownComponents}>
                            {section.content}
                          </Markdown>
                        </div>
                      </div>
                    );
                  });
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
