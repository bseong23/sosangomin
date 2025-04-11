import React from "react";

// 피처 데이터 타입 정의
export interface Feature {
  title: string;
  text: React.ReactNode;
}

export interface IntroSectionProps {
  features: Feature[];
}
