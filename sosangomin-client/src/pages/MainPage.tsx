import React, { useEffect, useState } from "react";
import HeroSection from "@/features/main/components/HeroSection";
import FeatureSection from "@/features/main/components/FeatureSection";
import CTASection from "@/features/main/components/CTASection";

const MainPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로딩 상태 관리
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 스크롤 관련 최적화를 위한 설정
  useEffect(() => {
    // 페이지 진입 시 스크롤 위치 초기화
    window.scrollTo(0, 0);

    // 성능 최적화를 위한 passive 스크롤 리스너
    document.addEventListener("touchstart", () => {}, { passive: true });
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FeatureSection />
      <CTASection />
    </div>
  );
};

export default MainPage;
