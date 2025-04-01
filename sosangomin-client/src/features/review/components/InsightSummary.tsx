// features/competitor/components/InsightSummary.tsx
import React from "react";

interface InsightSummaryProps {
  insights: string[];
}

const InsightSummary: React.FC<InsightSummaryProps> = ({ insights }) => {
  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-semibold mb-2 text-sm">주요 인사이트</h3>
      <ul className="list-disc ml-4 space-y-1 text-sm">
        {insights.map((text, idx) => (
          <li key={idx}>{text}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightSummary;
