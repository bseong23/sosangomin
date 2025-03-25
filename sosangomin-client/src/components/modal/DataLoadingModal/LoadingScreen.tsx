// /components/modal/DataLoadingModal/LoadingScreen.tsx
import React from "react";
import { LoadingScreenProps } from "./types";

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  fileCount,
  posType,
  onStartQuiz
}) => {
  return (
    <div className="p-0">
      {/* 로딩 상태 배너 - 파란색 배경에 떨어진 느낌 */}
      <div className="bg-blue-50 p-4 mb-4">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bit-main"></div>
          <p className="text-bit-main font-medium">데이터 분석 중...</p>
        </div>
      </div>

      <div className="px-6 py-4 text-center">
        <p className="text-gray-700 mb-6">
          {fileCount}개의 {posType} 영수증 파일을 분석하고 있습니다.
        </p>

        <button
          onClick={onStartQuiz}
          className="bg-indigo-900 text-white py-2.5 px-6 rounded-md hover:bg-indigo-800 transition-colors w-full"
        >
          기다리는 동안 퀴즈 풀기
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;
