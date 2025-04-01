// 피처 데이터 타입 정의
export interface Feature {
  title: string;
  shortTitle: string;
  text: string;
}

export interface IntroSectionProps {
  features: Feature[];
}
