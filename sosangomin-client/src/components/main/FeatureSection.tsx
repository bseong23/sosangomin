import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ex_data from "@/assets/ex_data.png";
import ex_map from "@/assets/ex_map.png";
import ex_review from "@/assets/ex_review.png";
import ex_swot from "@/assets/ex_swot.png";

const features = [
  {
    image: ex_data,
    title: "매출 데이터로 심층 분석하기",
    description:
      "매출 데이터만 등록하면 쉽게 매출 현황과 개선점을 파악할 수 있어요.",
    link: "/service_data"
  },
  {
    image: ex_review,
    title: "리뷰 분석을 통해 경쟁력 강화하기",
    description: "우리 가게 리뷰 분석을 통해 고객의 마음을 읽을 수 있어요.",
    link: "/service_review"
  },
  {
    image: ex_map,
    title: "상권 분석으로 고객 확보하기",
    description:
      "우리 지역에서 얼마나 많은 고객을 확보할 수 있는지 확인해 보세요.",
    link: "/service_map"
  },
  {
    image: ex_swot,
    title: "종합 분석",
    description: "SWOT 분석에 기반한 우리 매장 최종 분석 결과를 확인해 보세요.",
    link: "/"
  }
];

const FeatureSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isThrottled = useRef(false);
  const numOfPages = features.length;
  const introRef = useRef<HTMLDivElement | null>(null);
  const featureSectionRef = useRef<HTMLDivElement | null>(null);
  const slideWrapperRef = useRef<HTMLDivElement | null>(null);
  const hasPassedIntro = useRef(false);

  const handleWheel = (e: WheelEvent) => {
    if (isThrottled.current) return;

    const introHeight = introRef.current?.offsetHeight || 0;
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;

    if (currentScroll < introHeight) return;

    if (
      currentScroll >= introHeight &&
      currentScroll < introHeight + numOfPages * windowHeight
    ) {
      if (!hasPassedIntro.current) {
        hasPassedIntro.current = true;
        setCurrentSlide(0);
      }

      // ⭐ step1 → step2
      if (currentSlide === 0) {
        const firstSlideEndThreshold = introHeight + windowHeight * 1.5;
        if (e.deltaY > 0 && currentScroll >= firstSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), 1000);
          setCurrentSlide(1);
        } else {
          return;
        }
      }

      // ⭐ step2 → step3 (스크롤 많이 해야 넘어감)
      else if (currentSlide === 1) {
        const secondSlideEndThreshold =
          introHeight + windowHeight * 1.5 + windowHeight * 1.5;
        if (e.deltaY > 0 && currentScroll >= secondSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), 1000);
          setCurrentSlide(2);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), 1000);
          setCurrentSlide(0);
        } else {
          return;
        }
      }

      // ⭐ step3
      else if (currentSlide === 2) {
        const thirdSlideEndThreshold =
          introHeight + windowHeight * 1.5 + windowHeight * 3;
        if (e.deltaY > 0 && currentScroll >= thirdSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), 1000);
          setCurrentSlide(3);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), 1000);
          setCurrentSlide(1);
        } else {
          return;
        }
      }
      // ⭐ step4
      else if (currentSlide === 3) {
        if (e.deltaY < 0) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), 1000);
          setCurrentSlide(2); // step3로 돌아가기
        }
      }
    }
  };

  const handleScroll = () => {
    if (!introRef.current) return;

    const introHeight = introRef.current.offsetHeight;
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;

    if (currentScroll >= introHeight) {
      if (!hasPassedIntro.current) {
        hasPassedIntro.current = true;
        setCurrentSlide(0);
      }

      const firstSlideEndPos = introHeight + windowHeight * 1.5;

      if (currentScroll < firstSlideEndPos) {
        if (currentSlide !== 0) setCurrentSlide(0);
      } else if (currentScroll < firstSlideEndPos + windowHeight) {
        if (currentSlide !== 1) setCurrentSlide(1);
      } else if (
        currentScroll <
        firstSlideEndPos + windowHeight + windowHeight * 1.5
      ) {
        if (currentSlide !== 2) setCurrentSlide(2);
      } else {
        if (currentSlide !== 3) setCurrentSlide(3);
      }
    } else {
      hasPassedIntro.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentSlide]);

  return (
    <div className="relative" ref={featureSectionRef}>
      {/* 인트로 */}
      <section
        ref={introRef}
        className="h-screen bg-white flex flex-col items-center justify-center text-center z-10 relative"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-30 mt-10">
          소상고민으로 <br className="md:hidden" />
          이런 액션이 가능합니다.
        </h2>
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
                className="relative flex flex-col items-center justify-start"
              >
                <div className="relative flex items-center justify-center w-40 h-40 mb-2">
                  <div
                    className="absolute rounded-full opacity-10"
                    style={{
                      width: "230px",
                      height: "230px",
                      backgroundColor: mainColor,
                      zIndex: 0,
                      transform: "scale(1.5)"
                    }}
                  />
                  <div
                    className="relative flex items-center justify-center text-white text-sm font-semibold text-center rounded-full w-40 h-40 p-6 z-10"
                    style={{ backgroundColor: mainColor }}
                  >
                    {text}
                  </div>
                </div>
                <div className="w-[1px] h-36 bg-gray-400" />
                <div className="text-sm text-gray-700 font-bold px-4 py-1 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
                  STEP {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 슬라이드 섹션 */}
      <section
        ref={slideWrapperRef}
        style={{ height: `${numOfPages * 120}vh` }}
        className="relative z-10"
      >
        <div className="sticky top-0 w-screen h-screen bg-white overflow-hidden z-10">
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{
              width: `${numOfPages * 100}vw`,
              transform: `translateX(-${currentSlide * 100}vw)`
            }}
          >
            {features.map((feature, i) => (
              <div
                key={i}
                className="w-screen h-screen flex items-center justify-center px-8 bg-white"
              >
                <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
                  <div className="w-full md:w-1/2 space-y-4">
                    <h4 className="text-xs text-gray-500 font-semibold">
                      STEP {i + 1}
                    </h4>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 text-base">
                      {feature.description}
                    </p>
                    <Link
                      to={feature.link}
                      className="inline-block text-yellow-500 font-semibold text-sm mt-4 hover:underline"
                    >
                      자세히 알아보기 →
                    </Link>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="max-h-[400px] object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 인디케이터 */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
            {features.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === currentSlide ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`슬라이드 ${i + 1}로 이동`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* STEP 4 */}
      {/* <section className="w-screen h-screen flex items-center justify-center px-8 bg-white">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 space-y-4">
            <h4 className="text-xs text-gray-500 font-semibold">STEP 4</h4>
            <h3 className="text-3xl font-bold text-gray-900">종합 분석</h3>
            <p className="text-gray-700 text-base">
              SWOT 분석에 기반한 우리 매장 최종 분석 결과를 확인해 보세요.
            </p>
            <Link
              to="/"
              className="inline-block text-yellow-500 font-semibold text-sm mt-4 hover:underline"
            >
              자세히 알아보기 →
            </Link>
          </div>
          <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
            <img
              src={ex_swot}
              alt="최종리포트"
              className="max-h-[400px] object-contain"
            />
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default FeatureSection;
