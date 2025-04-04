import React from "react";
import { AnalysisResultData } from "../../types/analysis";

const seasonColors = {
  봄: "#FFB6C1", // 연한 핑크 (벚꽃 색상)
  여름: "#1E90FF", // 밝은 파랑 (여름 하늘)
  가을: "#FF8C00", // 주황 (단풍)
  겨울: "#87CEEB" // 하늘색 (겨울 하늘)
};

interface SeasonalSalesSectionProps {
  data: AnalysisResultData;
}

const SeasonalSalesSection: React.FC<SeasonalSalesSectionProps> = ({
  data
}) => {
  // 시즌 매출 데이터
  const seasonSales = data?.result_data?.season_sales?.data || {};
  const seasonSalesSummary = data?.result_data?.season_sales?.summary || "";

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength: number = 200) => {
    if (!summary) return "";
    return summary.length > maxLength
      ? summary.substring(0, maxLength) + "..."
      : summary;
  };

  return (
    <div className="w-full bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        시즌별 매출 분석
      </h2>
      <div className="p-4 mb-4">
        {Object.entries(seasonSales).map(([season, amount], idx) => (
          <div key={idx} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-comment">{season}</span>
              <span className="text-comment">
                ₩{(amount as number).toLocaleString("ko-KR")}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full w-full"
                style={{
                  backgroundColor:
                    seasonColors[season as keyof typeof seasonColors] ||
                    "#CBD5E1"
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-comment-text">
          {truncateSummary(seasonSalesSummary)}
        </p>
      </div>
    </div>
  );
};

export default SeasonalSalesSection;
