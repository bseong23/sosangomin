import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ex_data from "@/assets/ex_data.png";
import ex_map from "@/assets/ex_map.png";
import ex_review from "@/assets/ex_review.png";

const features = [
  {
    image: ex_data,
    title: "매출 데이터로 심층 분석하기",
    description:
      "매출 데이터만 등록하면 쉽게 매출 현황과 개선점을 파악할 수 있어요.",
    link: "/data-analysis/upload"
  },
  {
    image: ex_review,
    title: "리뷰 분석을 통해 경쟁력 강화하기",
    description: "우리 가게 리뷰 분석을 통해 고객의 마음을 읽을 수 있어요.",
    link: "/map"
  },
  {
    image: ex_map,
    title: "상권 분석으로 고객 확보하기",
    description:
      "우리 지역에서 얼마나 많은 고객을 확보할 수 있는지 확인해 보세요.",
    link: "/result"
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
    // 스로틀링 적용 중이면 무시
    if (isThrottled.current) return;

    const introHeight = introRef.current?.offsetHeight || 0;
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;

    // 인트로 섹션을 완전히 지나갔는지 확인
    if (currentScroll < introHeight) {
      // 인트로 섹션 내에 있으면 기본 스크롤 동작 허용
      return;
    }

    // 슬라이드 섹션 내에 있을 때
    if (
      currentScroll >= introHeight &&
      currentScroll < introHeight + numOfPages * windowHeight
    ) {
      // 인트로를 지나간 직후 hasPassedIntro를 true로 설정
      if (!hasPassedIntro.current) {
        hasPassedIntro.current = true;
        setCurrentSlide(0);
      }

      // 첫 번째 슬라이드에 대한 특별 처리 - 스크롤 범위를 더 넓게 설정
      if (currentSlide === 0) {
        // 첫 번째 슬라이드에서는 스크롤 양이 더 많아야 다음 슬라이드로 넘어감
        // 첫 번째 슬라이드의 끝 부분에 도달했는지 확인
        const firstSlideEndThreshold = introHeight + windowHeight * 1.5; // 50% 더 스크롤해야 넘어감

        if (e.deltaY > 0 && currentScroll >= firstSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;

          setTimeout(() => {
            isThrottled.current = false;
          }, 1000);

          setCurrentSlide(1); // 두 번째 슬라이드로 이동
        } else if (e.deltaY > 0) {
          // 아직 첫 번째 슬라이드 끝에 도달하지 않았으면 스크롤만 허용
          return;
        } else if (e.deltaY < 0) {
          // 위로 스크롤할 때 인트로 쪽으로 돌아가는 것 허용
          return;
        }
      }
      // 세 번째 슬라이드(인덱스 2)에 대한 특별 처리
      else if (currentSlide === 2) {
        // 세 번째 슬라이드의 끝 부분에 도달했는지 확인
        const thirdSlideEndThreshold =
          introHeight + windowHeight * 1.5 + windowHeight * 2; // 두 번째 슬라이드 이후 50% 더 스크롤해야 넘어감

        if (e.deltaY > 0 && currentScroll >= thirdSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;

          setTimeout(() => {
            isThrottled.current = false;
          }, 1000);

          // 마지막 슬라이드로 이동
          if (currentSlide < numOfPages - 1) {
            setCurrentSlide(currentSlide + 1);
          }
        } else if (e.deltaY > 0) {
          // 아직 세 번째 슬라이드 끝에 도달하지 않았으면 스크롤만 허용
          return;
        } else if (e.deltaY < 0) {
          // 위로 스크롤 - 일반적인 슬라이드 이동 처리
          e.preventDefault();
          isThrottled.current = true;

          setTimeout(() => {
            isThrottled.current = false;
          }, 1000);

          setCurrentSlide((prev) => prev - 1);
        }
      } else {
        // 두 번째 슬라이드는 기존 로직 적용
        if (e.deltaY > 0) {
          // 아래로 스크롤
          if (currentSlide < numOfPages - 1) {
            e.preventDefault();
            isThrottled.current = true;

            setTimeout(() => {
              isThrottled.current = false;
            }, 1000);

            setCurrentSlide((prev) => prev + 1);
          }
        } else {
          // 위로 스크롤
          if (currentSlide > 0) {
            e.preventDefault();
            isThrottled.current = true;

            setTimeout(() => {
              isThrottled.current = false;
            }, 1000);

            setCurrentSlide((prev) => prev - 1);
          }
        }
      }
    } else if (currentScroll >= introHeight + numOfPages * windowHeight) {
      // 슬라이드 섹션을 모두 지나갔을 때 기본 스크롤 동작 허용
      return;
    }
  };

  // 스크롤 위치에 따라 현재 슬라이드 업데이트
  const handleScroll = () => {
    if (!introRef.current) return;

    const introHeight = introRef.current.offsetHeight;
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;

    // 인트로 섹션을 지나갔는지 확인
    if (currentScroll >= introHeight) {
      if (!hasPassedIntro.current) {
        hasPassedIntro.current = true;
        setCurrentSlide(0);
      }

      // 슬라이드 영역 내에서 스크롤 위치에 따라 현재 슬라이드 계산
      if (currentScroll < introHeight + numOfPages * windowHeight) {
        // 첫 번째 슬라이드 영역 (1.5배 확장된 영역)
        const firstSlideEndPos = introHeight + windowHeight * 1.5;

        if (currentScroll < firstSlideEndPos) {
          if (currentSlide !== 0) {
            setCurrentSlide(0);
          }
        }
        // 두 번째 슬라이드 영역 (일반 크기)
        else if (currentScroll < firstSlideEndPos + windowHeight) {
          if (currentSlide !== 1) {
            setCurrentSlide(1);
          }
        }
        // 세 번째 슬라이드 영역 (1.5배 확장된 영역)
        else if (
          currentScroll <
          firstSlideEndPos + windowHeight + windowHeight * 1.5
        ) {
          if (currentSlide !== 2) {
            setCurrentSlide(2);
          }
        }
        // 그 이후 슬라이드 영역
        else {
          const remainingScroll =
            currentScroll -
            (firstSlideEndPos + windowHeight + windowHeight * 1.5);
          const remainingSlideIndex =
            3 + Math.floor(remainingScroll / windowHeight);

          if (
            remainingSlideIndex !== currentSlide &&
            remainingSlideIndex < numOfPages
          ) {
            setCurrentSlide(remainingSlideIndex);
          }
        }
      }
    } else {
      // 인트로 섹션 내에 있을 때는 hasPassedIntro를 false로 리셋
      hasPassedIntro.current = false;
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 마운트 시 스크롤 위치 확인
    handleScroll();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentSlide]);

  return (
    <div className="relative" ref={featureSectionRef}>
      {/* 1. 인트로 */}
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

      {/* 2. 슬라이드 (스크롤 영역 확보용 래퍼) */}
      <section
        ref={slideWrapperRef}
        style={{ height: `${numOfPages * 100}vh` }}
        className="relative z-10"
      >
        {/* 실제 sticky 슬라이드 */}
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
                className="w-screen h-screen flex items-center justify-center flex-shrink-0 px-8 bg-white"
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
    </div>
  );
};

export default FeatureSection;
