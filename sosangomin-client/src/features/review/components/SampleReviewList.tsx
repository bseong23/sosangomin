// features/competitor/components/SampleReviewList.tsx
import React from "react";

interface SampleReviewListProps {
  myStoreReviews: string[];
  competitorReviews: string[];
}

const SampleReviewList: React.FC<SampleReviewListProps> = ({
  myStoreReviews,
  competitorReviews
}) => {
  const renderReviews = (reviews: string[]) =>
    reviews.map((review, i) => (
      <div key={i} className="p-2 border rounded mb-2 text-xs bg-gray-50">
        {review}
      </div>
    ));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2 text-sm">내 매장 샘플 리뷰</h3>
        {renderReviews(myStoreReviews)}
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-sm">경쟁사 샘플 리뷰</h3>
        {renderReviews(competitorReviews)}
      </div>
    </div>
  );
};

export default SampleReviewList;
