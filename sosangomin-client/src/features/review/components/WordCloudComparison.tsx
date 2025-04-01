// features/competitor/components/WordCloudComparison.tsx
import React from "react";

interface WordCloudComparisonProps {
  myStoreWords: Record<string, number>;
  competitorWords: Record<string, number>;
}

const WordCloudComparison: React.FC<WordCloudComparisonProps> = ({
  myStoreWords,
  competitorWords
}) => {
  const renderWords = (words: Record<string, number>) =>
    Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, count], i) => (
        <span
          key={i}
          className="mr-2 text-xs"
          style={{ fontSize: `${10 + count}px` }}
        >
          {word}
        </span>
      ));

  return (
    <div className="flex gap-4">
      <div className="flex-1 border rounded p-2 shadow-sm">
        <h3 className="font-semibold mb-2 text-sm">내 매장 워드클라우드</h3>
        <div className="flex flex-wrap">{renderWords(myStoreWords)}</div>
      </div>
      <div className="flex-1 border rounded p-2 shadow-sm">
        <h3 className="font-semibold mb-2 text-sm">경쟁사 워드클라우드</h3>
        <div className="flex flex-wrap">{renderWords(competitorWords)}</div>
      </div>
    </div>
  );
};

export default WordCloudComparison;
