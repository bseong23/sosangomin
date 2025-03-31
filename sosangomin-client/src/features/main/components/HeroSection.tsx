// // components/main/HeroSection.tsx

import React, { useState, useEffect } from "react";
import ex_analyze from "@/assets/ex_analyze.png";

const HeroSection: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [floatImage, setFloatImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // 이미지 플로팅 스타일
  const getImageStyle = () => {
    if (floatImage) {
      return {
        animation: "float 6s ease-in-out infinite"
      };
    }
    return {};
  };

  return (
    <section className="bg-bit-main text-white min-h-screen w-full flex items-center relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col items-center justify-center h-full py-12 md:py-0">
        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col md:flex-row w-full items-center justify-center md:justify-between">
          {/* 왼쪽 텍스트 영역 - 여백 추가 */}
          <div
            className={`md:w-1/2 flex flex-col items-center md:items-start ${
              isMobile ? "text-center" : "text-left"
            } md:pl-12 lg:pl-20 xl:pl-24`}
          >
            {/* "소상고민" 텍스트 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 md:mb-10">
              소상고민
            </h1>

            {/* 텍스트 애니메이션 영역 */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                showText
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-3 md:mb-6">
                소상공인을 위한 고민해결사
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-10 opacity-90 max-w-md">
                매출 증대와 운영 효율화를 지금 바로 경험하세요!
              </p>
              {/* <div>
                <a
                  href="#start"
                  className="bg-white text-indigo-950 font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition duration-300 inline-block"
                >
                  무료로 시작하기
                </a>
              </div> */}
            </div>
          </div>

          {/* 오른쪽 이미지 영역 - 모바일에서는 위치 조정 */}
          <div className="relative mx-auto md:w-1/2 max-w-xs sm:max-w-sm md:max-w-lg mt-8 md:mt-0 md:pr-6 lg:pr-10">
            <div
              className="relative transition-all duration-1000"
              style={getImageStyle()}
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

      {/* 배경 장식 요소 - 반응형으로 조정 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/6 w-1/4 h-1/6 rounded-full bg-white blur-xl"></div>
        <div className="absolute top-2/3 right-1/5 w-1/4 h-1/4 rounded bg-white transform rotate-45 blur-lg"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1/6 h-1/6 rounded-full bg-white blur-lg opacity-75"></div>
      </div>
    </section>
  );
};

export default HeroSection;
