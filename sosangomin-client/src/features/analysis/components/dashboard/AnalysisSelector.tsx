// src/features/analysis/components/dashboard/AnalysisSelector.tsx
import React, { useState } from "react";

// 분석 항목 인터페이스
interface AnalysisItem {
  analysis_id: string;
  created_at: string;
  store_id: number;
  status: "success" | "pending" | "failed";
}

interface AnalysisSelectorProps {
  storeId: number;
  analysisList: AnalysisItem[]; // 부모 컴포넌트에서 이미 로드된 분석 목록
  currentAnalysisId?: string;
  selectedAnalysis: AnalysisItem | null;
  onAnalysisSelect: (analysisId: string) => void;
}

const AnalysisSelector: React.FC<AnalysisSelectorProps> = ({
  analysisList,
  currentAnalysisId,
  selectedAnalysis,
  onAnalysisSelect
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  // 분석 선택 핸들러
  const handleSelectAnalysis = (analysis: AnalysisItem) => {
    onAnalysisSelect(analysis.analysis_id);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-600 mr-2">
          분석 일자:
        </span>
        <div className="relative">
          <button
            type="button"
            className="flex items-center justify-between min-w-[200px] bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-bit-main shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedAnalysis ? (
              formatDate(selectedAnalysis.created_at)
            ) : (
              <span className="text-gray-400">분석 선택</span>
            )}

            <svg
              className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {analysisList.length === 0 ? (
                <div className="text-center py-2 text-sm text-gray-500">
                  분석 데이터가 없습니다
                </div>
              ) : (
                analysisList.map((analysis) => (
                  <div
                    key={analysis.analysis_id}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                      currentAnalysisId === analysis.analysis_id
                        ? "bg-gray-100 text-bit-main font-medium"
                        : "text-gray-900"
                    }`}
                    onClick={() => handleSelectAnalysis(analysis)}
                  >
                    <div className="flex items-center">
                      <span className="block truncate">
                        {formatDate(analysis.created_at)}
                      </span>
                    </div>

                    {currentAnalysisId === analysis.analysis_id && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-bit-main">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisSelector;
