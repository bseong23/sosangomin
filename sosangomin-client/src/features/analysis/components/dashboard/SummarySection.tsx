// src/features/analysis/components/dashboard/SummarySection.tsx
import React from "react";
import Markdown from "react-markdown";

interface SummarySectionProps {
  summary: string;
}

// 마크다운 렌더링을 위한 스타일
const markdownComponents = {
  h1: (props: any) => (
    <h1 className="text-2xl font-bold my-4 text-bit-main" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-xl font-semibold my-3 mb-5 text-bit-main" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-lg font-medium my-2 text-bit-main" {...props} />
  ),
  p: (props: any) => (
    <p className="my-2 mb-5 text-base  text-comment" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc mb-5 gap-2 pl-5 my-2" {...props} />
  ),
  ol: (props: any) => <ol className="list-decimal mb-5 pl-5 my-2" {...props} />,
  li: (props: any) => <li className="my-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-gray-300 pl-4 italic my-2"
      {...props}
    />
  )
};

const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-xl font-semibold mb-3 text-comment">핵심 요약</h2>
      <div className="p-5 bg-blue-50 rounded-lg">
        <p className="text-comment text-base">
          <Markdown components={markdownComponents}>{summary}</Markdown>
        </p>
      </div>
    </div>
  );
};

export default SummarySection;
