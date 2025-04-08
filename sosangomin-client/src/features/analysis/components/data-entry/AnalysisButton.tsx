import React from "react";

interface AnalysisButtonProps {
  onAnalyze?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({
  onAnalyze,
  isLoading = false,
  disabled = false
}) => {
  const handleAnalysis = (): void => {
    // 분석 로직 구현 (서버 요청 등)

    if (onAnalyze) {
      onAnalyze();
    }
  };

  return (
    <button
      className={`bg-bit-main text-white py-2 sm:py-3 px-6 sm:px-10 rounded-md transition duration-200 font-medium text-sm sm:text-base ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-900"
      }`}
      onClick={handleAnalysis}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
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
        </div>
      ) : (
        "분석하기"
      )}
    </button>
  );
};

export default AnalysisButton;
