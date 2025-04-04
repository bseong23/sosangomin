import React, { useState } from "react";
import { FinalReportDetail } from "../types/finalReport";

// 실제 프로젝트에서는 react-markdown 또는 다른 마크다운 렌더링 라이브러리를 사용할 수 있습니다
// import ReactMarkdown from 'react-markdown';

interface FullAnalysisComponentProps {
  data: FinalReportDetail;
}

const FullAnalysisComponent: React.FC<FullAnalysisComponentProps> = ({
  data
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 실제 프로젝트에서는 마크다운을 렌더링하기 위해 라이브러리를 사용합니다
  // 여기서는 간단한 텍스트 표시로 대체합니다
  const renderMarkdown = (markdown: string) => {
    // 마크다운 헤더 변환 (# 제목)을 간단히 구현
    const processedText = markdown
      .split("\n")
      .map((line) => {
        if (line.startsWith("# ")) {
          return `<h1 class="text-2xl font-bold my-4">${line.substring(
            2
          )}</h1>`;
        } else if (line.startsWith("## ")) {
          return `<h2 class="text-xl font-semibold my-3">${line.substring(
            3
          )}</h2>`;
        } else if (line.startsWith("### ")) {
          return `<h3 class="text-lg font-medium my-2">${line.substring(
            4
          )}</h3>`;
        } else if (line.trim() === "") {
          return "<br />";
        } else {
          return `<p class="my-2">${line}</p>`;
        }
      })
      .join("");

    return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  // 토글 함수
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          전체 분석 보고서
        </h2>
        <button
          onClick={toggleExpanded}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
        >
          {isExpanded ? "접기" : "펼치기"}
        </button>
      </div>

      {isExpanded ? (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          {/* 실제 프로젝트에서는 아래와 같이 ReactMarkdown 컴포넌트를 사용할 수 있습니다 */}
          {/* <ReactMarkdown>{data.full_response}</ReactMarkdown> */}

          {/* 마크다운 렌더링 대신 간단한 텍스트 표시 */}
          {renderMarkdown(data.full_response)}
        </div>
      ) : (
        <div
          className="bg-gray-50 rounded-lg border border-gray-200 p-6 max-h-40 overflow-hidden relative cursor-pointer transition-all duration-200 hover:bg-gray-100"
          onClick={toggleExpanded}
        >
          <div className="opacity-20">
            {/* 마크다운 미리보기 */}
            {renderMarkdown(data.full_response.substring(0, 500) + "...")}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-4 py-2 rounded-lg shadow-md text-gray-600 flex items-center">
              클릭하여 전체 보고서 보기
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullAnalysisComponent;
