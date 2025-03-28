// src/components/feature/ServiceOverview.tsx
import React from "react";

interface FeatureItemProps {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  description,
  bgColor,
  textColor
}) => {
  return (
    <div className={`flex-1 ${bgColor} p-4 rounded-md`}>
      <div className={`flex items-center ${textColor} mb-2`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="font-semibold text-base">{title}</h3>
      </div>
      <p className="text-comment-text text-md">{description}</p>
    </div>
  );
};

const ServiceOverview: React.FC = () => {
  return (
    <section className="bg-basic-white rounded-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-bit-main">서비스 개요</h2>
      <p className="text-comment mb-4 text-base">
        소상공인 데이터 분석 서비스는 소상공인들의 POS기 데이터를 활용하여 매출
        동향, 고객 패턴, 상품 성과 등을 분석하고 실질적인 비즈니스 인사이트를
        제공하는 서비스입니다. 데이터에 기반한 의사결정으로 매출 증대와 비용
        절감을 지원합니다.
      </p>

      <div className="flex flex-col md:flex-row mt-6 gap-4">
        <FeatureItem
          title="간편한 데이터 업로드"
          description="POS기에서 추출한 데이터를 간편하게 업로드하여 분석할 수 있습니다."
          bgColor="bg-gray-50"
          textColor="text-bit-main"
        />

        <FeatureItem
          title="직관적인 데이터 시각화"
          description="복잡한 데이터를 이해하기 쉬운 차트와 그래프로 시각화합니다."
          bgColor="bg-gray-50"
          textColor="text-bit-main"
        />

        <FeatureItem
          title="맞춤형 비즈니스 인사이트"
          description="데이터 분석 결과를 바탕으로 실질적인 비즈니스 개선 방안을 제시합니다."
          bgColor="bg-gray-50"
          textColor="text-bit-main"
        />
      </div>
    </section>
  );
};

export default ServiceOverview;
