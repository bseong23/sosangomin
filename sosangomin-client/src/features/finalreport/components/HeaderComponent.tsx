// src/features/finalreport/components/HeaderComponent.tsx
import React, { useState } from "react";
import { FinalReportDetail, FinalReportListItem } from "../types/finalReport";

interface HeaderComponentProps {
  data: FinalReportDetail;
  reportList?: FinalReportListItem[];
  onReportSelect?: (reportId: string) => void;
  onCreateReport?: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  data,
  reportList,
  onReportSelect,
  onCreateReport
}) => {
  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // 보고서 선택 핸들러
  const handleReportSelect = (reportId: string) => {
    setIsDropdownOpen(false);
    if (onReportSelect) {
      onReportSelect(reportId);
    }
  };

  // 분석 버튼이 비활성화되었는지 확인
  const isCreateButtonDisabled = !onCreateReport;

  return (
    <div className="bg-white rounded-lg mb-6 p-4 shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center flex-wrap">
        {/* 1. 가게이름 및 타이틀 (왼쪽) */}
        <h1 className="text-xl font-bold text-gray-800">
          {data.store_name} 종합 분석 보고서
        </h1>

        <div className="flex items-center mt-2 sm:mt-0 space-x-4">
          {/* 2. 분석하기 버튼 */}
          {onCreateReport && (
            <button
              onClick={onCreateReport}
              className={`flex items-center px-4 py-2 ${
                isCreateButtonDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white rounded-md transition duration-200`}
              disabled={isCreateButtonDisabled}
            >
              {isCreateButtonDisabled ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  새 분석하기
                </>
              )}
            </button>
          )}

          {/* 3. 날짜 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between px-4 py-2 text-indigo-600 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="text-lg font-semibold truncate max-w-[180px]">
                선택일: {formatDate(data.created_at)}
              </span>
              <svg
                className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && reportList && reportList.length > 0 && (
              <div className="absolute right-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 max-h-60 overflow-auto">
                  {reportList.map((report) => (
                    <li
                      key={report.report_id}
                      className={`px-4 py-2 text-sm hover:bg-indigo-50 cursor-pointer ${
                        report.report_id === data._id
                          ? "bg-indigo-100 font-medium"
                          : ""
                      }`}
                      onClick={() => handleReportSelect(report.report_id)}
                    >
                      {formatDate(report.created_at)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
