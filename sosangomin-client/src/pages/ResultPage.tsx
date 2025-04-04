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

const ResultPage: React.FC = () => {
  // 스토어에서 대표 매장 정보 가져오기
  const { representativeStore } = useStoreStore();
  const storeId = representativeStore?.store_id || "1"; // 기본값 설정

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
    handleCreateReport
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
    if (isCreating) return; // 이미 생성 중이면 중복 요청 방지

    try {
      const newReport = await handleCreateReport(storeId);
      if (newReport && newReport._id) {
        // 새로 생성된 보고서로 URL 업데이트
        const url = new URL(window.location.href);
        url.searchParams.set("reportId", newReport._id);
        window.history.pushState({}, "", url.toString());

        // 상태 업데이트
        setCurrentReportId(newReport._id);
      }
    } catch (error) {
      console.error("보고서 생성 중 오류 발생:", error);
    }
  };

  // 로딩 상태 처리
  const isLoading = isLoadingDetail || isLoadingList || isCreating;
  if ((isLoading && !reportDetail) || !representativeStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );
  }

  // 에러 상태 처리
  const error = detailError || listError;
  if (error || (!reportDetail && !isLoading && !isCreating)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
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
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 text-center">
            {error?.message ||
              "보고서 데이터를 불러오는 중 오류가 발생했습니다."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 보고서 목록이 있지만 보고서가 없는 경우 (생성 필요)
  if (reportList && reportList.length === 0 && !reportDetail && !isCreating) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            보고서가 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            {representativeStore.store_name}의 분석 보고서가 없습니다. 새
            보고서를 생성해 주세요.
          </p>
          <button
            onClick={handleCreateNewReport}
            className={`py-2 px-4 ${
              isCreating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white rounded-md transition duration-200 flex items-center justify-center`}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                분석 중...
              </>
            ) : (
              "분석하기"
            )}
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우의 처리
  if (!reportDetail) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            보고서를 불러오는 중입니다
          </h2>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto px-4">
        <HeaderComponent
          data={reportDetail}
          reportList={reportList}
          onReportSelect={handleReportSelection}
          onCreateReport={isCreating ? undefined : handleCreateNewReport}
        />

        {isLoadingDetail ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : (
          <>
            <SwotDetailComponent data={reportDetail} />

            <RecommendationsComponent data={reportDetail} />
            <VisualizationComponent data={reportDetail} />
            <FullAnalysisComponent data={reportDetail} />
            <RelatedAnalysesComponent data={reportDetail} />
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
