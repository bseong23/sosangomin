import React from "react";

// 타입 정의
interface FeatureCardProps {
  title: string;
  headerColor: string;
  img: string;
  points: {
    title: string;
    description: string;
  }[];
}

// 통합된 FeatureCard 컴포넌트
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  headerColor,
  img,
  points
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* 헤더 부분 */}
      <div className={`${headerColor} p-8 text-white`}>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* 이미지 섹션 */}
        <div className="md:w-1/3 p-6 flex items-center justify-center">
          <img
            src={img}
            alt={title}
            className="w-full max-w-xs rounded-xl object-cover"
          />
        </div>

        {/* 내용 섹션 */}
        <div className="md:w-2/3 p-6">
          <div className="grid grid-cols-1 gap-6">
            {points.map((point, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-bit-main/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-bit-main font-semibold">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold">{point.title}</h4>
                </div>
                <p className="text-gray-700 pl-11">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
