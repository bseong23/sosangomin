// features/competitor/components/CompareSummary.tsx
import React from "react";
import { StoreData } from "@/features/competitor/types/competitor";

interface CompareSummaryProps {
  myStore: StoreData;
  competitor: StoreData;
}

const CompareSummary: React.FC<CompareSummaryProps> = ({
  myStore,
  competitor
}) => {
  const renderCard = (title: string, data: StoreData) => (
    <div className="flex-1 p-4 border rounded shadow-sm">
      <h3 className="font-semibold mb-2 text-sm">{title}</h3>
      <p>리뷰 수: {data.review_count}</p>
      <p>평균 평점: {data.average_rating}</p>
      <p>긍정 리뷰 비율: {data.positive_rate.toFixed(1)}%</p>
    </div>
  );

  return (
    <div className="flex gap-4">
      {renderCard("내 매장", myStore)}
      {renderCard("경쟁사", competitor)}
    </div>
  );
};

export default CompareSummary;
