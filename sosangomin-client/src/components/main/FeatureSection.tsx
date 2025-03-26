import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ex_data from "@/assets/ex_data.png";
import ex_map from "@/assets/ex_map.png";
import ex_review from "@/assets/ex_review.png";

const features = [
  {
    image: ex_data,
    bg: "bg-[#FFFEE0]",
    title: "매출 데이터로 심층 분석하기",
    description:
      "매출 데이터만 등록하면 쉽게 매출 현황과 개선점을 파악할 수 있어요.",
    link: "/data-analysis/upload"
  },
  {
    image: ex_map,
    bg: "bg-[#F0F8FF]",
    title: "리뷰 분석을 통해 경쟁력 강화하기",
    description: "우리 가게 리뷰 분석을 통해 고객의 마음을 읽을 수 있어요.",
    link: "/map"
  },
  {
    image: ex_review,
    bg: "bg-[#F0FFF0]",
    title: "상권 분석으로 고객 확보하기",
    description:
      "우리 지역에서 얼마나 많은 고객을 확보할 수 있는지 확인해 보세요.",
    link: "/result"
  }
];

const FeatureSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(800);
  const cardHeight = 500;
  const overlapRatio = 0.1;

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sectionHeight = windowHeight * 2;
  const totalSectionHeight = sectionHeight * features.length;

  const getCardClasses = (index: number): React.CSSProperties => {
    const startY = index * sectionHeight;
    const midY = startY + windowHeight;
    const rawProgress = (scrollY - startY) / windowHeight;
    const progress = Math.max(0, Math.min(1, rawProgress));
    const initialTranslateY = 300;
    const translateY = initialTranslateY * (1 - progress);
    const scale = 0.9 + progress * 0.1;

    let visibilityValue: "visible" | "hidden" = "visible";
    let opacity = 1;

    if (scrollY < startY) {
      visibilityValue = "hidden";
      opacity = 0;
    }

    if (index > 0 && scrollY < startY - windowHeight * 0.3) {
      visibilityValue = "hidden";
      opacity = 0;
    }

    const stackIndex = features.length - index - 1;
    const stackOffset = stackIndex * (cardHeight * (1 - overlapRatio));
    let finalTranslateY = translateY;

    if (scrollY > midY) {
      finalTranslateY = -stackOffset;
    }

    return {
      transform: `translateY(${finalTranslateY}px) scale(${scale})`,
      visibility: visibilityValue,
      opacity,
      transition: "all 0.3s ease-out",
      zIndex: features.length + index,
      top: `${stackOffset}px`,
      height: `${cardHeight}px`
    };
  };

  return (
    <div className="relative" style={{ height: `${totalSectionHeight}px` }}>
      {/* ✅ 상단 소개 섹션 */}
      <div className="flex flex-col pt-40 items-center h-screen bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-16">
          소상고민으로 <br className="md:hidden" />
          이런 액션이 가능합니다.
        </h2>

        {/* ✅ 기능 동그라미 4개 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full pt-10">
          {[
            "매출 데이터로 심층 분석",
            "리뷰 분석으로 경쟁력 강화",
            "상권 분석으로 고객 확보",
            "종합 분석"
          ].map((text, i) => {
            const mainColor = i % 2 === 0 ? "#16125D" : "#004ba6";

            return (
              <div
                key={i}
                className="relative flex items-center justify-center"
              >
                {/* 흐린 큰 동그라미 (배경) */}
                <div
                  className="absolute rounded-full opacity-10"
                  style={{
                    width: "250px",
                    height: "250px",
                    backgroundColor: mainColor,
                    zIndex: 0
                  }}
                />
                {/* 진한 메인 동그라미 (텍스트 들어가는 부분) */}
                <div
                  className="relative flex items-center justify-center text-white text-sm font-semibold text-center rounded-full w-40 h-40 p-6 z-10 shadow-md"
                  style={{
                    backgroundColor: mainColor
                  }}
                >
                  {text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white">
        <div
          className="relative w-full max-w-4xl"
          style={{ height: `${cardHeight}px` }}
        >
          {features.map((feature, i) => {
            const cardStyle = getCardClasses(i);
            return (
              <div
                key={i}
                className={`absolute left-0 w-full overflow-hidden rounded-2xl shadow-xl border border-opacity-5 border-border ${feature.bg} transition-all duration-300`}
                style={cardStyle}
              >
                <div className="p-8 h-full">
                  <div className="flex items-center mb-4">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <div className="flex flex-1 gap-6 items-center">
                    <div className="flex-1 text-gray-700">
                      <p className="mb-6">{feature.description}</p>
                      <div className="bg-white rounded-xl overflow-hidden mb-6 p-2 shadow border border-gray-200">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-auto object-contain max-h-48 mx-auto"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Link
                          to={feature.link}
                          className="bg-black text-white font-medium px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
                        >
                          자세히 알아보기
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
