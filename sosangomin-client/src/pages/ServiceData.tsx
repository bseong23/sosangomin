import React from "react";
import ServiceOverview from "@/features/service/ServiceOverview";
import FeatureCard from "@/features/service/FeatureCard";
import InsightCards from "@/features/main/components/InsightCards";
import StepGuide from "@/features/service/StepGuide";
import CtaSection from "@/features/service/CtaSection";

const FeatureItem: React.FC<{ title: string; description: string }> = ({
  title,
  description
}) => {
  return (
    <div className="w-full bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md">
      <div className="flex items-center text-bit-main mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed min-h-[48px]">
        {description}
      </p>
    </div>
  );
};

const FeatureIntroductionPage: React.FC = () => {
  const featureCardsData = [
    {
      title: "매출 데이터 분석",
      headerColor: "bg-bit-main",
      imagePlaceholder: "/images/sales-trend.png",
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
      imagePlaceholder: "/images/product-chart.png",
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
            "함께 판매되는 상품 패턴을 분석하여 번들링 전략을 수립합니다."
        }
      ]
    },
    {
      title: "결제 방식 분석",
      headerColor: "bg-bit-main",
      imagePlaceholder: "/images/payment-method.png",
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
            "시간에 따른 결제 방식의 변화를 추적하여 트렌드를 파악합니다."
        }
      ]
    }
  ];

  const insights = [
    "월요일과 목요일에 신규 고객 방문이 20% 증가했습니다.",
    "아메리카노와 베이글을 함께 구매하는 패턴이 35% 증가했습니다.",
    "저녁 6-8시에 매출이 가장 높으며, 총 매출의 28%를 차지합니다."
  ];

  const recommendations = [
    "월요일과 목요일에 '아침 시작 세트' 프로모션을 진행해보세요.",
    "아메리카노와 베이글 세트 메뉴를 구성해 10% 할인된 가격에 제공하세요.",
    "저녁 피크 타임에 인력을 보강해 대기 시간을 줄이고 매출을 극대화하세요."
  ];

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

  const ctaData = {
    title: "지금 바로 데이터 분석을 시작하세요!",
    description:
      "POS 데이터를 업로드하면 자동으로 인사이트를 도출해드립니다. 우리 서비스와 함께 더 스마트한 운영 전략을 세워보세요.",
    buttonText: "데이터 분석 시작하기"
  };

  return (
    <div className="bg-white">
      <main className="max-w-screen-xl mx-auto px-6 py-20 space-y-32">
        {/* 타이틀 섹션 수정 */}
        <section className="grid md:grid-cols-2 gap-16 items-start min-h-[300px]">
          <div className="flex items-center h-full">
            <h2 className="text-8xl font-bold text-bit-main flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 mr-3 text-bit-main"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6,5 L3,19 L8,19 L8,5 Z M13,5 L10,19 L15,19 L15,5 Z" />
              </svg>
              데이터 분석
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 ml-3 text-bit-main"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9,5 L9,19 L14,19 L11,5 Z M16,5 L16,19 L21,19 L18,5 Z" />
              </svg>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "간편한 데이터 업로드",
                description: "POS기 데이터를 간단하게 업로드하고 분석 시작"
              },
              {
                title: "직관적인 데이터 시각화",
                description: "차트와 그래프로 분석 결과를 쉽게 이해"
              },
              {
                title: "맞춤형 비즈니스 인사이트",
                description: "실행 가능한 개선 방안을 자동으로 도출"
              }
            ].map((item, idx) => (
              <FeatureItem
                key={idx}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-bit-main">
            POS 데이터 분석 핵심 기능
          </h2>
          <div className="space-y-12">
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
        </section>

        <InsightCards insights={insights} recommendations={recommendations} />

        <StepGuide steps={steps} />

        <CtaSection
          title={ctaData.title}
          description={ctaData.description}
          buttonText={ctaData.buttonText}
          onButtonClick={() => console.log("분석 시작하기 클릭")}
        />
      </main>
    </div>
  );
};

export default FeatureIntroductionPage;
