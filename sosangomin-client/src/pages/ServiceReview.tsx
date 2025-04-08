import React from "react";
import { Link } from "react-router-dom";
import FeatureCard from "@/features/service/FeatureCard";
import InsightCards from "@/features/service/InsightCards";
import StepGuide from "@/features/service/StepGuide";
import service2 from "@/assets/service5.png";
import service4 from "@/assets/ex_review.png";
import service6 from "@/assets/service6.png";

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

const ReviewCompetitorAnalysisPage: React.FC = () => {
  const featureCards = [
    {
      title: "리뷰 감성 분석",
      headerColor: "bg-bit-main",
      image: service4,
      points: [
        {
          title: "긍정/부정 리뷰 비율 분석",
          description:
            "고객 리뷰의 감성을 분석하여 전반적인 고객 만족도를 파악합니다."
        },
        {
          title: "핵심 키워드 추출",
          description:
            "리뷰에서 자주 언급되는 키워드를 추출하여 주요 관심사를 파악합니다."
        }
      ]
    },
    {
      title: "고객 피드백 활용 전략",
      headerColor: "bg-bit-main",
      image: service2,
      points: [
        {
          title: "우선 개선 항목 도출",
          description:
            "부정적 피드백이 집중된 항목을 우선 개선 대상으로 선정합니다."
        },
        {
          title: "마케팅 포인트 발굴",
          description:
            "긍정적 피드백이 많은 강점을 마케팅에 효과적으로 활용합니다."
        },
        {
          title: "고객 응대 전략 수립",
          description: "리뷰 패턴에 따른 효과적인 고객 응대 전략을 수립합니다."
        }
      ]
    },

    {
      title: "경쟁사 온라인 평판 분석",
      headerColor: "bg-bit-main",
      image: service6,
      points: [
        {
          title: "리뷰 비교 분석",
          description: "경쟁업체의 온라인 평판을 비교 분석합니다."
        },
        {
          title: "프로모션 전략 분석",
          description: "경쟁업체의 리뷰를 분석하여 차별화된 전략을 수립합니다."
        }
      ]
    }
  ];

  const insights = [
    "고객 리뷰에서 '친절한 직원'에 대한 긍정 언급이 30% 증가했습니다.",
    "반경 500m 내 경쟁업체 대비 평균 15% 높은 가격대를 유지하고 있습니다.",
    "주말 저녁 시간대 '대기 시간'에 관한 부정적 언급이 45% 증가했습니다."
  ];

  const recommendations = [
    "'친절한 서비스'를 강조한 SNS 마케팅을 통해 강점을 부각시키세요.",
    "주요 메뉴 3종의 가격을 5-10% 조정하여 가격 경쟁력을 강화하세요.",
    "주말 저녁 시간대 인력 보강을 통해 대기 시간을 줄이세요."
  ];

  const steps = [
    {
      number: 1,
      title: "데이터 수집",
      description: "리뷰 데이터와 경쟁사 정보를 업로드합니다."
    },
    {
      number: 2,
      title: "분석 실행",
      description: "분석 버튼을 클릭하여 리뷰 및 경쟁사 분석을 시작합니다."
    },
    {
      number: 3,
      title: "인사이트 확인",
      description: "분석 결과와 맞춤형 전략을 확인합니다."
    }
  ];

  return (
    <div className="bg-gray-50">
      <main className="max-w-screen-xl mx-auto px-20 py-16 space-y-32">
        {/* 타이틀 섹션 */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl break-words font-bold text-gray-900">
              <span className="text-bit-main break-words">리뷰 분석</span>으로
              <br />
              경쟁력을 강화하세요
            </h1>
            <p className="text-sm break-words text-gray-700 leading-relaxed">
              고객 리뷰와 경쟁업체 분석을 통해 시장 환경을 종합적으로
              파악하세요.
              <br /> 데이터에 기반한 전략으로 비즈니스 성과를 높일 수 있습니다.
            </p>
            <div className="flex gap-4">
              <Link
                to="/review/store"
                className="px-6 py-3 bg-bit-main text-white break-word font-medium rounded-lg shadow-lg hover:bg-bit-main/90 transition duration-300 flex items-center"
              >
                리뷰 분석 시작하기
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
              </Link>
            </div>
          </div>

          {/* 세로로 정렬된 카드 3개 */}
          <div className="flex flex-col justify-start space-y-4">
            {[
              {
                title: "고객 의견 통합 분석",
                description:
                  "네이버 리뷰를 조회하여 고객 의견을 종합적으로 분석"
              },
              {
                title: "경쟁사 리뷰 분석",
                description:
                  "시장 내 경쟁업체의 평가를 파악하고 차별화 전략 수립"
              },
              {
                title: "맞춤형 개선 전략",
                description: "데이터에 기반한 실행 가능한 전략과 개선 방안 제공"
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

        {/* 주요 기능 섹션 */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full break-words text-bit-main font-semibold mb-4">
              서비스 소개
            </span>
            <h2 className="text-3xl break-words font-bold mb-6">
              가게 리뷰를 한눈에 조회
            </h2>
            <p className="text-lg break-words text-gray-700 max-w-2xl mx-auto">
              소상공인을 위한 리뷰 분석 서비스는 수많은 고객 리뷰를 쉽게 정리된{" "}
              <br />
              인사이트로 변환해 드립니다.
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
        <section className="py-17 bg-gradient-to-b from-white to-gray-50">
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
            <h2 className="text-3xl font-bold mb-6">시장 분석 진행 과정</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              간단한 3단계 과정으로 누구나 쉽게 시장 분석을 진행할 수 있습니다.
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
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              소상고민의 시장 분석 서비스를 이용한 고객들의 실제 후기를
              확인해보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
            {[
              {
                name: "박지영",
                business: "레스토랑 운영",
                review:
                  "리뷰와 경쟁사 분석을 통해 우리 가게의 강점과 약점을 정확히 파악할 수 있었어요. 약점을 보완하고 강점을 강화하는 전략을 세워 매출이 15% 증가했습니다.",
                rating: 5
              },
              {
                name: "김도현",
                business: "카페 운영",
                review:
                  "주변 경쟁 카페들과의 차별점을 찾는 데 큰 도움이 되었습니다. 리뷰 분석을 통해 발견한 고객 니즈를 바탕으로 신메뉴를 개발했더니 반응이 정말 좋습니다.",
                rating: 5
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
            <h2 className="text-3xl font-bold mb-6">시장 분석 서비스 FAQ</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              고객님들이 자주 문의하시는 질문과 답변을 모았습니다.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "어떤 데이터를 분석하나요?",
                answer:
                  "네이버의 고객 리뷰 데이터와 경쟁업체의 리뷰 정보를 종합적으로 분석합니다."
              },
              {
                question: "경쟁사는 몇 개까지 분석 가능한가요?",
                answer:
                  "특별히 제한은 없습니다. 다만, 가장 직접적인 경쟁 관계에 있는 3-5개 업체를 선정하시는 것을 추천합니다."
              },
              {
                question: "분석 결과는 어떻게 활용할 수 있나요?",
                answer:
                  "분석 결과를 바탕으로 메뉴 개발, 가격 전략 수립, 마케팅 포인트 발굴, 서비스 개선 등 다양한 비즈니스 의사결정에 활용하실 수 있습니다. 모든 분석 결과는 실행 가능한 전략 제안과 함께 제공됩니다."
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

export default ReviewCompetitorAnalysisPage;
