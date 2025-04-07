// src/features/analysis/components/dashboard/SummarySection.tsx
import React from "react";

interface SummarySectionProps {
  summary: string;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-xl font-semibold mb-3 text-comment">핵심 요약</h2>
      <div className="p-5 bg-blue-50 rounded-lg">
        <p className="text-comment text-base">{summary}</p>
      </div>
    </div>
  );
};

export default SummarySection;
