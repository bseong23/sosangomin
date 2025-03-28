import React from "react";
import ServiceOverview from "@/features/service/ServiceOverview";
import FeatureCard from "@/features/service/FeatureCard";
import InsightSection from "@/features/service/InsightSection";
import StepGuide from "@/features/service/StepGuide";
import CtaSection from "@/features/service/CtaSection";

const FeatureIntroductionPage: React.FC = () => {
  // 기능 카드에 사용할 데이터
  const featureCardsData = [
    {
      title: "매출 데이터 분석",
      headerColor: "bg-bit-main",
      imagePlaceholder: "매출 트렌드 차트 이미지 (추후 추가)",
      points: [
        {
          title: "일별, 월별, 연도별 매출 추이",
          description: "날짜별 매출 데이터를 분석하여 트렌드를 파악합니다."
        },
        {
          title: "요일별, 시간대별 매출 패턴",
          description:
            "고객 방문이 많은 시간대를 찾아 효율적인 인력 배치가 가능합니다."
        },
        {
          title: "객단가 분석",
          description:
            "고객당 평균 지출액을 분석하여 매출 증대 전략을 수립할 수 있습니다."
        }
      ]
    },
    {
      title: "상품 판매 분석",
      headerColor: "bg-bit-main",
      imagePlaceholder: "상품 판매량 차트 이미지 (추후 추가)",
      points: [
        {
          title: "상품별 판매량 및 매출 기여도",
          description: "각 상품의 판매 성과를 확인할 수 있습니다."
        },
        {
          title: "인기 상품 및 부진 상품 분석",
          description:
            "인기 있는 상품과 부진한 상품을 파악하여 재고 관리를 최적화합니다."
        },
        {
          title: "상품 조합 분석",
          description:
            "함께 판매되는 상품 패턴을 분석하여 효과적인 번들링 전략을 수립할 수 있습니다."
        }
      ]
    },
    {
      title: "고객 행동 분석",
      headerColor: "bg-bit-main",
      imagePlaceholder: "고객 세그먼트 차트 이미지 (추후 추가)",
      points: [
        {
          title: "방문 빈도 및 재방문율",
          description: "고객의 재방문 패턴을 분석하여 충성도를 측정합니다."
        },
        {
          title: "고객 세그먼트 분석",
          description:
            "구매 패턴에 따라 고객을 분류하여 타겟 마케팅이 가능합니다."
        },
        {
          title: "단골 고객 분석",
          description:
            "핵심 고객층을 파악하여 고객 관계 관리를 강화할 수 있습니다."
        }
      ]
    },
    {
      title: "결제 방식 분석",
      headerColor: "bg-bit-main",
      imagePlaceholder: "결제 수단 분포 차트 이미지 (추후 추가)",
      points: [
        {
          title: "결제 수단 선호도",
          description: "고객이 선호하는 결제 방식을 파악할 수 있습니다."
        },
        {
          title: "결제 수단별 객단가 분석",
          description: "결제 방식에 따른 구매 금액 차이를 분석합니다."
        },
        {
          title: "결제 수단별 트렌드",
          description:
            "시간에 따른 결제 방식의 변화를 추적하여 시장 트렌드를 파악합니다."
        }
      ]
    }
  ];

  // 인사이트와 추천사항 데이터
  const insights = [
    "월요일과 목요일에 신규 고객 방문이 20% 증가했습니다.",
    "아메리카노와 베이글을 함께 구매하는 패턴이 35% 증가했습니다.",
    "저녁 6-8시에 매출이 가장 높으며, 총 매출의 28%를 차지합니다."
  ];

  const recommendations = [
    "월요일과 목요일에 '아침 시작 세트' 프로모션을 진행하여 신규 고객을 유치하세요.",
    "아메리카노와 베이글 세트 메뉴를 구성하여 10% 할인된 가격에 제공하세요.",
    "저녁 피크 타임에 추가 인력을 배치하여 고객 대기 시간을 줄이고 매출을 극대화하세요."
  ];

  // 이용 방법 단계
  const steps = [
    {
      number: 1,
      title: "데이터 업로드",
      description: "POS기에서 추출한 데이터 파일을 업로드합니다."
    },
    {
      number: 2,
      title: "데이터 유형 선택",
      description: "분석하고자 하는 데이터 유형을 선택합니다."
    },
    {
      number: 3,
      title: "분석 실행",
      description: "데이터 분석 버튼을 클릭하여 분석을 시작합니다."
    },
    {
      number: 4,
      title: "인사이트 확인",
      description: "분석 결과와 맞춤형 추천을 확인합니다."
    }
  ];

  // CTA 섹션 데이터
  const ctaData = {
    title: "지금 바로 시작하세요!",
    description:
      "소상공인 데이터 분석 서비스로 비즈니스 성과를 높이고 효율적인 운영 전략을 수립하세요. 데이터를 통한 인사이트로 더 나은 비즈니스 의사결정을 지원합니다.",
    buttonText: "서비스 시작하기"
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <ServiceOverview />

        <h2 className="text-2xl font-bold text-center mb-8 text-bit-main">
          핵심 분석 기능
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featureCardsData.map((card, index) => (
            <FeatureCard
              key={index}
              title={card.title}
              headerColor={card.headerColor}
              imagePlaceholder={card.imagePlaceholder}
              points={card.points}
            />
          ))}
        </div>

        <InsightSection insights={insights} recommendations={recommendations} />

        <StepGuide steps={steps} />

        <CtaSection
          title={ctaData.title}
          description={ctaData.description}
          buttonText={ctaData.buttonText}
          onButtonClick={() => console.log("서비스 시작하기 버튼 클릭")}
        />
      </main>
    </div>
  );
};

export default FeatureIntroductionPage;
