import React from "react";
import { Link } from "react-router-dom";
import FeatureCard from "@/features/service/FeatureCard";
import StepGuide from "@/features/service/StepGuide";
import recommend from "@/assets/recommend.png";
import analysis_map from "@/assets/analysis_map.png";

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
        <h3 className="text-lg break-keeps font-semibold">{title}</h3>
      </div>
      <p className="text-gray-700 break-keeps leading-relaxed min-h-[48px] pl-9">
        {description}
      </p>
    </div>
  );
};

const LocationAnalysisPage: React.FC = () => {
  const featureCards = [
    {
      title: "상권 분석 서비스",
      headerColor: "bg-bit-main",
      image: analysis_map,
      points: [
        {
          title: "인구 데이터 분석",
          description:
            "상주인구, 직장인구, 유동인구, 시간대별/요일별 유동인구를 분석합니다."
        },
        {
          title: "업종 데이터 분석",
          description:
            "업종별 업소수 증감율, 외식업 카테고리 분포, 운영/폐업 점포수를 파악합니다."
        },
        {
          title: "매출 데이터 분석",
          description:
            "업종별, 시간별, 요일별, 연령대별 매출 패턴을 분석합니다."
        }
      ]
    },
    {
      title: "입지 추천 서비스",
      headerColor: "bg-bit-main",
      image: recommend,
      points: [
        {
          title: "맞춤형 입지 추천",
          description:
            "업종, 타겟 연령, 우선순위에 맞는 최적의 입지를 추천합니다."
        },
        {
          title: "추천 입지별 상세 분석",
          description: "추천된 각 입지의 장단점과 성공 가능성을 분석합니다."
        },
        {
          title: "행정동별 등급 분류",
          description:
            "입지 조건 분석 결과에 따라 모든 행정동을 1등급에서 5등급으로 구분합니다."
        }
      ]
    }
  ];

  const steps = [
    {
      number: 1,
      title: "서비스 선택",
      description: "상권 분석 또는 입지 추천 서비스 중 선택합니다."
    },
    {
      number: 2,
      title: "조건 설정",
      description: "업종, 타겟 연령대, 우선순위 등 필요한 조건을 설정합니다."
    },
    {
      number: 3,
      title: "결과 확인",
      description: "상권 분석 결과 또는 추천 입지 3순위를 확인합니다."
    }
  ];

  return (
    <div className="bg-gray-50">
      <main className="max-w-screen-xl mx-auto px-20 py-16 space-y-32">
        {/* 타이틀 섹션 */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl break-keeps font-bold text-gray-900">
              <span className="text-bit-main break-keeps">상권 분석</span>과
              <br />
              <span className="text-bit-main break-keeps">입지 추천</span>{" "}
              서비스
            </h1>
            <p className="text-sm break-keeps text-gray-700 leading-relaxed">
              인구, 업종, 매출 데이터를 종합적으로 분석하고 최적의 입지를
              추천받으세요.
              <br /> 데이터 기반의 의사결정으로 창업 성공률을 높일 수 있습니다.
            </p>
            <div className="flex gap-4">
              <Link
                to="/map"
                className="px-6 py-3 bg-bit-main text-white break-keep font-medium rounded-lg shadow-lg hover:bg-bit-main/90 transition duration-300 flex items-center"
              >
                상권 분석 시작하기
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
                title: "상권 분석",
                description:
                  "인구, 업종, 매출 데이터를 종합적으로 분석하여 상권의 특성을 파악"
              },
              {
                title: "시장 트렌드 분석",
                description:
                  "업종별 증감율과 폐업률을 분석하여 시장 트렌드와 리스크 파악"
              },
              {
                title: "맞춤형 입지 추천",
                description:
                  "업종, 타겟 연령, 우선순위에 맞는 최적의 입지를 3순위로 추천"
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
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full break-keeps text-bit-main font-semibold mb-4">
              서비스 소개
            </span>
            <h2 className="text-3xl break-keeps font-bold mb-6">
              상권 분석 & 입지 추천
            </h2>
            <p className="text-lg break-keeps text-gray-700 max-w-2xl mx-auto">
              소상공인을 위한 상권분석과 입지추천 서비스는 방대한 지역 데이터를{" "}
              <br />
              실용적인 인사이트와 구체적인 추천으로 변환해 드립니다.
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

        {/* 분석 과정 안내 */}
        <section className="py-16">
          <div className="text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full text-bit-main font-semibold mb-4">
              이용 방법
            </span>
            <h2 className="text-3xl font-bold mb-6">서비스 이용 과정</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              간단한 3단계 과정으로 상권 분석과 입지 추천 서비스를 이용할 수
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
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              소상고민의 상권 분석 서비스를 이용한 고객들의 실제 후기를
              확인해보세요.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
            {[
              {
                name: "김민석님",
                business: "카페 창업",
                review:
                  "입지 추천 서비스를 통해 전혀 생각하지 못했던 지역을 발견했어요. 그 지역은 유동인구가 많고 경쟁이 적어 창업 6개월 만에 손익분기점을 넘겼습니다.",
                rating: 5
              },
              {
                name: "이수진님",
                business: "음식점 운영",
                review:
                  "상권 분석 서비스로 우리 지역의 특성을 정확히 파악했어요. 타겟 연령층과 피크타임에 맞춰 영업시간을 최적화했더니 매출이 30% 증가했습니다.",
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
            <h2 className="text-3xl font-bold mb-6">상권 분석 서비스 FAQ</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              고객님들이 자주 문의하시는 질문과 답변을 모았습니다.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "상권 분석과 입지 추천의 차이점은 무엇인가요?",
                answer:
                  "상권 분석은 선택한 지역의 인구, 업종, 매출 데이터를 종합적으로 분석하여 해당 상권의 특성과 트렌드를 파악하는 서비스입니다. 입지 추천은 설정한 조건(업종, 타겟 연령, 우선순위)에 가장 적합한 위치를 3순위로 추천해주는 서비스로, 두 서비스는 독립적으로 이용 가능합니다."
              },
              {
                question: "어떤 데이터를 분석하나요?",
                answer:
                  "각 행정동의 인구 데이터(상주인구, 직장인구, 유동인구, 시간대별/요일별 유동인구), 업종 데이터(업종별 업소수 증감율, 외식업 카테고리 분포, 운영/폐업 점포수), 매출 데이터(업종별 매출 변화율, 요일별, 시간별, 연령대별 매출) 등을 종합적으로 분석합니다."
              },
              {
                question: "입지 추천은 어떤 기준으로 이루어지나요?",
                answer:
                  "선택하신 업종, 타겟 연령대, 그리고 설정하신 우선순위(유동인구, 경쟁밀집도, 매출 등)를 종합적으로 고려하여 최적의 입지를 3순위로 추천해 드립니다."
              },
              {
                question: "분석 결과는 어떻게 활용할 수 있나요?",
                answer:
                  "상권 분석 결과는 해당 지역의 시장 환경과 잠재력을 이해하는 데 활용할 수 있으며, 입지 추천 결과는 창업 위치 선정에 직접적인 도움이 됩니다. 두 서비스 모두 영업 시간 설정, 타겟 마케팅 전략 수립, 메뉴 구성 등 다양한 비즈니스 의사결정에 활용 가능합니다."
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

export default LocationAnalysisPage;
