// src/features/main/IntroSection.tsx

import React, { useEffect, useState, forwardRef } from "react";
import { IntroSectionProps } from "../types/mainsection";

const IntroSection = forwardRef<HTMLDivElement, IntroSectionProps>(
  ({ features }, ref) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
        setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <section
        ref={ref}
        className="min-h-screen bg-white flex flex-col items-center justify-center text-center z-10 relative px-4 py-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-8 mt-6">
          소상고민으로 <br className="sm:hidden" />
          이런 액션이 가능합니다.
        </h2>

        <div className="max-w-md sm:max-w-3xl md:max-w-5xl w-full mx-auto">
          {isMobile || isTablet ? (
            // 모바일/태블릿용 (세로 정렬 - 일렬로 나란히)
            <div className="w-full flex flex-col items-center space-y-12 px-4 sm:px-6 md:px-8 mt-8 mb-10">
              {features.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-row items-center space-x-6 w-full max-w-md bg-white p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  {/* Step Number */}
                  <div
                    className="flex items-center justify-center flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white text-2xl sm:text-3xl font-bold shadow-md transition-transform duration-300 hover:scale-105"
                    style={{
                      backgroundColor: i % 2 === 0 ? "#16125D" : "#004ba6"
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Step Text */}
                  <p className="text-md sm:text-lg md:text-xl font-medium text-gray-800">
                    {item.shortTitle}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // ✅ 데스크탑 그대로 유지
            <div className="grid grid-cols-4 gap-6 md:gap-8 pt-4 md:pt-10 mt-18">
              {features.map((item, i) => {
                const mainColor = i % 2 === 0 ? "#16125D" : "#004ba6";
                return (
                  <div
                    key={i}
                    className="relative flex flex-col items-center justify-start"
                  >
                    <div className="relative flex items-center justify-center w-32 h-32 md:w-36 md:h-36 mb-2">
                      <div
                        className="absolute rounded-full opacity-10"
                        style={{
                          width: "210px",
                          height: "210px",
                          backgroundColor: mainColor,
                          zIndex: 0,
                          transform: "scale(1.5)"
                        }}
                      />
                      <div
                        className="relative flex items-center justify-center text-white text-sm font-semibold text-center rounded-full w-32 h-32 md:w-36 md:h-36 p-4 md:p-6 z-10"
                        style={{ backgroundColor: mainColor }}
                      >
                        {item.text}
                      </div>
                    </div>
                    <div className="w-[1px] h-16 sm:h-20 md:h-28 bg-gray-400"></div>
                    <div className="text-xs sm:text-sm text-gray-700 font-bold px-3 py-1 md:px-4 md:py-1 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
                      STEP {i + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }
);

IntroSection.displayName = "IntroSection";

export default IntroSection;
