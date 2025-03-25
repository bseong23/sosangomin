// /components/modal/DataLoadingModal/CompletionScreen.tsx
import React from "react";
import { CompletionScreenProps } from "./types";

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onViewResults,
  onStartQuiz
}) => {
  return (
    <div>
      {/* 분석 완료 배너 */}
      <div className="bg-green-100 p-4">
        <p className="text-green-800 font-medium text-center">
          데이터 분석이 완료되었습니다!
        </p>
      </div>

      <div className="p-6 text-center">
        <p className="text-gray-700 mb-6">
          데이터 분석이 완료되었습니다. 결과를 확인하거나 퀴즈에 도전해보세요.
        </p>

        <div className="flex gap-3">
          <button
            className="flex-1 bg-green-500 text-white py-2.5 px-4 rounded-md hover:bg-green-600 transition-colors font-medium"
            onClick={onViewResults}
          >
            결과 보기
          </button>
          <button
            className="flex-1 bg-indigo-900 text-white py-2.5 px-4 rounded-md hover:bg-indigo-800 transition-colors font-medium"
            onClick={onStartQuiz}
          >
            퀴즈 풀어보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
