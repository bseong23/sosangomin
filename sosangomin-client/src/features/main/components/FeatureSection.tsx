// // src/features/main/FeatureSection.tsx

// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import ex_data from "@/assets/ex_data.png";
// import ex_map from "@/assets/ex_map.png";
// import ex_review from "@/assets/ex_review.png";
// import ex_swot from "@/assets/ex_swot.png";

// const features = [
//   {
//     image: ex_data,
//     title: "매출 데이터로 심층 분석하기",
//     description:
//       "매출 데이터만 등록하면 쉽게 매출 현황과 개선점을 파악할 수 있어요.",
//     link: "/service_data"
//   },
//   {
//     image: ex_review,
//     title: "리뷰 분석을 통해 경쟁력 강화하기",
//     description: "우리 가게 리뷰 분석을 통해 고객의 마음을 읽을 수 있어요.",
//     link: "/service_review"
//   },
//   {
//     image: ex_map,
//     title: "상권 분석으로 고객 확보하기",
//     description:
//       "우리 지역에서 얼마나 많은 고객을 확보할 수 있는지 확인해 보세요.",
//     link: "/service_map"
//   },
//   {
//     image: ex_swot,
//     title: "종합 분석",
//     description: "SWOT 분석에 기반한 우리 매장 최종 분석 결과를 확인해 보세요.",
//     link: "/"
//   }
// ];

// const FeatureSection: React.FC = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [scrollY, setScrollY] = useState(0);
//   const [slideVisibility, setSlideVisibility] = useState(0); // 0: 안보임, 1: 진입 중, 2: 완전히 보임, 3: 이탈 중
//   const [isMobile, setIsMobile] = useState(false);
//   const [isTablet, setIsTablet] = useState(false);
//   const isThrottled = useRef(false);
//   const numOfPages = features.length;
//   const introRef = useRef<HTMLDivElement | null>(null);
//   const featureSectionRef = useRef<HTMLDivElement | null>(null);
//   const slideWrapperRef = useRef<HTMLDivElement | null>(null);
//   const hasPassedIntro = useRef(false);
//   const lastScrollPosition = useRef(0);
//   const scrollDirection = useRef<"up" | "down">("down");

//   // 반응형 화면 크기 감지
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 640);
//       setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
//     };

//     handleResize(); // 초기 실행
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScroll = window.scrollY;
//       // 스크롤 방향 감지
//       scrollDirection.current =
//         currentScroll > lastScrollPosition.current ? "down" : "up";
//       lastScrollPosition.current = currentScroll;

//       setScrollY(currentScroll);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleWheel = (e: WheelEvent) => {
//     if (isThrottled.current) return;

//     // 모바일과 태블릿에서는 wheel 이벤트 기반 제어 비활성화 (터치 스크롤 방식 사용)
//     if (isMobile || isTablet) return;

//     const introHeight = introRef.current?.offsetHeight || 0;
//     const currentScroll = scrollY;
//     const windowHeight = window.innerHeight;

//     if (currentScroll < introHeight) return;

//     if (
//       currentScroll >= introHeight &&
//       currentScroll < introHeight + numOfPages * windowHeight
//     ) {
//       if (!hasPassedIntro.current) {
//         hasPassedIntro.current = true;
//         setCurrentSlide(0);
//       }

//       // 디바이스 크기에 따라 쓰로틀링 시간 조정
//       const throttleTime = 600;

//       //  step1 → step2
//       if (currentSlide === 0) {
//         const firstSlideEndThreshold = introHeight + windowHeight * 1.5;
//         if (e.deltaY > 0 && currentScroll >= firstSlideEndThreshold) {
//           e.preventDefault();
//           isThrottled.current = true;
//           setTimeout(() => (isThrottled.current = false), throttleTime);
//           setCurrentSlide(1);
//         } else {
//           return;
//         }
//       }

//       //  step2 → step3
//       else if (currentSlide === 1) {
//         const secondSlideEndThreshold =
//           introHeight + windowHeight * 1.5 + windowHeight * 1.5;
//         if (e.deltaY > 0 && currentScroll >= secondSlideEndThreshold) {
//           e.preventDefault();
//           isThrottled.current = true;
//           setTimeout(() => (isThrottled.current = false), throttleTime);
//           setCurrentSlide(2);
//         } else if (e.deltaY < 0) {
//           e.preventDefault();
//           isThrottled.current = true;
//           setTimeout(() => (isThrottled.current = false), throttleTime);
//           setCurrentSlide(0);
//         } else {
//           return;
//         }
//       }

//       //  step3
//       else if (currentSlide === 2) {
//         const thirdSlideEndThreshold =
//           introHeight + windowHeight * 1.5 + windowHeight * 3;
//         if (e.deltaY > 0 && currentScroll >= thirdSlideEndThreshold) {
//           e.preventDefault();
//           isThrottled.current = true;
//           setTimeout(() => (isThrottled.current = false), throttleTime);
//           setCurrentSlide(3);
//         } else if (e.deltaY < 0) {
//           e.preventDefault();
//           isThrottled.current = true;
//           setTimeout(() => (isThrottled.current = false), throttleTime);
//           setCurrentSlide(1);
//         } else {
//           return;
//         }
//       }
//       //  step4
//       else if (currentSlide === 3) {
//         if (e.deltaY < 0) {
//           e.preventDefault();
//           isThrottled.current = true;
//           setTimeout(() => (isThrottled.current = false), throttleTime);
//           setCurrentSlide(2); // step3로 돌아가기
//         }
//       }
//     }
//   };

//   const handleScroll = () => {
//     if (!introRef.current) return;

//     const introTop = introRef.current.offsetTop;
//     const introHeight = introRef.current.offsetHeight;
//     const currentScroll = window.scrollY;
//     const windowHeight = window.innerHeight;
//     const dummyHeight = windowHeight;

//     // 디바이스 크기에 따라 감지 구간 조정
//     const enterThreshold = isMobile || isTablet ? 0.6 : 0.85;
//     const exitThreshold = isMobile || isTablet ? 0.1 : 0.15;
//     const sectionExitThreshold = isMobile || isTablet ? 0.2 : 0.3;

//     // 진입 및 이탈 상태 결정
//     const isEnteringSlideSection =
//       currentScroll >= introTop + introHeight + dummyHeight * enterThreshold &&
//       currentScroll < introTop + introHeight + dummyHeight;

//     const isExitingSlideSection =
//       currentScroll >=
//         introTop +
//           introHeight +
//           dummyHeight +
//           numOfPages * windowHeight -
//           windowHeight * exitThreshold &&
//       currentScroll <
//         introTop + introHeight + dummyHeight + numOfPages * windowHeight;

//     const isInSlideSection =
//       currentScroll >= introTop + introHeight + dummyHeight &&
//       currentScroll <
//         introTop +
//           introHeight +
//           dummyHeight +
//           numOfPages * windowHeight -
//           windowHeight * sectionExitThreshold;

//     // 슬라이드 가시성 상태 업데이트
//     if (isEnteringSlideSection && scrollDirection.current === "down") {
//       setSlideVisibility(1); // 진입 중
//     } else if (isExitingSlideSection && scrollDirection.current === "up") {
//       setSlideVisibility(3); // 이탈 중
//     } else if (isInSlideSection) {
//       setSlideVisibility(2); // 완전히 보임
//     } else {
//       setSlideVisibility(0); // 안보임
//     }

//     if (currentScroll >= introTop + introHeight) {
//       if (!hasPassedIntro.current) {
//         hasPassedIntro.current = true;
//         setCurrentSlide(0);
//       }

//       // 디바이스 크기에 따라 슬라이드 전환 지점 조정
//       const slideMultiplier = isMobile || isTablet ? 1 : 1.5;
//       const firstSlideEndPos =
//         introTop + introHeight + windowHeight * slideMultiplier;

//       if (currentScroll < firstSlideEndPos) {
//         if (currentSlide !== 0) setCurrentSlide(0);
//       } else if (currentScroll < firstSlideEndPos + windowHeight) {
//         if (currentSlide !== 1) setCurrentSlide(1);
//       } else if (
//         currentScroll <
//         firstSlideEndPos + windowHeight + windowHeight * slideMultiplier
//       ) {
//         if (currentSlide !== 2) setCurrentSlide(2);
//       } else {
//         if (currentSlide !== 3) setCurrentSlide(3);
//       }
//     } else {
//       hasPassedIntro.current = false;
//     }
//   };

//   useEffect(() => {
//     // 모바일과 태블릿에서는 wheel 이벤트 제한하지 않음
//     if (!isMobile && !isTablet) {
//       window.addEventListener("wheel", handleWheel, { passive: false });
//     }
//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => {
//       window.removeEventListener("wheel", handleWheel);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [currentSlide, scrollY, isMobile, isTablet]);

//   // 슬라이드 섹션 가시성에 따른 CSS 클래스와 스타일 계산
//   const getSlideContainerStyles = () => {
//     if (slideVisibility === 0) {
//       return {
//         opacity: 0,
//         transform: "translateY(50px)",
//         pointerEvents: "none" as "none"
//       };
//     } else if (slideVisibility === 1) {
//       return {
//         opacity: 1,
//         transform: "translateY(0)",
//         pointerEvents: "auto" as "auto"
//       };
//     } else if (slideVisibility === 2) {
//       return {
//         opacity: 1,
//         transform: "translateY(0)",
//         pointerEvents: "auto" as "auto"
//       };
//     } else {
//       return {
//         opacity: 0,
//         transform: "translateY(-50px)",
//         pointerEvents: "none" as "none"
//       };
//     }
//   };

//   // 슬라이드 수동 이동 함수 (모바일 터치용)
//   const handleSlideChange = (index: number) => {
//     setCurrentSlide(index);
//   };

//   return (
//     <div className="relative" ref={featureSectionRef}>
//       {/* 인트로 */}
//       <section
//         ref={introRef}
//         className="min-h-screen bg-white flex flex-col items-center justify-center text-center z-10 relative px-4 py-12"
//       >
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-8 md:mb-8 mt-6">
//           소상고민으로 <br className="sm:hidden" />
//           이런 액션이 가능합니다.
//         </h2>

//         {/* 디바이스 크기별 레이아웃 조정 */}
//         <div className="max-w-md sm:max-w-3xl md:max-w-5xl w-full mx-auto">
//           <div
//             className={`${
//               isMobile
//                 ? "space-y-8"
//                 : isTablet
//                 ? "grid grid-cols-1"
//                 : "grid grid-cols-4 gap-6 md:gap-8 mt-15"
//             } pt-4 md:pt-10`}
//           >
//             {[
//               {
//                 text: "매출 데이터로 심층 분석",
//                 title: "매출 데이터로 심층 분석하기",
//                 shortTitle: "매출 데이터로 심층 분석"
//               },
//               {
//                 text: "리뷰 분석으로 경쟁력 강화",
//                 title: "리뷰 분석을 통해 경쟁력 강화하기",
//                 shortTitle: "리뷰 분석으로 경쟁력 강화"
//               },
//               {
//                 text: "상권 분석으로 고객 확보",
//                 title: "상권 분석으로 고객 확보하기",
//                 shortTitle: "상권 분석으로 고객 확보"
//               },
//               {
//                 text: "종합 분석",
//                 title: "종합 분석",
//                 shortTitle: "종합 분석"
//               }
//             ].map((item, i) => {
//               const mainColor = i % 2 === 0 ? "#16125D" : "#004ba6";

//               {
//                 /* 모바일 / 태블릿용 타임라인 레이아웃 */
//               }
//               {
//                 (isMobile || isTablet) && (
//                   <div className="space-y-10 relative mt-10">
//                     <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

//                     {features.map((item, i) => (
//                       <div
//                         key={i}
//                         className="relative flex items-start space-x-4"
//                       >
//                         {/* Number */}
//                         <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold z-10">
//                           {i + 1}
//                         </div>

//                         {/* Text Content */}
//                         <div className="flex flex-col">
//                           <span className="text-xs text-gray-500 font-semibold">
//                             STEP {i + 1}
//                           </span>
//                           <span className="text-base font-bold mt-1">
//                             {item.description}
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 );
//               }

//               // 데스크톱용 레이아웃
//               return (
//                 <div
//                   key={i}
//                   className="relative flex flex-col items-center justify-start"
//                 >
//                   <div className="relative flex items-center justify-center w-32 h-32 md:w-36 md:h-36 mb-2">
//                     <div
//                       className="absolute rounded-full opacity-10"
//                       style={{
//                         width: "210px",
//                         height: "210px",
//                         backgroundColor: mainColor,
//                         zIndex: 0,
//                         transform: "scale(1.5)"
//                       }}
//                     />
//                     <div
//                       className="relative flex items-center justify-center text-white text-sm font-semibold text-center rounded-full w-32 h-32 md:w-36 md:h-36 p-4 md:p-6 z-10"
//                       style={{ backgroundColor: mainColor }}
//                     >
//                       {item.text}
//                     </div>
//                   </div>
//                   <div className="w-[1px] h-16 sm:h-20 md:h-28 bg-gray-400"></div>
//                   <div className="text-xs sm:text-sm text-gray-700 font-bold px-3 py-1 md:px-4 md:py-1 rounded-full bg-gray-50 border border-gray-200 shadow-sm">
//                     STEP {i + 1}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* 슬라이드 섹션 */}
//       <section
//         ref={slideWrapperRef}
//         style={{
//           height: `${numOfPages * (isMobile || isTablet ? 100 : 120)}vh`
//         }}
//         className="relative z-10"
//       >
//         {/* Dummy Trigger 영역 */}
//         <div style={{ height: "100vh" }} />

//         {/* 항상 렌더링하되 CSS로 가시성 제어 */}
//         <div
//           className="fixed top-0 left-0 w-screen h-screen bg-white overflow-hidden z-10 transition-all duration-500 ease-in-out"
//           style={getSlideContainerStyles()}
//         >
//           <div
//             className="flex h-full transition-transform duration-700 ease-in-out"
//             style={{
//               width: `${numOfPages * 100}vw`,
//               transform: `translateX(-${currentSlide * 100}vw)`
//             }}
//           >
//             {features.map((feature, i) => (
//               <div
//                 key={i}
//                 className="w-screen h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-white"
//               >
//                 <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between">
//                   <div className="w-full md:w-1/2 space-y-2 sm:space-y-3 md:space-y-4 mb-6 md:mb-0">
//                     <h4 className="text-xs text-gray-500 font-semibold">
//                       STEP {i + 1}
//                     </h4>
//                     <h3
//                       className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 transition-all duration-300 ease-out"
//                       style={{
//                         opacity: i === currentSlide ? 1 : 0.3,
//                         transform:
//                           i === currentSlide
//                             ? "translateY(0)"
//                             : "translateY(5px)"
//                       }}
//                     >
//                       {feature.title}
//                     </h3>
//                     <p
//                       className="text-sm sm:text-base text-gray-700 transition-all duration-300 ease-out delay-50"
//                       style={{
//                         opacity: i === currentSlide ? 1 : 0.3,
//                         transform:
//                           i === currentSlide
//                             ? "translateY(0)"
//                             : "translateY(5px)"
//                       }}
//                     >
//                       {feature.description}
//                     </p>
//                     <Link
//                       to={feature.link}
//                       className="inline-block text-yellow-500 font-semibold text-xs sm:text-sm mt-2 sm:mt-4 hover:underline transition-all duration-300 ease-out delay-100"
//                       style={{
//                         opacity: i === currentSlide ? 1 : 0,
//                         transform:
//                           i === currentSlide
//                             ? "translateY(0)"
//                             : "translateY(5px)"
//                       }}
//                     >
//                       자세히 알아보기 →
//                     </Link>
//                   </div>
//                   <div className="w-full md:w-1/2 flex justify-center mt-4 md:mt-0">
//                     <img
//                       src={feature.image}
//                       alt={feature.title}
//                       className="max-h-[200px] sm:max-h-[300px] md:max-h-[400px] object-contain transition-all duration-500 ease-out"
//                       style={{
//                         opacity: i === currentSlide ? 1 : 0.3,
//                         transform:
//                           i === currentSlide
//                             ? "scale(1) translateY(0)"
//                             : "scale(0.98) translateY(10px)"
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* 인디케이터 - 모바일/태블릿에서는 클릭 가능하게 설정 */}
//           <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center gap-1 sm:gap-2">
//             {features.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handleSlideChange(i)}
//                 className={`h-2 sm:h-3 rounded-full transition-all duration-500 ease-out ${
//                   i === currentSlide
//                     ? "bg-blue-600 w-4 sm:w-6"
//                     : "bg-gray-300 w-2 sm:w-3"
//                 }`}
//                 aria-label={`Slide ${i + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default FeatureSection;

// src/features/main/FeatureSection.tsx

import React, { useRef } from "react";
import IntroSection from "@/features/main/components/IntroSection";
import SlideSection from "@/features/main/components/SlideSection";
import ex_data from "@/assets/ex_data.png";
import ex_map from "@/assets/ex_map.png";
import ex_review from "@/assets/ex_review.png";
import ex_swot from "@/assets/ex_swot.png";

// 피처 데이터 정의
const features = [
  {
    image: ex_data,
    title: "매출 데이터로 심층 분석하기",
    description:
      "매출 데이터만 등록하면 쉽게 매출 현황과 개선점을 파악할 수 있어요.",
    link: "/service_data",
    text: "매출 데이터로 심층 분석",
    shortTitle: "매출 데이터로 심층 분석"
  },
  {
    image: ex_review,
    title: "리뷰 분석을 통해 경쟁력 강화하기",
    description: "우리 가게 리뷰 분석을 통해 고객의 마음을 읽을 수 있어요.",
    link: "/service_review",
    text: "리뷰 분석으로 경쟁력 강화",
    shortTitle: "리뷰 분석으로 경쟁력 강화"
  },
  {
    image: ex_map,
    title: "상권 분석으로 고객 확보하기",
    description:
      "우리 지역에서 얼마나 많은 고객을 확보할 수 있는지 확인해 보세요.",
    link: "/service_map",
    text: "상권 분석으로 고객 확보",
    shortTitle: "상권 분석으로 고객 확보"
  },
  {
    image: ex_swot,
    title: "종합 분석",
    description: "SWOT 분석에 기반한 우리 매장 최종 분석 결과를 확인해 보세요.",
    link: "/",
    text: "종합 분석",
    shortTitle: "종합 분석"
  }
];

const FeatureSection: React.FC = () => {
  const introRef = useRef<HTMLDivElement>(null);
  const featureSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={featureSectionRef}>
      {/* 인트로 섹션 */}
      <IntroSection features={features} ref={introRef} />

      {/* 슬라이드 섹션 */}
      <SlideSection features={features} introRef={introRef} />
    </div>
  );
};

export default FeatureSection;
