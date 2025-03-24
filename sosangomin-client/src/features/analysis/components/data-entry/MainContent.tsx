import React, { useState } from "react";
import DataUploadArea from "./DataUploadArea";
import FilePreview from "./FilePreview";
import AnalysisButton from "./AnalysisButton";
import InfoModal from "./InfoModal";
// 이미지 import
import PosData1 from "@/assets/POS_data_1.webp";
import PosData2 from "@/assets/POS_data_2.webp";

const MainContent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFileUpload = (files: FileList): void => {
    // FileList를 배열로 변환하여 기존 파일에 추가
    const newFiles = Array.from(files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleRemoveFile = (index: number): void => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 모달에 표시할 내용 - 이미지 가로 배치
  const modalContent = (
    <div className="space-y-6">
      <div>
        <ol className="list-decimal pl-5 space-y-8">
          <li className="mb-4 text-lg">
            <div className="mb-2 text-lg">
              토스포스 입출 상단 →{" "}
              <span className="text-red-500 font-medium">매출리포트</span>를
              눌러주세요.
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
              <span className="text-red-500 font-medium">출력하기</span> 버튼을
              누르면 연결된 매출현황을 출력할 수 있어요.
            </div>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <img
                src={PosData2}
                alt="토스포스 정산지 출력 방법 2단계"
                className="w-full h-auto object-contain"
              />
            </div>

            <hr className="border-border my-10" />

            {/* 파일 형식 정보 */}
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
                <span className="font-medium">엑셀 파일</span>: 영수증 데이터가
                표 형식으로 정리되어 있어야 합니다. 첫 번째 행에는 열 제목이
                포함되어야 합니다.
              </p>
              <p className="mb-3">
                <span className="font-medium">CSV 파일</span>: 표준 영수증
                형식의 데이터로, 자동으로 항목과 금액이 인식됩니다.
              </p>

              <h4 className="text-lg font-medium text-bit-main mb-3 mt-5">
                분석 과정
              </h4>
              <p>
                파일 업로드 후 '분석하기' 버튼을 클릭하면 영수증 데이터를
                분석하여 결과를 보여줍니다. 분석 시간은 파일 크기에 따라 달라질
                수 있습니다.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen w-full max-w-[1200px] p-6 mx-auto">
      <div className="w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          영수증 파일 등록하기
          <button
            onClick={openModal}
            className="ml-2 bg-bit-main text-white rounded-full w-7 h-7 inline-flex items-center justify-center text-base hover:bg-blue-900 focus:outline-none"
            aria-label="영수증 파일 등록 안내"
          >
            ?
          </button>
        </h1>
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white py-6 rounded-lg w-full">
            <DataUploadArea onFileUpload={handleFileUpload} />

            {uploadedFiles.length > 0 && (
              <div className="mt-6">
                <FilePreview
                  files={uploadedFiles}
                  onRemove={handleRemoveFile}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6 mb-6">
          <AnalysisButton />
        </div>
      </div>

      {/* 정보 모달 */}
      <InfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="POS 영수증 출력 방법"
        content={modalContent}
      />
    </div>
  );
};

export default MainContent;
