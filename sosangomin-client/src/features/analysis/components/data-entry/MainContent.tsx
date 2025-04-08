// src/features/analysis/components/MainContent.tsx
import React, { useState, useEffect, useCallback } from "react";
import DataUploadArea from "./DataUploadArea";
import FilePreview from "./FilePreview";
import AnalysisButton from "./AnalysisButton";
import InfoModal from "./InfoModal";
import DateRangePicker from "./DateRangePicker";
import DataLoadingModal from "@/components/modal/DataLoadingModal";
import useFileModalStore from "@/store/modalStore";
import useStoreStore from "@/store/storeStore";
import useAnalysisStore from "@/store/useAnalysisStore";
import { StoreInfo } from "@/features/auth/types/mypage";

// 분석 API 및 파일 API 연동
import useFileUpload from "@/features/analysis/hooks/useFileUpload";
import { AnalysisRequest } from "@/features/analysis/types/analysis";
import useAnalysis from "@/features/analysis/hooks/useAnalysis";

// 이미지 import
import PosData1 from "@/assets/POS_data_1.webp";
import PosData2 from "@/assets/POS_data_2.webp";

const MainContent: React.FC = () => {
  // Zustand 스토어에서 필요한 상태와 액션 가져오기
  const {
    isModalOpen,
    isLoading,
    fileCount,
    openModal,
    setLoading,
    setFileData,
    completeLoading,
    setAnalysisCompleted,
    analysisCompleted,
    showCompletionNotice
  } = useFileModalStore();

  // 분석 스토어에서 액션 가져오기
  const {
    requestAnalysis: saveAnalysisToStore,
    setSelectedAnalysisId,
    fetchAnalysisResult
  } = useAnalysisStore();

  // 파일 업로드 훅 사용
  const {
    files,
    isUploading,
    error: fileUploadError,
    addFiles,
    removeFile,
    uploadFilesToServer
  } = useFileUpload();

  // 분석 훅 사용
  const { analysisState, requestAnalysis } = useAnalysis();

  const { representativeStore } = useStoreStore() as {
    representativeStore: StoreInfo | null;
  };

  // 분석 완료 처리 콜백 함수
  const handleAnalysisCompleted = useCallback(
    (data: any) => {
      // 모달 상태 업데이트 - 명시적으로 isLoading도 false로 설정
      setLoading(false);
      completeLoading();

      // 분석 완료 상태 설정
      setAnalysisCompleted(true);

      // 결과 저장 및 선택
      if (data && representativeStore) {
        // API 응답 구조에 맞게 분석 결과 저장
        saveAnalysisToStore({
          store_id: representativeStore.store_id || "",
          source_ids: data.source_ids || [],
          pos_type: representativeStore.pos_type || "",
          analysis_result: data
        });

        // 현재 분석 결과를 즉시 선택된 상태로 설정
        const resultId = data.analysis_id;
        if (resultId) {
          setSelectedAnalysisId(resultId);
          fetchAnalysisResult(resultId);
        }
      }

      // 중요: 모달이 닫혀있다면 다시 열기
      if (!isModalOpen) {
        openModal();
      }
    },
    [
      completeLoading,
      setAnalysisCompleted,
      representativeStore,
      saveAnalysisToStore,
      setSelectedAnalysisId,
      fetchAnalysisResult,
      isModalOpen,
      openModal,
      setLoading
    ]
  );

  // 로컬 상태
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState({
    startMonth: getFormattedMonth(-3), // 3개월 전
    endMonth: getFormattedMonth(0) // 현재 월
  });

  // 디버깅 로그 추가
  useEffect(() => {}, [
    isLoading,
    analysisCompleted,
    showCompletionNotice,
    isModalOpen
  ]);

  // 기본 날짜 설정 함수 (YYYY-MM 형식)
  function getFormattedMonth(monthsOffset: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsOffset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  }

  // 파일 목록이 변경되면 fileCount 업데이트
  useEffect(() => {
    if (representativeStore) {
      setFileData(files.length, representativeStore.pos_type);
    }
  }, [files.length, representativeStore, setFileData]);

  // 컴포넌트 마운트 시 스토어 ID 설정 확인
  useEffect(() => {
    // 대표 스토어가 없는 경우 경고 표시 또는 다른 처리를 할 수 있습니다.
    if (!representativeStore) {
      console.warn("대표 매장이 설정되어 있지 않습니다.");
    } else {
      // 디버깅: 대표 매장 정보 로깅
    }
  }, [representativeStore]);

  const handleFileUpload = (files: FileList): void => {
    addFiles(Array.from(files));
  };

  const handleRemoveFile = (index: number): void => {
    removeFile(index);
  };

  const handleDateRangeChange = (
    newStartMonth: string,
    newEndMonth: string
  ): void => {
    setDateRange({
      startMonth: newStartMonth,
      endMonth: newEndMonth
    });
  };

  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  // 사용자가 모달에서 "결과 보기" 버튼을 클릭했을 때 호출됩니다.
  const handleAnalysisComplete = () => {
    // 분석 상태를 완료로 설정
    setAnalysisCompleted(true);
  };

  // 안전하게 스토어 ID 가져오기
  const getValidStoreId = (store: StoreInfo | null): string => {
    if (!store) return "";

    // store_id 필드 확인
    if (store.store_id && typeof store.store_id === "string") {
      return store.store_id;
    }

    return "";
  };

  // 분석 시작 함수
  const startAnalysis = async (): Promise<void> => {
    // 대표 스토어가 없는 경우 처리
    if (!representativeStore) {
      console.error("분석을 시작할 매장이 선택되지 않았습니다.");
      return;
    }

    // 분석 완료 상태 초기화
    setAnalysisCompleted(false);

    // 유효한 스토어 ID 가져오기
    const storeId = getValidStoreId(representativeStore);
    if (!storeId) {
      console.error("유효한 매장 ID를 찾을 수 없습니다:", representativeStore);
      return;
    }

    // 디버깅: 사용하는 ID 값 확인

    // 모달 열기 및 로딩 상태 설정
    setLoading(true);
    openModal();

    try {
      // 1. 파일 업로드 - 직접 ID 목록 받기
      const uploadResult = await uploadFilesToServer({
        storeId: storeId,
        startMonth: dateRange.startMonth,
        endMonth: dateRange.endMonth
      });

      if (!uploadResult.success) {
        console.error("파일 업로드 실패");
        setLoading(false);
        return;
      }

      // 업로드된 파일 ID 직접 사용
      const fileIds = uploadResult.objectIds;

      // ID 목록이 비어 있는지 확인
      if (!fileIds || fileIds.length === 0) {
        console.error(
          "업로드된 파일 ID 목록이 비어 있습니다. 분석을 진행할 수 없습니다."
        );
        setLoading(false);
        return;
      }

      // 2. 분석 요청 파라미터 설정
      const analysisRequest: AnalysisRequest = {
        store_id: storeId,
        source_ids: fileIds,
        pos_type: representativeStore.pos_type
      };

      // 분석 요청 로깅

      // 3. 분석 요청 보내기 및 즉시 결과 처리
      const analysisResult = await requestAnalysis(analysisRequest);

      if (analysisResult) {
        // 분석 완료 처리
        handleAnalysisCompleted(analysisResult);
      } else {
        console.error("분석 요청 실패");
        setLoading(false);
      }
    } catch (error) {
      console.error("분석 프로세스 중 오류 발생:", error);
      setLoading(false);
    }
  };

  // POS 타입에 따른 모달 내용을 결정하는 함수
  const getModalContentByPosType = () => {
    // 현재 선택된 POS 타입 가져오기
    const currentPosType = representativeStore?.pos_type || "";

    // 공통으로 사용되는 파일 형식 정보 섹션
    const fileFormatInfo = (
      <div>
        <h4 className="text-lg font-medium text-bit-main mb-3">
          지원되는 파일 형식
        </h4>
        <p className="mb-3">
          엑셀 파일(.xlsx, .xls, .csv)만 업로드 가능합니다.
        </p>

        <h4 className="text-lg font-medium text-bit-main mb-3 mt-5">
          분석 과정
        </h4>
        <p>
          파일 업로드 후 '분석하기' 버튼을 클릭하면 영수증 데이터를 분석하여
          결과를 보여줍니다. 분석 시간은 파일 크기에 따라 달라질 수 있습니다.
        </p>
      </div>
    );

    // POS 타입에 따른 내용 분기
    switch (currentPosType.toLowerCase()) {
      case "토스":
      case "toss":
        return (
          <div className="space-y-6">
            <div>
              <ol className="list-decimal pl-5 space-y-8">
                <li className="mb-4 text-lg">
                  <div className="mb-2 text-lg">
                    토스포스 입출 상단 →{" "}
                    <span className="text-red-500 font-medium">매출리포트</span>
                    를 눌러주세요.
                  </div>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={PosData1}
                      alt="토스포스 정산지 출력 방법 1단계"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </li>
                <li className="mb-2 text-lg">
                  <div className="mb-2 text-lg">
                    매출현황의{" "}
                    <span className="text-red-500 font-medium">출력하기</span>{" "}
                    버튼을 누르면 연결된 매출현황을 출력할 수 있어요.
                  </div>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <img
                      src={PosData2}
                      alt="토스포스 정산지 출력 방법 2단계"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </li>
              </ol>

              <hr className="border-border my-10" />

              {fileFormatInfo}
            </div>
          </div>
        );

      case "키움페이":
      case "kiwoompay":
        return (
          <div className="space-y-6">
            <div>
              <div className="mb-4 text-lg">
                <p className="mb-3 font-medium text-bit-main">
                  키움페이 영수증 출력 방법
                </p>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>키움페이 매니저 앱에 로그인합니다.</li>
                  <li>
                    메인 화면에서{" "}
                    <span className="text-red-500 font-medium">매출관리</span>를
                    선택합니다.
                  </li>
                  <li>
                    <span className="text-red-500 font-medium">매출내역</span>을
                    선택하고 원하는 기간을 설정합니다.
                  </li>
                  <li>
                    화면 우측 상단의{" "}
                    <span className="text-red-500 font-medium">
                      내보내기(↓)
                    </span>{" "}
                    버튼을 탭합니다.
                  </li>
                  <li>파일 형식(Excel, CSV)을 선택하고 저장합니다.</li>
                </ol>
              </div>

              <hr className="border-border my-10" />

              {fileFormatInfo}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-4 text-lg">
                {currentPosType ? `${currentPosType} ` : ""}
                매출 데이터를 엑셀 또는 CSV 형식으로 추출하여 업로드해 주세요.
              </p>

              <hr className="border-border my-10" />

              {fileFormatInfo}
            </div>
          </div>
        );
    }
  };

  // 모달에 표시할 내용 생성
  const modalContent = getModalContentByPosType();

  // 에러 메시지 컴포넌트
  const ErrorMessage: React.FC = () => {
    const errorMsg = fileUploadError || analysisState.error;
    if (!errorMsg) return null;

    return (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
        {errorMsg}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen w-full max-w-[1200px] p-6 mx-auto">
      <div className="w-full">
        {/* 모바일에서는 세로 배치, 태블릿(sm) 이상에서는 가로 배치 */}
        <div className="flex flex-col justify-start items-start sm:flex-row sm:justify-between sm:items-center mb-6">
          {/* 모바일에서 가운데 정렬, sm 이상에서는 왼쪽 정렬 */}
          <div className="flex items-center justify-center sm:justify-start mb-4 sm:mb-0">
            <h1 className="text-xl font-bold text-gray-800">
              영수증 파일 등록하기
            </h1>
            <button
              onClick={openInfoModal}
              className="ml-2 bg-bit-main text-white rounded-full w-7 h-7 inline-flex items-center justify-center text-base shadow-lg hover:bg-blue-900 focus:outline-none"
              aria-label="영수증 파일 등록 안내"
            >
              ?
            </button>
          </div>

          {/* 선택된 매장 정보 표시 */}
          {representativeStore && (
            <div className="mb-4 sm:mb-0 sm:mx-4 px-3 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
              <span className="text-sm font-medium">
                {representativeStore.store_name}
                {representativeStore.pos_type && (
                  <span className="ml-4 px-2 py-0.5 bg-bit-main text-white rounded text-xs">
                    {representativeStore.pos_type}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* 날짜 범위 선택기 */}
        <div className="mb-6">
          <div className="flex justify-end items-centerp-4 rounded-lg ">
            <DateRangePicker
              startMonth={dateRange.startMonth}
              endMonth={dateRange.endMonth}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
        </div>

        <div className="bg-white py-6 rounded-lg w-full">
          <DataUploadArea onFileUpload={handleFileUpload} />

          {/* 에러 메시지 표시 */}
          <ErrorMessage />

          {files.length > 0 && (
            <div className="mt-6">
              <FilePreview
                files={files.map((fileInfo) => {
                  // FileInfo를 File 객체로 변환
                  return new File([""], fileInfo.name, {
                    type: fileInfo.type,
                    lastModified: fileInfo.lastModified
                  });
                })}
                onRemove={handleRemoveFile}
              />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6 mb-6">
          <AnalysisButton
            onAnalyze={startAnalysis}
            isLoading={isLoading || isUploading}
            disabled={files.length === 0 || !representativeStore}
          />
        </div>
      </div>

      {/* 정보 모달 */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={closeInfoModal}
        title={`${representativeStore?.pos_type || ""} 영수증 출력 방법`}
        content={modalContent}
      />

      {/* 데이터 로딩 모달 - 분석 ID 전달 */}
      <DataLoadingModal
        isOpen={isModalOpen}
        fileCount={fileCount}
        posType={representativeStore?.pos_type || ""}
        isLoading={isLoading}
        onLoadingComplete={handleAnalysisComplete}
      />
    </div>
  );
};

export default MainContent;
