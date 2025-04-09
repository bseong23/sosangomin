// src/pages/ResultPage.tsx
import React, { useEffect, useState } from "react";
import HeaderComponent from "../features/finalreport/components/HeaderComponent";
import SwotDetailComponent from "../features/finalreport/components/SwotDetailComponent";
import RecommendationsComponent from "../features/finalreport/components/RecommendationsComponent";
import VisualizationComponent from "../features/finalreport/components/VisualizationComponent";
import FullAnalysisComponent from "../features/finalreport/components/FullAnalysisComponent";
import RelatedAnalysesComponent from "../features/finalreport/components/RelatedAnalysesComponent";
import useFinalReportManager from "@/features/finalreport/hooks/useFinalReportManager";
import useStoreStore from "../store/storeStore";
import Loading from "../components/common/Loading";
import { FinalReportDetail } from "../features/finalreport/types/finalReport";

const ResultPage: React.FC = () => {
  // 스토어에서 대표 매장 정보 가져오기
  const { representativeStore } = useStoreStore();
  const storeId = representativeStore?.store_id?.toString() || ""; // 기본값 빈 문자열로 변경

  // URL 파라미터에서 reportId 추출
  const getReportIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("reportId");
  };

  // 현재 URL에서 reportId 가져오기
  const [currentReportId, setCurrentReportId] = useState<string | undefined>(
    getReportIdFromUrl() || undefined
  );

  // 보고서 관련 상태 관리
  const {
    reportDetail,
    reportList,
    isLoadingDetail,
    isLoadingList,
    isCreating,
    detailError,
    listError,
    handleSelectReport,
    handleCreateReport,
    hasRegisteredStore
  } = useFinalReportManager(storeId);

  // URL 변경 시 reportId 업데이트
  useEffect(() => {
    const handleUrlChange = () => {
      const newReportId = getReportIdFromUrl();
      if (newReportId !== currentReportId) {
        setCurrentReportId(newReportId || undefined);
      }
    };

    // popstate 이벤트로 뒤로가기/앞으로가기 감지
    window.addEventListener("popstate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [currentReportId]);

  // 목록이 로드되면 자동으로 최신 보고서 선택
  useEffect(() => {
    if (reportList && reportList.length > 0 && !currentReportId) {
      const latestReportId = reportList[0].report_id;

      // URL 업데이트
      const url = new URL(window.location.href);
      url.searchParams.set("reportId", latestReportId);
      window.history.pushState({}, "", url.toString());

      // 상태 업데이트
      setCurrentReportId(latestReportId);
      handleSelectReport(latestReportId);
    }
  }, [reportList, currentReportId, handleSelectReport]);

  // reportId 변경 시 보고서 선택
  useEffect(() => {
    if (currentReportId) {
      handleSelectReport(currentReportId);
    }
  }, [currentReportId, handleSelectReport]);

  // 보고서 선택 핸들러
  const handleReportSelection = (newReportId: string) => {
    // URL 업데이트 (페이지 새로고침 없이)
    const url = new URL(window.location.href);
    url.searchParams.set("reportId", newReportId);
    window.history.pushState({}, "", url.toString());

    // 상태 업데이트
    setCurrentReportId(newReportId);
    handleSelectReport(newReportId);
  };

  // 새 보고서 생성 핸들러
  const handleCreateNewReport = async () => {
    if (isCreating || !storeId) return; // 이미 생성 중이거나 매장 ID가 없으면 중단

    try {
      const response = await handleCreateReport(storeId);

      // report_id를 사용하여 URL 업데이트
      if (response && response.report_id) {
        const url = new URL(window.location.href);
        url.searchParams.set("reportId", response.report_id);
        window.history.pushState({}, "", url.toString());

        // 상태 업데이트
        setCurrentReportId(response.report_id);
      }
    } catch (error) {
      console.error("보고서 생성 중 오류 발생:", error);
    }
  };

  // 매장이 등록되어 있지 않은 경우
  if (!hasRegisteredStore) {
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

  // 대표 매장이 없는 경우 로딩 화면 표시
  if (!representativeStore) {
    return <div className="text-center py-10">대표 매장을 선택해주세요.</div>;
  }
  // 헤더에 사용할 보고서 데이터 결정 (없으면 빈 객체)
  // HeaderComponent에 전달할 데이터 객체 생성
  const headerData: FinalReportDetail = reportDetail || {
    store_id: Number(storeId), // Convert storeId to number
    store_name: representativeStore.store_name || "",
    created_at: new Date().toISOString(),
    full_response: "",
    swot_analysis: {
      summary: "",
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      recommendations: []
    },
    related_analyses: {
      review_analysis_id: "",
      combined_analysis_id: "",
      competitor_analysis_id: ""
    }
  };

  // renderMainContent 함수 수정 부분
  const renderMainContent = () => {
    // 로딩 상태 체크에서 isCreating 제외
    if (isLoadingDetail || isLoadingList) {
      return (
        <div className="bg-basic-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 mb-6 min-h-[300px] flex items-center justify-center">
          <Loading />
        </div>
      );
    }

    // 에러 발생
    if (detailError || listError) {
      const error = detailError || listError;
      return (
        <div className="bg-basic-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 mb-6 min-h-[300px]">
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-red-500 mb-4"
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
            <h2 className="text-xl font-semibold text-center text-bit-main mb-2">
              오류가 발생했습니다
            </h2>
            <p className="text-comment text-center mb-4">
              {error?.message ||
                "보고서 데이터를 불러오는 중 오류가 발생했습니다."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-2 px-4 bg-bit-main hover:bg-opacity-90 text-basic-white rounded-md transition duration-200"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }

    // 보고서 목록이 비어있는 경우
    if (reportList && reportList.length === 0) {
      return (
        <div className="bg-basic-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 mb-6 min-h-[300px]">
          <div className="flex flex-col mt-20 items-center justify-center h-full">
            <h2 className="text-xl font-semibold text-bit-main mb-4">
              분석된 보고서가 없습니다
            </h2>
            <p className="text-comment text-center mb-4">
              {representativeStore.store_name}의 분석 보고서가 아직 없습니다.
            </p>
          </div>
        </div>
      );
    }

    // 보고서 목록은 있지만 선택된 보고서가 없는 경우
    if (!reportDetail) {
      return (
        <div className="bg-basic-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] p-6 mb-6 min-h-[300px]">
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-semibold text-bit-main mb-4">
              선택된 날짜에 분석된 보고서가 없습니다
            </h2>
            <p className="text-comment text-center mb-4">
              다른 날짜를 선택하거나 새 분석을 시작해 주세요.
            </p>
            {reportList && reportList.length > 0 && (
              <button
                onClick={() => handleReportSelection(reportList[0].report_id)}
                className="py-2 px-4 bg-bit-main hover:bg-opacity-90 text-basic-white rounded-md transition duration-200 mb-2"
              >
                최신 보고서 보기
              </button>
            )}
          </div>
        </div>
      );
    }

    // 정상적인 보고서 데이터가 있는 경우
    // isCreating이 true더라도 기존 보고서는 계속 표시
    return (
      <>
        <SwotDetailComponent
          data={reportDetail}
          reportList={reportList}
          onReportSelect={handleReportSelection}
        />
        <RecommendationsComponent data={reportDetail} />
        <VisualizationComponent data={reportDetail} />
        <FullAnalysisComponent data={reportDetail} />
        <RelatedAnalysesComponent data={reportDetail} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12" id="report-content">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더는 항상 보여줌 - 날짜 선택 기능은 제거됨 */}
        <HeaderComponent
          data={headerData}
          onCreateReport={handleCreateNewReport}
          isCreating={isCreating}
        />

        {/* 상태에 따라 다른 내용 표시 */}
        {renderMainContent()}
      </div>
    </div>
  );
};

export default ResultPage;
