// components/main/CTASection.tsx
import React from "react";
import { Link } from "react-router-dom";

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-bit-main text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            데이터 분석으로
            <br />
            매출 향상을 경험하세요
          </h2>
          <p className="text-xl mb-10 opacity-90">
            소상공인을 위한 맞춤형 솔루션으로 고민을 해결해드립니다
          </p>
          <div className="flex justify-center">
            <Link
              to="/data-analysis/upload"
              className="bg-white text-bit-main font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
