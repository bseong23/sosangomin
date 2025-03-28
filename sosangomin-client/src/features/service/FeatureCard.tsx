// src/components/feature/FeatureCard.tsx
import React from "react";

interface FeaturePoint {
  title: string;
  description: string;
}

interface FeatureCardProps {
  title: string;
  headerColor: string;
  points: FeaturePoint[];
  imagePlaceholder: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  headerColor,
  points,
  imagePlaceholder
}) => {
  return (
    <div className="bg-basic-white rounded-md border border-border overflow-hidden">
      <div className={`${headerColor} text-basic-white p-4`}>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="p-6">
        {/* 차트 이미지 영역 */}
        <div className="h-48 mb-4 bg-gray-100 flex items-center justify-center">
          {/* 나중에 이미지 캡처해서 추가 예정 */}
          <p className="text-comment-text">{imagePlaceholder}</p>
        </div>
        <div className="space-y-3">
          {points.map((point, index) => (
            <p key={index} className="text-comment">
              <span className="font-medium">{point.title}</span> -{" "}
              {point.description}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
