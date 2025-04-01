// src/features/analysis/components/dashboard/SummarySection.tsx
import React from "react";

interface SummarySectionProps {
  summary: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  // 요약 텍스트 축약 함수
  const truncateSummary = (text: string, maxLength: number = 500) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-3 text-comment">핵심 요약</h2>
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-comment">{truncateSummary(summary)}</p>
      </div>
    </div>
  );
};

export default SummarySection;
