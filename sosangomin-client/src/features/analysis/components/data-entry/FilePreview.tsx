import React from "react";
import excelIcon from "@/assets/excel.svg";

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  const getFileExtension = (filename: string): string => {
    return filename
      .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
      .toLowerCase();
  };

  const getFileTypeInfo = (file: File): { icon: string; bgColor: string } => {
    const extension = getFileExtension(file.name);

    if (["xlsx", "xls", "csv"].includes(extension)) {
      return { icon: excelIcon, bgColor: "white" };
    }
    return { icon: "", bgColor: "bg-gray-500" };
  };

  const isAllowedFileType = (file: File): boolean => {
    const extension = getFileExtension(file.name);
    return ["xlsx", "xls", "csv"].includes(extension);
  };

  const allowedFiles = files.filter(isAllowedFileType);

  return (
    <div className="flex flex-wrap gap-4">
      {allowedFiles.map((file, index) => {
        const { icon, bgColor } = getFileTypeInfo(file);

        return (
          <div
            key={file.name + file.lastModified}
            className="relative flex flex-col items-center justify-center w-30 h-30 p-2 rounded-lg shadow-md border border-gray-300 bg-white"
          >
            {/* 파일 아이콘 */}
            <div
              className={`w-16 h-16 flex items-center justify-center ${bgColor} rounded-full`}
            >
              <img
                src={icon}
                alt="file icon"
                className="w-13 h-13 object-contain"
              />
            </div>

            {/* 파일명 */}
            <p
              className="mt-2 text-xs text-center truncate w-full px-1"
              title={file.name}
            >
              {file.name.length > 12
                ? file.name.substring(0, 12) + "..."
                : file.name}
            </p>

            {/* 삭제 버튼 */}
            <button
              className="absolute top-0 right-0 w-5 h-5 rounded-full text-sm flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white hover:cursor-pointer bg-red-500 rounded-full"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FilePreview;
