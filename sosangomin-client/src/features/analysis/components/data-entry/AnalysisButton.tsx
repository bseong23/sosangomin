import React from "react";

interface AnalysisButtonProps {
  onAnalyze?: () => void;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({ onAnalyze }) => {
  const handleAnalysis = (): void => {
    // 분석 로직 구현 (서버 요청 등)
    console.log("분석 시작");

    if (onAnalyze) {
      onAnalyze();
    }
  };

  return (
    <button
      className="bg-bit-main text-white py-3 px-10 rounded-md hover:bg-indigo-800 transition duration-200 font-medium"
      onClick={handleAnalysis}
    >
      분석하기
    </button>
  );
};

export default AnalysisButton;
