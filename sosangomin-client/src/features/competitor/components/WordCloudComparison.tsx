// features/competitor/components/ImprovedWordCloudComparison.tsx
import React from "react";
import WordCloud from "@/features/review/components/WordCloud";

interface ImprovedWordCloudComparisonProps {
  myStoreWords: Record<string, number>;
  competitorWords: Record<string, number>;
  title?: string;
  maxWords?: number;
  height?: string;
}

/**
 * 내 매장과 경쟁사의 워드 클라우드를 비교하는 컴포넌트
 * 기존의 리뷰 분석용 WordCloud 컴포넌트를 활용
 */
const ImprovedWordCloudComparison: React.FC<
  ImprovedWordCloudComparisonProps
> = ({
  myStoreWords,
  competitorWords,
  title,
  maxWords = 15,
  height = "h-64"
}) => {
  return (
    <div className="mb-4">
      {title && <h4 className="text-sm font-medium mb-2">{title}</h4>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-medium text-sm mb-1 text-center">내 매장</div>
          <WordCloud
            words={myStoreWords}
            colors={{ primary: "#1E40AF", secondary: "#3B82F6" }}
            maxWords={maxWords}
            height={height}
          />
        </div>

        <div>
          <div className="font-medium text-sm mb-1 text-center">경쟁사</div>
          <WordCloud
            words={competitorWords}
            colors={{ primary: "#6366F1", secondary: "#818CF8" }}
            maxWords={maxWords}
            height={height}
          />
        </div>
      </div>
    </div>
  );
};

export default ImprovedWordCloudComparison;
