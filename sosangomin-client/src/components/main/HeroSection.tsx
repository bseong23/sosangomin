// components/main/HeroSection.tsx

import React, { useState, useEffect } from "react";
import ex_analyze from "@/assets/ex_analyze.png";

const HeroSection: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [floatImage, setFloatImage] = useState(false);

  useEffect(() => {
    // 텍스트가 나타나는 효과
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 500);

    // 이미지 플로팅 효과 시작
    const floatTimer = setTimeout(() => {
      setFloatImage(true);
    }, 800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(floatTimer);
    };
  }, []);

  return (
    <section className="bg-bit-main text-white h-screen w-full flex items-center relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10 flex flex-col items-start justify-center h-full">
        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col md:flex-row w-full items-center">
          {/* 왼쪽 텍스트 영역 */}
          <div className="md:w-1/2 flex flex-col items-start md:pr-10 px-50">
            {/* "소상고민" 텍스트 */}
            <h1 className="text-6xl md:text-7xl font-extrabold mb-10">
              소상고민
            </h1>

            {/* 빨간 구역에 해당하는 텍스트 영역 */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                showText
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-2xl md:text-3xl font-medium mb-6">
                소상공인을 위한 고민해결사
              </h2>
              <p className="text-lg md:text-xl mb-10 opacity-90">
                매출 증대와 운영 효율화를 지금 바로 경험하세요!
              </p>
              <div>
                <a
                  href="#start"
                  className="bg-white text-indigo-950 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300"
                >
                  무료로 시작하기
                </a>
              </div>
            </div>
          </div>

          {/* 오른쪽 이미지 영역 */}
          <div className="relative mx-auto md:w-1/2 max-w-lg mt-16 md:mt-0">
            <div
              className="relative transition-all duration-1000"
              style={{
                animation: floatImage ? "float 6s ease-in-out infinite" : "none"
              }}
            >
              <img
                src={ex_analyze}
                alt="데이터 분석"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-3/11 left-2/17 w-90 h-30 rounded-full bg-white blur-xl"></div>
        <div className="absolute top-2/3 right-1/5 w-48 h-48 rounded bg-white transform rotate-45 blur-lg"></div>
        {/* <div className="absolute bottom-1/3 left-1/3 w-56 h-56 transform rotate-45 bg-white blur-xl"></div> */}
        {/* <div className="absolute top-1/7 right-2/5 w-40 h-40 rounded bg-white transform rotate-45 blur-sm"></div>
        <div className="absolute top-1/7 right-2/5 w-40 h-40 rounded bg-white transform blur-sm"></div> */}
      </div>
    </section>
  );
};

export default HeroSection;
