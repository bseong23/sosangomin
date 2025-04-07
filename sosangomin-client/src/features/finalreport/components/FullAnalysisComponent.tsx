import React, { useState, useEffect } from "react";
import { FinalReportDetail } from "../types/finalReport";
import ReactMarkdown from "react-markdown";

interface FullAnalysisComponentProps {
  data: FinalReportDetail;
}

const FullAnalysisComponent: React.FC<FullAnalysisComponentProps> = ({
  data
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [processedContent, setProcessedContent] = useState<string>(
    data.full_response
  );

  // 코드 블록 필터링을 포함한 데이터 전처리
  useEffect(() => {
    if (data.full_response) {
      // 코드 블록 필터링 (```로 시작하고 ```로 끝나는 블록 제거)
      const filteredContent = data.full_response.replace(/```[\s\S]*?```/g, "");
      setProcessedContent(filteredContent);
    }
  }, [data.full_response]);

  // 토글 함수
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 마크다운 렌더링을 위한 스타일
  const markdownComponents = {
    h1: (props: any) => (
      <h1 className="text-2xl font-bold my-4 mb-10 text-bit-main" {...props} />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-semibold my-3 mb-5 text-bit-main"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3 className="text-lg font-medium my-2 text-bit-main" {...props} />
    ),
    p: (props: any) => (
      <p className="my-2 text-base mb-5 text-comment" {...props} />
    ),
    ul: (props: any) => <ul className="list-disc pl-5 my-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
    li: (props: any) => <li className="my-1" {...props} />,
    blockquote: (props: any) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic my-2"
        {...props}
      />
    )
  };

  return (
    <div className="bg-basic-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-lg p-4 md:p-5 lg:p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-bit-main">
          전체 분석 보고서
        </h2>
        <button
          onClick={toggleExpanded}
          className="px-3 py-2 md:px-4 md:py-2 bg-bit-main hover:bg-opacity-90 text-basic-white rounded-md transition duration-200"
        >
          {isExpanded ? "접기" : "펼치기"}
        </button>
      </div>

      {isExpanded ? (
        <div className="bg-gray-50 rounded-lg border border-border p-4 md:p-5 lg:p-6">
          <ReactMarkdown components={markdownComponents}>
            {processedContent}
          </ReactMarkdown>
        </div>
      ) : (
        <div
          className="bg-gray-50 rounded-lg border border-border p-4 md:p-5 lg:p-6 max-h-40 overflow-hidden relative cursor-pointer transition-all duration-200 hover:bg-gray-100"
          onClick={toggleExpanded}
        >
          <div className="opacity-20">
            {/* 마크다운 미리보기 - 처리된 콘텐츠 사용 */}
            <ReactMarkdown components={markdownComponents}>
              {processedContent.substring(0, 500) + "..."}
            </ReactMarkdown>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-basic-white px-4 py-2 rounded-lg shadow-md text-comment flex items-center">
              클릭하여 전체 보고서 보기
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullAnalysisComponent;
