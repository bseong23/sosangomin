import React, { useState } from "react";
import DataUploadArea from "./DataUploadArea";
import FilePreview from "./FilePreview";
import AnalysisButton from "./AnalysisButton";
import InfoModal from "./InfiModal";

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

  // 모달에 표시할 내용
  const modalContent = (
    <>
      <div className="mb-4">
        <h4 className="font-medium text-bit-main mb-2">지원되는 파일 형식</h4>
        <p>엑셀 파일(.xlsx, .xls, .csv)만 업로드 가능합니다.</p>
      </div>
      <div className="mb-4">
        <h4 className="font-medium text-bit-main mb-2">파일 형식별 특징</h4>
        <p className="mb-2">
          <strong>엑셀 파일</strong>: 영수증 데이터가 표 형식으로 정리되어
          있어야 합니다. 첫 번째 행에는 열 제목이 포함되어야 합니다.
        </p>
        <p>
          <strong>SVC 파일</strong>: 표준 영수증 형식의 데이터로, 자동으로
          항목과 금액이 인식됩니다.
        </p>
      </div>
      <div>
        <h4 className="font-medium text-bit-main mb-2">분석 과정</h4>
        <p>
          파일 업로드 후 '분석하기' 버튼을 클릭하면 영수증 데이터를 분석하여
          결과를 보여줍니다. 분석 시간은 파일 크기에 따라 달라질 수 있습니다.
        </p>
      </div>
    </>
  );

  return (
    <div className="bg-white w-full max-w-[1000px] mx-auto">
      <div className="w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          영수증 파일 등록하기
          <button
            onClick={openModal}
            className="ml-2 bg-gray-200 rounded-full w-6 h-6 inline-flex items-center justify-center text-sm hover:bg-gray-300 focus:outline-none"
            aria-label="영수증 파일 등록 안내"
          >
            ?
          </button>
        </h1>
        <div className="flex justify-between items-center mb-6">
          <div className="bg-white p-6 rounded-lg w-full">
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
        title="영수증 파일 등록 안내"
        content={modalContent}
      />
    </div>
  );
};

export default MainContent;
