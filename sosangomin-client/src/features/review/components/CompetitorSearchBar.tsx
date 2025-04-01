// features/competitor/components/CompetitorSearchBar.tsx
import React from "react";

interface CompetitorSearchBarProps {
  competitorName: string;
  setCompetitorName: (name: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const CompetitorSearchBar: React.FC<CompetitorSearchBarProps> = ({
  competitorName,
  setCompetitorName,
  onAnalyze,
  loading
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={competitorName}
        onChange={(e) => setCompetitorName(e.target.value)}
        placeholder="경쟁사 이름을 입력하세요"
        className="flex-1 p-2 border border-border rounded text-sm"
      />
      <button
        className="bg-bit-main text-white px-4 py-2 rounded hover:bg-blue-800 text-sm"
        onClick={onAnalyze}
        disabled={loading || competitorName.trim() === ""}
      >
        {loading ? "분석중..." : "경쟁사 분석"}
      </button>
    </div>
  );
};

export default CompetitorSearchBar;
