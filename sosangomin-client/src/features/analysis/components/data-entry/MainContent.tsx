import React, { useState } from "react";
import DataUploadArea from "./DataUploadArea";
import FilePreview from "./FilePreview";
import AnalysisButton from "./AnalysisButton";
import InfoModal from "./InfoModal";
import PosTypeSelector from "./PosTypeSelector";
import DataLoadingModal from "@/components/modal/DataLoadingModal/index.tsx";
import useFileModalStore from "@/store/modalStore";

// 분석 API 연동 관련 import
// TODO: 백엔드 API 연동 시 주석 해제
// import { useAnalysisStore } from '@/features/analysis';
// import { AnalysisRequest } from '@/features/analysis';

// 이미지 import
import PosData1 from "@/assets/POS_data_1.webp";
import PosData2 from "@/assets/POS_data_2.webp";

const MainContent: React.FC = () => {
  // Zustand 스토어에서 필요한 상태와 액션 가져오기
  const {
    uploadedFiles,
    isModalOpen,
    isLoading,
    fileCount,
    // posType,
    addFiles,
    removeFile,
    // clearFiles,
    openModal,
    closeModal,
    setLoading,
    setFileData
    // resetAfterAnalysis
  } = useFileModalStore();

  // Analysis Store 사용 (백엔드 연동 시 주석 해제)
  // TODO: 백엔드 API 연동 시 주석 해제
  // const {
  //   requestAnalysis,
  //   currentAnalysis,
  //   isLoading: isAnalysisLoading,
  //   error: analysisError
  // } = useAnalysisStore();

  // 로컬 상태는 최소화
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [selectedPosType, setSelectedPosType] = useState<string>("토스");

  // 업로드된 파일의 소스 ID 저장 (백엔드 연동 시 주석 해제)
  // TODO: 백엔드 API 연동 시 주석 해제
  // const [sourceIds, setSourceIds] = useState<string[]>([]);

  // 개발 테스트용 로딩 시간 (밀리초)
  const loadingTime = 5000; // 5초 (테스트용으로 단축)

  const handleFileUpload = (files: FileList): void => {
    addFiles(Array.from(files));

    // TODO: 백엔드 API 연동 시 주석 해제
    // 여기서 파일을 서버에 업로드하고 sourceId를 받아올 수 있습니다.
    // const uploadFileToServer = async (file: File) => {
    //   // 파일 업로드 API 호출 (가정)
    //   // const response = await uploadFile(file);
    //   // return response.sourceId;
    //
    //   // 임시로 고유 ID 생성
    //   return `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // };
    //
    // // 파일마다 업로드 후 sourceId 저장
    // Promise.all(Array.from(files).map(uploadFileToServer))
    //   .then(ids => {
    //     setSourceIds(prev => [...prev, ...ids]);
    //   })
    //   .catch(error => {
    //     console.error("파일 업로드 실패:", error);
    //   });
  };

  const handleRemoveFile = (index: number): void => {
    removeFile(uploadedFiles[index].name);

    // TODO: 백엔드 API 연동 시 주석 해제
    // // sourceIds도 함께 제거
    // setSourceIds(prev => {
    //   const newIds = [...prev];
    //   newIds.splice(index, 1);
    //   return newIds;
    // });
  };

  const handlePosTypeSelect = (posType: string): void => {
    setSelectedPosType(posType);
    setFileData(uploadedFiles.length, posType);
  };

  const openInfoModal = () => {
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
  };

  // 분석 완료 콜백 함수 - 모달 닫기 후 결과 페이지로 이동 (상태 초기화 포함)
  const handleAnalysisComplete = () => {
    closeModal();
    // 리다이렉트 코드 제거 (DataLoadingModal에서 이미 처리함)
  };

  // 분석 시작 함수
  const startAnalysis = () => {
    setLoading(true);
    setFileData(uploadedFiles.length, selectedPosType);
    openModal();

    // 분석 데이터 객체
    const analysisData = {
      posType: selectedPosType,
      files: uploadedFiles,
      fileCount: uploadedFiles.length,
      timestamp: new Date().toISOString()
    };

    console.log("분석 시작:", analysisData);

    // TODO: 백엔드 API 연동 시 replace
    // 실제 API 호출을 시뮬레이션 (예시)
    setTimeout(() => {
      console.log("분석 완료:", analysisData);
      setLoading(false);
    }, loadingTime);

    // TODO: 백엔드 API 연동 시 주석 해제
    // // 실제 API 호출
    // if (sourceIds.length > 0) {
    //   const analysisRequest: AnalysisRequest = {
    //     store_id: 1, // 현재 선택된 스토어 ID (컨텍스트에서 가져오거나 상태로 관리)
    //     source_ids: sourceIds,
    //     pos_type: selectedPosType
    //   };
    //
    //   // 분석 요청 보내기
    //   requestAnalysis(analysisRequest)
    //     .then(analysisId => {
    //       if (analysisId) {
    //         console.log("분석 요청 성공, ID:", analysisId);
    //
    //         // 분석이 완료되면 로딩 상태 종료
    //         // Note: 실제로는 useAnalysisPolling을 사용하여 상태를 확인하고
    //         // 완료되면 setLoading(false) 호출하는 것이 좋습니다.
    //         setTimeout(() => {
    //           setLoading(false);
    //         }, 5000); // 테스트를 위한 임의의 시간
    //       } else {
    //         console.error("분석 요청 실패");
    //         setLoading(false);
    //       }
    //     })
    //     .catch(error => {
    //       console.error("분석 API 오류:", error);
    //       setLoading(false);
    //     });
    // } else {
    //   console.error("소스 ID가 없습니다");
    //   setLoading(false);
    // }
  };

  // POS 타입에 따른 모달 내용을 결정하는 함수
  const getModalContentByPosType = () => {
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
          파일 형식별 특징
        </h4>
        <p className="mb-2">
          <span className="font-medium">엑셀 파일</span>: 영수증 데이터가 표
          형식으로 정리되어 있어야 합니다. 첫 번째 행에는 열 제목이 포함되어야
          합니다.
        </p>
        <p className="mb-3">
          <span className="font-medium">CSV 파일</span>: 표준 영수증 형식의
          데이터로, 자동으로 항목과 금액이 인식됩니다.
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
    switch (selectedPosType) {
      case "토스":
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

      // 다른 POS 타입을 추가할 수 있습니다
      default:
        return (
          <div className="space-y-6">
            <div>
              <p className="mb-4 text-lg">
                선택한 POS 시스템({selectedPosType})의 매출 데이터를 엑셀 또는
                CSV 형식으로 추출하여 업로드해 주세요.
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

          {/* POS 타입 선택기 */}
          <div className="flex items-center justify-center sm:justify-end">
            <span className="mr-2 text-sm font-medium text-gray-700">
              POS 타입:
            </span>
            <div className="w-[180px] sm:w-auto">
              <PosTypeSelector
                onSelect={handlePosTypeSelect}
                defaultValue="토스"
              />
            </div>
          </div>
        </div>

        <div className="bg-white py-6 rounded-lg w-full">
          <DataUploadArea onFileUpload={handleFileUpload} />

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <FilePreview
                files={uploadedFiles.map((fileInfo) => {
                  // FileInfo를 File 객체로 변환하기 위한 더미 File 객체
                  // 실제로는 File 객체의 속성만 사용한다면 이 방식으로도 동작함
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
            isLoading={isLoading}
            disabled={uploadedFiles.length === 0}
          />
        </div>
      </div>

      {/* 정보 모달 */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={closeInfoModal}
        title={`${selectedPosType} 영수증 출력 방법`}
        content={modalContent}
      />

      {/* 데이터 로딩 모달 (퀴즈 게임 포함) */}
      <DataLoadingModal
        isOpen={isModalOpen}
        fileCount={fileCount}
        posType={selectedPosType}
        isLoading={isLoading}
        onLoadingComplete={handleAnalysisComplete}
      />
    </div>
  );
};

export default MainContent;
