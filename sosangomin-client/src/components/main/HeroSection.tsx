// components/main/HeroSection.tsx
import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section className="bg-bit-main text-white py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-8xl font-bold mt-10 mb-10 leading-none">
            소상고민
            <br />
            <span className="text-2xl">소상공인을 위한 고민해결사</span>
          </h1>
          <p className="text-xl mb-10 opacity-90">
            매출 증대와 운영 효율화를 지금 바로 경험하세요!
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
        <div className="mt-16 max-w-5xl mx-auto">
          <img
            src="/images/hero-image.png"
            alt="소상공인 데이터 분석 서비스"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </div>

      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded bg-white"></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 transform rotate-45 bg-white"></div>
        <div className="absolute bottom-40 right-1/4 w-20 h-20 bg-white"></div>
      </div>
    </section>
  );
};

export default HeroSection;
