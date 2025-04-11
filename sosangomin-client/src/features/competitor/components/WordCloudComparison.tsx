// // features/competitor/components/ImprovedWordCloudComparison.tsx
// import React from "react";
// import WordCloud from "@/features/review/components/WordCloud";

// interface ImprovedWordCloudComparisonProps {
//   myStoreWords: Record<string, number>;
//   competitorWords: Record<string, number>;
//   title?: string;
//   maxWords?: number;
//   height?: string;
//   type?: "positive" | "negative";
// }

// const filterWords = (words: Record<string, number>, exclude: string[]) => {
//   return Object.fromEntries(
//     Object.entries(words).filter(([word]) => !exclude.includes(word))
//   );
// };

// /**
//  * 내 매장과 경쟁사의 워드 클라우드를 비교하는 컴포넌트
//  * 기존의 리뷰 분석용 WordCloud 컴포넌트를 활용
//  */
// const ImprovedWordCloudComparison: React.FC<
//   ImprovedWordCloudComparisonProps
// > = ({
//   myStoreWords,
//   competitorWords,
//   title,
//   maxWords = 15,
//   height = "h-64",
//   type = "positive" // default가 positive
// }) => {
//   const colorMap =
//     type === "negative"
//       ? { primary: "#B91C1C", secondary: "#EF4444" }
//       : { primary: "#1E40AF", secondary: "#3B82F6" };

//   const excludeWords = ["보기", "여자", "남자"]; // 제외할 단어들 추가 가능

//   const filteredMyStoreWords = filterWords(myStoreWords, excludeWords);
//   const filteredCompetitorWords = filterWords(competitorWords, excludeWords);

//   return (
//     <div className="mb-4">
//       {title && <h4 className="text-sm font-medium mb-2">{title}</h4>}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <div className="font-medium text-sm mb-1 text-center ">내 매장</div>
//           <WordCloud
//             words={filteredMyStoreWords}
//             colors={colorMap}
//             maxWords={maxWords}
//             height={height}
//           />
//         </div>

//         <div>
//           <div className="font-medium text-sm mb-1 text-center">경쟁사</div>
//           <WordCloud
//             words={filteredCompetitorWords}
//             colors={colorMap}
//             maxWords={maxWords}
//             height={height}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImprovedWordCloudComparison;

// features/competitor/components/ImprovedWordCloudComparison.tsx
import React, { useState } from "react";
import WordCloud from "@/features/review/components/WordCloud";

interface ImprovedWordCloudComparisonProps {
  myStorePositiveWords: Record<string, number>;
  myStoreNegativeWords: Record<string, number>;
  competitorPositiveWords: Record<string, number>;
  competitorNegativeWords: Record<string, number>;
  title?: string;
  maxWords?: number;
  height?: string;
}

const filterWords = (words: Record<string, number>, exclude: string[]) => {
  return Object.fromEntries(
    Object.entries(words).filter(([word]) => !exclude.includes(word))
  );
};

/**
 * 내 매장과 경쟁사의 워드 클라우드를 비교하는 컴포넌트
 * 긍정/부정 워드클라우드를 토글 방식으로 전환 가능
 * 기존의 리뷰 분석용 WordCloud 컴포넌트를 활용
 */
const ImprovedWordCloudComparison: React.FC<
  ImprovedWordCloudComparisonProps
> = ({
  myStorePositiveWords,
  myStoreNegativeWords,
  competitorPositiveWords,
  competitorNegativeWords,
  title,
  maxWords = 15,
  height = "h-64"
}) => {
  const [showPositive, setShowPositive] = useState(true);

  const positiveColorMap = { primary: "#1E40AF", secondary: "#3B82F6" };
  const negativeColorMap = { primary: "#B91C1C", secondary: "#EF4444" };

  const excludeWords = ["보기", "여자", "남자"]; // 제외할 단어들 추가 가능

  const filteredMyStoreWords = showPositive
    ? filterWords(myStorePositiveWords, excludeWords)
    : filterWords(myStoreNegativeWords, excludeWords);

  const filteredCompetitorWords = showPositive
    ? filterWords(competitorPositiveWords, excludeWords)
    : filterWords(competitorNegativeWords, excludeWords);

  const colorMap = showPositive ? positiveColorMap : negativeColorMap;

  return (
    <div className="mb-4">
      {/* 토글 버튼 영역 */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setShowPositive(true)}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              showPositive
                ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            긍정 키워드
          </button>
          <button
            type="button"
            onClick={() => setShowPositive(false)}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              !showPositive
                ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            부정 키워드
          </button>
        </div>
      </div>

      {title && (
        <h4 className="text-sm font-medium mb-2 text-center">
          {showPositive ? "긍정 키워드 비교" : "부정 키워드 비교"}
        </h4>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-medium text-sm mb-1 text-center text-blue-600">
            내 매장
          </div>
          <WordCloud
            words={filteredMyStoreWords}
            colors={colorMap}
            maxWords={maxWords}
            height={height}
          />
        </div>

        <div>
          <div className="font-medium text-sm mb-1 text-center text-red-600">
            경쟁사
          </div>
          <WordCloud
            words={filteredCompetitorWords}
            colors={colorMap}
            maxWords={maxWords}
            height={height}
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center mt-2">
        <p>키워드 크기는 해당 단어가 리뷰에서 언급된 빈도를 나타냅니다</p>
      </div>
    </div>
  );
};

export default ImprovedWordCloudComparison;
