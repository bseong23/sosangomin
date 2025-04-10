// src/features/finalreport/components/SwotDetailComponent.tsx
import React, { useState } from "react";
import { FinalReportDetail, FinalReportListItem } from "../types/finalReport";

interface SwotDetailComponentProps {
  data: FinalReportDetail;
  reportList?: FinalReportListItem[];
  onReportSelect?: (reportId: string) => void;
}

const SwotDetailComponent: React.FC<SwotDetailComponentProps> = ({
  data,
  reportList,
  onReportSelect
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

  return (
    <div className="mb-6 bg-basic-white p-4 md:p-5 lg:p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-bit-main">
          SWOT 분석
        </h2>

        {/* 날짜 드롭다운 */}
        {reportList && (
          <div className="relative mt-2 md:mt-0 w-full sm:w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between px-3 py-2 md:px-4 md:py-2 lg:px-5 lg:py-3 text-bit-main bg-basic-white border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-bit-main-bit-main w-full sm:w-auto"
            >
              <span className="text-sm md:text-base lg:text-lg font-semibold truncate max-w-[180px] md:max-w-[220px]">
                {formatDate(data.created_at)}
              </span>
              <svg
                className={`w-4 h-4 md:w-5 md:h-5 ml-2 transition-transform duration-200 ${
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
              <div className="absolute right-0 z-10 w-full mt-1 bg-basic-white border border-border rounded-md shadow-lg">
                <ul className="py-1 max-h-60 overflow-auto">
                  {reportList.map((report) => (
                    <li
                      key={report.report_id}
                      className={`px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm lg:text-base hover:bg-opacity-10 hover:bg-gray- cursor-pointer`}
                      onClick={() => handleReportSelect(report.report_id)}
                    >
                      {formatDate(report.created_at)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary section with slight visual enhancement */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-bit-main text-base leading-relaxed">
          {data.swot_analysis.summary}
        </p>
      </div>

      {/* Visual SWOT diagram */}
      <div className="relative bg-basic-white rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Strengths - top left */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-10">
            <div className="flex items-center mb-3">
              <div className="bg-green-500 p-2 rounded-full mr-2">
                <svg
                  className="w-4 h-4  text-basic-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-800">
                강점 (Strengths)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.strengths.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-green-800 text-sm"
                >
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-green-200 rounded-full text-green-800 mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses - top right */}
          <div className="bg-gradient-to-bl from-red-50 to-red-100 rounded-lg p-10">
            <div className="flex items-center mb-3">
              <div className="bg-red-500 p-2 rounded-full mr-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-basic-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-red-800">
                약점 (Weaknesses)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.weaknesses.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-red-800 text-sm"
                >
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-200 rounded-full text-red-800 mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities - bottom left */}
          <div className="bg-gradient-to-tr from-blue-50 to-blue-100 rounded-lg p-10">
            <div className="flex items-center mb-3">
              <div className="bg-blue-500 p-2 rounded-full mr-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-basic-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-800">
                기회 (Opportunities)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.opportunities.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-blue-800 text-sm"
                >
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 rounded-full text-blue-800 mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Threats - bottom right */}
          <div className="bg-gradient-to-tl from-yellow-50 to-yellow-100 rounded-lg p-10 ">
            <div className="flex items-center mb-3">
              <div className="bg-yellow-500 p-2 rounded-full mr-2">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-basic-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-yellow-800">
                위협 (Threats)
              </h3>
            </div>
            <ul className="space-y-2 pl-3">
              {data.swot_analysis.threats.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-yellow-800 text-sm"
                >
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-200 rounded-full text-yellow-80 mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative center element to enhance visual appeal - now larger */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-basic-white shadow-lg flex items-center justify-center z-10">
          <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-bit-main flex items-center justify-center">
            <span className="text-basic-white text-xs md:text-sm lg:text-base text-center font-bold">
              SWOT
              <br />
              분석
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwotDetailComponent;
