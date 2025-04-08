import React from "react";
import FeatureCard from "@/features/service/FeatureCard";
import InsightCards from "@/features/main/components/InsightCards";
import StepGuide from "@/features/service/StepGuide";
import service1 from "@/assets/service1.png";
import service2 from "@/assets/service2.png";
import service3 from "@/assets/service3.png";

interface FeatureItemProps {
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => {
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition duration-300 ">
      <div className="flex items-center text-bit-main mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
        <h3 className="text-lg break-words font-semibold">{title}</h3>
      </div>
      <p className="text-gray-700 break-words leading-relaxed min-h-[48px] pl-9">
        {description}
      </p>
    </div>
  );
};

const DataAnalysisPage: React.FC = () => {
  const featureCards = [
    {
        title: "매출 데이터 분석",
        headerColor: "bg-bit-main",
        image: service1,
        points: [
            {
                title: "요일 및 시간대별 매출 분석",
                description: "요일, 시간대, 평일·주말별 매출 분포를 분석해 방문 집중 구간을 파악합니다."
            },
            {
                title: "계절 및 날씨에 따른 매출 변화",
                description: "계절과 날씨에 따른 매출 변화를 분석해 시기별 운영 전략 수립에 활용합니다."
            },
            {
                title: "30일 매출 예측",
                description: "최근 데이터를 기반으로 향후 30일간의 매출 흐름을 예측해 사전 대응에 도움을 줍니다."
            }
        ]
    },
    {
        title: "상품 판매 분석",
        headerColor: "bg-bit-main",
        image: service2,
        points: [
            {
                title: "인기 상품 분석",
                description:
                "판매량을 기준으로 상품의 인기도를 분석해 상위 인기 제품을 도출합니다."
            },
            {
                title: "상품별 판매 성과 분석",
                description: "판매 금액을 기준으로 매출 기여도가 높은 핵심 제품을 식별합니다."
            },
            {
                title: "상품 조합 분석",
                description:
                    "자주 함께 구매되는 상품 조합을 분석해 세트 구성 및 교차 판매 전략을 도출합니다."
            }
        ]
    },
    {
        title: "데이터 분석 기반 전략 제안", 
        headerColor: "bg-bit-main",
        image: service3,
        points: [
            {
                title: "핵심 요약",
                description: "POS 데이터를 분석해 매출, 상품, 고객 흐름 등 주요 내용을 한눈에 정리해 제공합니다."
            },
            {
                title: "운영 전략 제안",
                description: "분석 결과를 바탕으로 시간대, 요일, 메뉴 구성 등 다양한 맞춤형 운영 전략을 제안합니다."
            },
            {
                title: "데이터 기반 인사이트 제공",
                description: "숫자로만 보던 데이터를 쉽게 해석할 수 있도록 시각화하고, 해석 중심의 인사이트를 전달합니다."
            }
        ]
    }
  ];

  const insights = [
    "주말(토요일·일요일) 매출이 평일 대비 평균 15% 높게 나타났습니다.",
    "매출 상위 3개 제품은 모두 소형 사이즈로, 고객이 작은 단위의 제품을 선호하는 경향이 확인됩니다.",
    "점심시간(12시13시)과 저녁 피크타임(18시19시)에 각각 하루 매출의 20% 이상이 집중되어 있습니다."
  ];

  const recommendations = [
    "주말에는 매출이 높은 인기 메뉴 위주로 구성한 세트 상품을 진열대 앞쪽에 배치하고, '주말 한정' 스티커로 시선을 끌어보세요.",
    "소형 사이즈 제품이 잘 팔리는 특성을 활용해, 아메리카노 + 미니 베이글 세트를 500원 할인된 가격에 제공해보세요.",
    "점심·저녁 피크타임에는 포장 전용 직원이나 키오스크 유도를 통해 회전율을 높이고, 대기 줄을 줄이는 데 집중하세요."
  ];

  const steps = [
    {
      number: 1,
      title: "데이터 업로드",
      description: "POS기에서 추출한 데이터 파일을 업로드합니다."
    },
    {
      number: 2,
      title: "분석 실행",
      description: "데이터 분석 버튼을 클릭하여 분석을 시작합니다."
    },
    {
      number: 3,
      title: "인사이트 확인",
      description: "분석 결과와 맞춤형 추천을 확인합니다."
    }
  ];

  return (
    <div className="bg-gray-50">
      <main className="max-w-screen-xl mx-auto px-20 py-16 space-y-32">
        {/* 타이틀 섹션 */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl break-words font-bold text-gray-900">
              <span className="text-bit-main break-words">데이터 분석</span>으로
              <br />
              매출 향상을 경험하세요
            </h1>
            <p className="text-sm break-words text-gray-700 leading-relaxed">
              가게의 POS 데이터를 분석하여 매출 현황과 개선점을 한눈에
              파악하세요. 데이터 기반 의사결정으로 더 효율적인 가게 운영이
              가능합니다.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-bit-main text-white break-word font-medium rounded-lg shadow-lg hover:bg-bit-main/90 transition duration-300 flex items-center">
                데이터 분석 시작하기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 세로로 정렬된 카드 3개 */}
          <div className="flex flex-col justify-start space-y-4">
            {[
              {
                title: "매출 패턴 분석",
                description:
                  "시간대별, 요일별, 계절별 매출 패턴을 파악하여 운영 최적화"
              },
              {
                title: "인기 메뉴 분석",
                description:
                  "매출 기여도가 높은 인기 메뉴를 파악하고 마케팅 전략 수립"
              },
              {
                title: "맞춤형 운영 추천",
                description: "매장 데이터를 바탕으로 실질적인 운영 개선 방안 제시"
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

        {/* 서비스 소개 섹션 */}
        {/* <section className="py-4">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full break-words text-bit-main font-semibold mb-4">
              서비스 소개
            </span>
            <h2 className="text-3xl break-words font-bold mb-6">
              복잡한 데이터를 쉬운 인사이트로
            </h2>
            <p className="text-lg break-words text-gray-700 max-w-2xl mx-auto">
              소상공인을 위한 데이터 분석 서비스는 복잡한 POS 데이터를 쉽게
              이해할 수 있는 인사이트로 변환해 드립니다.
            </p>
          </div>
        </section> */}

        {/* 주요 기능 섹션 */}
          {/* <div className="text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full text-bit-main font-semibold mb-4">
              핵심 기능
            </span>
            <h2 className="text-3xl font-bold mb-6">
              POS 데이터 분석 핵심 기능
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              소상공인의 매출 증대와 효율적인 운영을 위한 다양한 분석 기능을
              제공합니다.
            </p>
          </div> */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full break-words text-bit-main font-semibold mb-4">
              서비스 소개
            </span>
            <h2 className="text-3xl break-words font-bold mb-6 text-center">
                복잡한 POS 데이터, 한눈에 보이는 인사이트로
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center break-keep">
                소상고민의 데이터 분석 서비스는 
                복잡한 POS 데이터를 자동으로 분석해,<br/>
                누구나 이해할 수 있는 인사이트와 운영 전략을 제공합니다.
            </p>
          </div>

          <div className="space-y-12">
            {featureCards.map((card, index) => (
              <FeatureCard
                key={index}
                title={card.title}
                headerColor={card.headerColor}
                img={card.image}
                points={card.points}
              />
            ))}
          </div>
        </section>

        {/* 인사이트 예시 카드 */}
        <section className="py-17 from-white to-gray-50">
          <div className="text-center">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full text-bit-main font-semibold mb-4">
              실제 인사이트
            </span>
          </div>
          <InsightCards insights={insights} recommendations={recommendations} />
        </section>

        {/* 분석 과정 안내 */}
        <section className="py-16">
          <div className="text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full text-bit-main font-semibold mb-4">
              이용 방법
            </span>
            <h2 className="text-3xl font-bold mb-6">데이터 분석 이용 방법</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              간단한 4단계 과정으로 누구나 쉽게 데이터 분석을 진행할 수
              있습니다.
            </p>
          </div>
          <StepGuide steps={steps} />
        </section>

        {/* 고객 후기 섹션 */}
        <section className="py-16 bg-bit-main/5 rounded-3xl">
          <div className="text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full text-bit-main font-semibold mb-4">
              고객 후기
            </span>
            <h2 className="text-3xl font-bold mb-6">실제 사용 고객의 후기</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto break-keep">
            소상고민의 데이터 분석 서비스를 이용한 
            고객들의 실제 후기를 확인해보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
            {[
              {
                name: "김현진",
                business: "카페 운영",
                review:
                  "매출 데이터를 분석해 주셔서 잘 팔리지 않는 메뉴들을 쉽게 정리할 수 있었어요. 인기 많은 음료에 집중하려고 합니다.",
                rating: 5
              },

              {
                name: "보성오빠어머니성함..?",
                business: "식당 운영",
                review:
                  "인사이트 내용을 적용시켜 저녁 특선 메뉴를 추가하였더니 매출이 증가하였습니다.",
                rating: 4
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{review.review}"</p>
                <div className="border-t pt-4 mt-4">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.business}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="py-16">
          <div className="text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full text-bit-main font-semibold mb-4">
              자주 묻는 질문
            </span>
            <h2 className="text-3xl font-bold mb-6">데이터 분석 서비스 FAQ</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              고객님들이 자주 문의하시는 질문과 답변을 모았습니다.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 break-keep">
            {[
              {
                question: "어떤 데이터를 업로드해야 하나요?",
                answer:
                  "POS에서 추출한 CSV 또는 Excel 형식의 매출 데이터를 업로드하시면 됩니다. 날짜, 시간, 메뉴명, 가격, 수량 정보는 분석을 위해 반드시 포함되어야 합니다."
              },
              {
                question: "분석 결과는 어떻게 확인하나요?",
                answer:
                  "분석 완료 후 웹사이트에서 바로 결과를 확인하실 수 있습니다. 시각화된 그래프와 함께 분석 결과와 인사이트를 제공해 드립니다."
              },
              {
                question: "데이터 분석에 얼마나 시간이 걸리나요?",
                answer:
                  "일반적으로 데이터 업로드 후 1~2분 이내에 분석 결과를 받아보실 수 있습니다. 데이터 양에 따라 소요 시간이 달라질 수 있습니다."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="bg-bit-main text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                      Q
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <p className="text-gray-700 mt-2">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DataAnalysisPage;
