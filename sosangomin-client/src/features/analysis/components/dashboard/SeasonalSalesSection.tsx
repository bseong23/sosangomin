import React from "react";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

const seasonColors = {
  봄: "#FFB6C1", // 연한 핑크 (벚꽃 색상)
  여름: "#1E90FF", // 밝은 파랑 (여름 하늘)
  가을: "#FF8C00", // 주황 (단풍)
  겨울: "#87CEEB" // 하늘색 (겨울 하늘)
};

interface SeasonalSalesSectionProps {
  data: AnalysisResultData;
}

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
  p: (props: any) => <p className="my-2 text-base  text-comment" {...props} />,
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

const SeasonalSalesSection: React.FC<SeasonalSalesSectionProps> = ({
  data
}) => {
  // 시즌 매출 데이터
  const seasonSales = data?.result_data?.season_sales?.data || {};
  const seasonSalesSummary = data?.result_data?.season_sales?.summary || "";

  return (
    <div className="w-full bg-basic-white mb-6 p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-10 text-comment">
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
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-comment">
          <Markdown components={markdownComponents}>
            {seasonSalesSummary}
          </Markdown>
        </p>
      </div>
    </div>
  );
};

export default SeasonalSalesSection;
