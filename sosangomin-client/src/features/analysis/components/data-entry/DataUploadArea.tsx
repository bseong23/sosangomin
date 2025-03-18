import React, { useRef, useState } from "react";
import dataInputIcon from "@/assets/datainput.svg";

interface DataUploadAreaProps {
  onFileUpload: (files: FileList) => void;
}

const DataUploadArea: React.FC<DataUploadAreaProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // 파일 확장자 확인 함수
  const getFileExtension = (filename: string): string => {
    return filename
      .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
  };

  // 허용된 파일 확장자인지 확인
  const isAllowedFileType = (file: File): boolean => {
    const extension = getFileExtension(file.name);
    return ["xlsx", "xls", "csv"].includes(extension);
  };

  // 모든 파일이 허용된 타입인지 확인
  const validateFiles = (files: FileList): boolean => {
    const fileArray = Array.from(files);
    const invalidFiles = fileArray.filter((file) => !isAllowedFileType(file));

    if (invalidFiles.length > 0) {
      setErrorMessage(
        `지원되지 않는 파일 형식입니다. Excel(.xlsx, .xls, .csv) 또는 SVC(.svc) 파일만 업로드해주세요.`
      );
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);

    if (e.dataTransfer.files.length > 0) {
      if (validateFiles(e.dataTransfer.files)) {
        onFileUpload(e.dataTransfer.files);
      }
    }
  };

  const handleClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      if (validateFiles(e.target.files)) {
        onFileUpload(e.target.files);
      }
      // 파일 선택 후 input 초기화 (같은 파일 재선택 가능하도록)
      e.target.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed ${
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
        } rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer bg-white h-80 w-full transition-colors duration-200`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <img src={dataInputIcon} alt="파일 업로드" className="w-24 h-24 mb-6" />
        <p className="text-center text-gray-500 text-base mb-2">
          엑셀 또는 SVC 파일을 업로드 해주세요
        </p>
        <p className="text-center text-gray-400 text-sm">
          지원 형식: .xlsx, .xls, .csv
        </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls,.csv,.svc"
          multiple
          className="hidden"
        />
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DataUploadArea;
