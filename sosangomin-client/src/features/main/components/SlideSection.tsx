// src/features/main/SlideSection.tsx

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

// 피처 데이터 타입 정의
interface Feature {
  image: string;
  title: string;
  description: string;
  link: string;
}

interface SlideSectionProps {
  features: Feature[];
  introRef: React.RefObject<HTMLDivElement | null>;
}

const SlideSection: React.FC<SlideSectionProps> = ({ features, introRef }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [slideVisibility, setSlideVisibility] = useState(0); // 0: 안보임, 1: 진입 중, 2: 완전히 보임, 3: 이탈 중
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const isThrottled = useRef(false);
  const numOfPages = features.length;
  const slideWrapperRef = useRef<HTMLDivElement | null>(null);
  const hasPassedIntro = useRef(false);
  const lastScrollPosition = useRef(0);
  const scrollDirection = useRef<"up" | "down">("down");

  // 반응형 화면 크기 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      // 스크롤 방향 감지
      scrollDirection.current =
        currentScroll > lastScrollPosition.current ? "down" : "up";
      lastScrollPosition.current = currentScroll;

      setScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWheel = (e: WheelEvent) => {
    if (isThrottled.current) return;
    if (!introRef.current) return;

    // 모바일과 태블릿에서는 wheel 이벤트 기반 제어 비활성화 (터치 스크롤 방식 사용)
    if (isMobile || isTablet) return;

    const introHeight = introRef.current.offsetHeight || 0;
    const currentScroll = scrollY;
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

      // 디바이스 크기에 따라 쓰로틀링 시간 조정
      const throttleTime = 600;

      //  step1 → step2
      if (currentSlide === 0) {
        const firstSlideEndThreshold = introHeight + windowHeight * 1.5;
        if (e.deltaY > 0 && currentScroll >= firstSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), throttleTime);
          setCurrentSlide(1);
        } else {
          return;
        }
      }

      //  step2 → step3
      else if (currentSlide === 1) {
        const secondSlideEndThreshold =
          introHeight + windowHeight * 1.5 + windowHeight * 1.5;
        if (e.deltaY > 0 && currentScroll >= secondSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), throttleTime);
          setCurrentSlide(2);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), throttleTime);
          setCurrentSlide(0);
        } else {
          return;
        }
      }

      //  step3
      else if (currentSlide === 2) {
        const thirdSlideEndThreshold =
          introHeight + windowHeight * 1.5 + windowHeight * 3;
        if (e.deltaY > 0 && currentScroll >= thirdSlideEndThreshold) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), throttleTime);
          setCurrentSlide(3);
        } else if (e.deltaY < 0) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), throttleTime);
          setCurrentSlide(1);
        } else {
          return;
        }
      }
      //  step4
      else if (currentSlide === 3) {
        if (e.deltaY < 0) {
          e.preventDefault();
          isThrottled.current = true;
          setTimeout(() => (isThrottled.current = false), throttleTime);
          setCurrentSlide(2); // step3로 돌아가기
        }
      }
    }
  };

  const handleScroll = () => {
    if (!introRef.current) return;

    const introTop = introRef.current.offsetTop;
    const introHeight = introRef.current.offsetHeight;
    const currentScroll = window.scrollY;
    const windowHeight = window.innerHeight;
    const dummyHeight = windowHeight;

    // 디바이스 크기에 따라 감지 구간 조정
    const enterThreshold = isMobile || isTablet ? 0.6 : 0.85;
    const exitThreshold = isMobile || isTablet ? 0.1 : 0.15;
    const sectionExitThreshold = isMobile || isTablet ? 0.2 : 0.3;

    // 진입 및 이탈 상태 결정
    const isEnteringSlideSection =
      currentScroll >= introTop + introHeight + dummyHeight * enterThreshold &&
      currentScroll < introTop + introHeight + dummyHeight;

    const isExitingSlideSection =
      currentScroll >=
        introTop +
          introHeight +
          dummyHeight +
          numOfPages * windowHeight -
          windowHeight * exitThreshold &&
      currentScroll <
        introTop + introHeight + dummyHeight + numOfPages * windowHeight;

    const isInSlideSection =
      currentScroll >= introTop + introHeight + dummyHeight &&
      currentScroll <
        introTop +
          introHeight +
          dummyHeight +
          numOfPages * windowHeight -
          windowHeight * sectionExitThreshold;

    // 슬라이드 가시성 상태 업데이트
    if (isEnteringSlideSection && scrollDirection.current === "down") {
      setSlideVisibility(1); // 진입 중
    } else if (isExitingSlideSection && scrollDirection.current === "up") {
      setSlideVisibility(3); // 이탈 중
    } else if (isInSlideSection) {
      setSlideVisibility(2); // 완전히 보임
    } else {
      setSlideVisibility(0); // 안보임
    }

    if (currentScroll >= introTop + introHeight) {
      if (!hasPassedIntro.current) {
        hasPassedIntro.current = true;
        setCurrentSlide(0);
      }

      // 디바이스 크기에 따라 슬라이드 전환 지점 조정
      const slideMultiplier = isMobile || isTablet ? 1 : 1.5;
      const firstSlideEndPos =
        introTop + introHeight + windowHeight * slideMultiplier;

      if (currentScroll < firstSlideEndPos) {
        if (currentSlide !== 0) setCurrentSlide(0);
      } else if (currentScroll < firstSlideEndPos + windowHeight) {
        if (currentSlide !== 1) setCurrentSlide(1);
      } else if (
        currentScroll <
        firstSlideEndPos + windowHeight + windowHeight * slideMultiplier
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
    // 모바일과 태블릿에서는 wheel 이벤트 제한하지 않음
    if (!isMobile && !isTablet) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentSlide, scrollY, isMobile, isTablet]);

  // 슬라이드 섹션 가시성에 따른 CSS 클래스와 스타일 계산
  const getSlideContainerStyles = () => {
    if (slideVisibility === 0) {
      return {
        opacity: 0,
        transform: "translateY(50px)",
        pointerEvents: "none" as "none"
      };
    } else if (slideVisibility === 1) {
      return {
        opacity: 1,
        transform: "translateY(0)",
        pointerEvents: "auto" as "auto"
      };
    } else if (slideVisibility === 2) {
      return {
        opacity: 1,
        transform: "translateY(0)",
        pointerEvents: "auto" as "auto"
      };
    } else {
      return {
        opacity: 0,
        transform: "translateY(-50px)",
        pointerEvents: "none" as "none"
      };
    }
  };

  // 슬라이드 수동 이동 함수 (모바일 터치용)
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section
      ref={slideWrapperRef}
      style={{
        height: `${numOfPages * (isMobile || isTablet ? 100 : 120)}vh`
      }}
      className="relative z-10"
    >
      {/* Dummy Trigger 영역 */}
      <div style={{ height: "100vh" }} />

      {/* 항상 렌더링하되 CSS로 가시성 제어 */}
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-white overflow-hidden z-10 transition-all duration-500 ease-in-out"
        style={getSlideContainerStyles()}
      >
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
              className="w-screen h-screen flex items-center justify-center px-4 sm:px-6 md:px-8"
            >
              <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-between p-6 sm:p-10 md:p-14 bg-blue-50 rounded-3xl shadow-xs">
                {/* 왼쪽 텍스트 영역 */}
                <div className="w-full md:w-1/2 space-y-2 sm:space-y-3 md:space-y-4 px-10 py-30 md:mb-0">
                  <h4 className="text-xs text-gray-500 font-semibold">
                    STEP {i + 1}
                  </h4>
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-comment transition-all duration-300 ease-out"
                    style={{
                      opacity: i === currentSlide ? 1 : 0.3,
                      transform:
                        i === currentSlide ? "translateY(0)" : "translateY(5px)"
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm sm:text-base text-gray-700 transition-all duration-300 ease-out delay-50  break-keep"
                    style={{
                      opacity: i === currentSlide ? 1 : 0.3,
                      transform:
                        i === currentSlide ? "translateY(0)" : "translateY(5px)"
                    }}
                  >
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="inline-block text-bit-main font-semibold text-xs sm:text-sm mt-2 sm:mt-4 hover:underline transition-all duration-300 ease-out delay-100"
                    style={{
                      opacity: i === currentSlide ? 1 : 0,
                      transform:
                        i === currentSlide ? "translateY(0)" : "translateY(5px)"
                    }}
                  >
                    자세히 알아보기 →
                  </Link>
                </div>

                {/* 오른쪽 이미지 영역 */}
                <div className="w-full md:w-1/2 flex justify-center mt-4 md:mt-0">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="max-h-[200px] sm:max-h-[300px] md:max-h-[400px] object-contain transition-all duration-500 ease-out"
                    style={{
                      opacity: i === currentSlide ? 1 : 0.3,
                      transform:
                        i === currentSlide
                          ? "scale(1) translateY(0)"
                          : "scale(0.98) translateY(10px)"
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 인디케이터 - 모바일/태블릿에서는 클릭 가능하게 설정 */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center gap-1 sm:gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSlideChange(i)}
              className={`h-2 sm:h-2 rounded-full transition-all duration-500 ease-out ${
                i === currentSlide
                  ? "bg-blue-600 w-2 sm:w-2"
                  : "bg-gray-300 w-2 sm:w-2"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SlideSection;
