// src/features/main/FeatureSection.tsx

import React, { useRef } from "react";
import IntroSection from "@/features/main/components/IntroSection";
import SlideSection from "@/features/main/components/SlideSection";
import final_report from "@/assets/final_report.gif";
import map_service from "@/assets/map_service.gif";
import review from "@/assets/review.gif";
import analyze from "@/assets/analyze.gif";

// 피처 데이터 정의
const features = [
  {
    image: analyze,
    title: "매출 데이터로 심층 분석하기",
    description:
      "매출 데이터만 등록하면 쉽게 매출 현황과 개선점을 파악할 수 있어요.",
    link: "/service_data",
    text: (
      <>
        매출 데이터로
        <br /> 심층 분석
      </>
    )
  },
  {
    image: review,
    title: "리뷰 분석을 통해 경쟁력 강화하기",
    description: "우리 가게 리뷰 분석을 통해 고객의 마음을 읽을 수 있어요.",
    link: "/service_review",
    text: (
      <>
        리뷰 분석으로
        <br /> 경쟁력 강화
      </>
    )
  },
  {
    image: map_service,
    title: "상권 분석으로 고객 확보하기",
    description:
      "우리 지역에서 얼마나 많은 고객을 확보할 수 있는지 확인해 보세요.",
    link: "/service_map",
    text: (
      <>
        상권 분석으로
        <br /> 고객 확보
      </>
    )
  },
  {
    image: final_report,
    title: "종합 분석",
    description: "SWOT 분석에 기반한 우리 매장 최종 분석 결과를 확인해 보세요.",
    link: "/service_report",
    text: "종합 분석"
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
