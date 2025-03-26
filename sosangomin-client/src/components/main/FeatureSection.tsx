import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    image: "src/assets/ex_data.png",
    bg: "bg-[#FFFEE0]",
    title: "간편한 매출 분석과 경영 인사이트",
    description:
      "복잡한 데이터 분석 없이도 쉽게 매출 현황과 개선점을 파악할 수 있어요.",
    link: "/data-analysis/upload",
    icon: "📊"
  },
  {
    image: "src/assets/ex_map.png",
    bg: "bg-[#F0F8FF]",
    title: "상권 분석과 경쟁점 비교",
    description:
      "주변 상권 정보와 경쟁점을 분석하여 자신의 위치를 객관적으로 파악할 수 있어요.",
    link: "/map",
    icon: "🗺️"
  },
  {
    image: "src/assets/ex_review.png",
    bg: "bg-[#F0FFF0]",
    title: "맞춤형 운영 전략 추천",
    description:
      "데이터 기반으로 가게 운영에 필요한 맞춤형 전략을 추천해드립니다.",
    link: "/result",
    icon: "🔍"
  },
  {
    image: "src/assets/ex_swot.png",
    bg: "bg-[#f9d8ed]",
    title: "최종 리포트 제공",
    description:
      "분석한 모든 내용을 기반으로 SWOT 형식의 리포트를 제공합니다다.",
    link: "/result",
    icon: "🔍"
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

  // 각 카드의 스크롤 구간을 명확하게 분리
  const sectionHeight = windowHeight * 2;
  const totalSectionHeight = sectionHeight * features.length;

  const getCardClasses = (index: number): React.CSSProperties => {
    // 각 카드의 시작 지점과 완료 지점 계산
    const startY = index * sectionHeight;
    const midY = startY + windowHeight; // 중간 지점 (카드가 완전히 올라온 상태)
    // const endY = startY + sectionHeight; // 다음 카드가 시작되는 지점

    // 현재 카드의 진행 상태 계산 (0~1)
    const rawProgress = (scrollY - startY) / windowHeight;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // 모든 카드가 동일한 초기 위치 (화면 아래쪽)에서 시작
    const initialTranslateY = 300; // 화면 아래에서 시작하는 값
    const translateY = initialTranslateY * (1 - progress);
    const scale = 0.9 + progress * 0.1;
    // 각 카드가 동일한 위치에서 시작하여 위로 올라오는 효과
    // 초기 translateY 값을 모든 카드에 동일하게 적용
    // const initialTranslateY = 200; // 화면 아래에서 시작하는 값
    // const translateY =
    //   progress < 0 ? initialTranslateY : initialTranslateY * (1 - progress);
    // const scale = 0.9 + progress * 0.1;

    // 카드가 보이는지 여부 결정 (이전 카드가 완전히 올라온 후에만 등장)
    let visibilityValue: "visible" | "hidden" = "visible";
    let opacity = 1;

    // 자신의 구간이 아직 시작되지 않았을 때는 숨김 처리
    if (scrollY < startY) {
      visibilityValue = "hidden";
      opacity = 0;
    }

    // 이전 카드가 완전히 올라온 이후에만 등장 (windowHeight 기준)
    // if (index > 0 && scrollY < index * sectionHeight - windowHeight) {
    //   visibilityValue = "hidden";
    //   opacity = 0;
    // }
    if (index > 0 && scrollY < startY - windowHeight * 0.3) {
      visibilityValue = "hidden";
      opacity = 0;
    }

    // 스택 위치 계산 (고정된 이후)
    const stackIndex = features.length - index - 1;
    const stackOffset = stackIndex * (cardHeight * (1 - overlapRatio));

    // 카드가 고정된 이후 위치 조정
    let finalTranslateY = translateY;
    if (scrollY > midY) {
      // 카드가 자리를 잡은 후 스택 형태로 배치
      finalTranslateY = -stackOffset;
    }

    // 카드가 화면에 등장할 때 같은 위치에서 시작해서 올라오도록 수정

    // 카드가 고정된 이후 (midY를 넘어선 이후)에는 스택 형태로 배치
    // if (scrollY > midY) {
    //   // 각 카드마다 적절한 간격으로 스택되도록 함
    //   finalTranslateY = -stackOffset;
    // }

    return {
      transform: `translateY(${finalTranslateY}px) scale(${scale})`,
      visibility: visibilityValue,
      opacity,
      transition: "all 0.3s ease-out",
      zIndex: features.length + index, // 나중에 등장하는 카드가 위에 오도록 z-index 조정
      top: `${stackOffset}px`,
      height: `${cardHeight}px`
    };
  };

  return (
    <div className="relative" style={{ height: `${totalSectionHeight}px` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div
          className="relative w-full max-w-4xl"
          style={{ height: `${cardHeight}px` }}
        >
          {features.map((feature, i) => {
            const cardStyle = getCardClasses(i);
            return (
              <div
                key={i}
                className={`absolute left-0 w-full overflow-hidden rounded-2xl shadow-xl border border-opacity-5 border-black ${feature.bg} transition-all duration-300`}
                style={cardStyle}
              >
                <div className="p-8 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl mr-3 shadow-sm">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="mb-6 text-gray-700">{feature.description}</p>
                  <div className="bg-white rounded-xl overflow-hidden mb-6 p-2 shadow border border-gray-200">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-auto object-contain rounded max-h-48"
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
