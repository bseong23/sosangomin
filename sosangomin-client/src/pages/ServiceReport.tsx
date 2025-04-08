import React from "react";
import { Link } from "react-router-dom";
import FeatureCard from "@/features/service/FeatureCard";
import StepGuide from "@/features/service/StepGuide";
import service1 from "@/assets/ex_swot.png";

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

const FinalReportService: React.FC = () => {
  const featureCards = [
    {
      title: "종합 데이터 분석",
      headerColor: "bg-bit-main",
      image: service1,
      points: [
        {
          title: "매출 데이터 통합 분석",
          description:
            "POS 데이터를 분석하여 매출 패턴, 인기 메뉴, 고객 행동 등 핵심 정보를 도출합니다."
        },
        {
          title: "리뷰 데이터 통합 분석",
          description:
            "고객 리뷰를 분석하여 고객 만족도, 개선 요구사항, 경쟁 우위점을 파악합니다."
        },
        {
          title: "상권 데이터 통합 분석",
          description:
            "인구, 업종, 매출 데이터를 종합적으로 분석하여 상권 특성과 기회 요인을 찾아냅니다."
        }
      ]
    },
    {
      title: "종합 인사이트 제공",
      headerColor: "bg-bit-main",
      image: service1,
      points: [
        {
          title: "통합 데이터 인사이트",
          description:
            "각 분석 결과를 종합하여 비즈니스 전반에 대한 통찰력 있는 인사이트를 제공합니다."
        },
        {
          title: "상관관계 분석",
          description:
            "매출, 리뷰, 상권 데이터 간 상관관계를 분석하여 숨겨진 패턴을 발견합니다."
        },
        {
          title: "SWOT 분석",
          description:
            "강점, 약점, 기회, 위협 요소를 명확히 도출하여 전략적 의사결정을 지원합니다."
        }
      ]
    },
    {
      title: "맞춤형 전략 제안",
      headerColor: "bg-bit-main",
      image: service1,
      points: [
        {
          title: "종합 개선 전략",
          description:
            "매출 향상, 고객 만족도 개선, 운영 효율화를 위한 종합 전략을 제안합니다."
        },
        {
          title: "우선순위 로드맵",
          description:
            "효과와 실행 용이성을 고려한 실행 우선순위와 로드맵을 제시합니다."
        },
        {
          title: "성과 모니터링 방안",
          description:
            "전략 실행 후 성과를 지속적으로 모니터링하고 개선할 수 있는 방안을 제공합니다."
        }
      ]
    }
  ];

  const steps = [
    {
      number: 1,
      title: "데이터 통합",
      description: "데이터, 리뷰, 상권 분석을 우선 실행합니다."
    },
    {
      number: 2,
      title: "종합 분석",
      description:
        "AI 기반 알고리즘이 데이터 간 상관관계와 인사이트를 도출합니다."
    },
    {
      number: 3,
      title: "보고서 확인",
      description:
        "종합 분석 결과와 맞춤형 전략이 담긴 최종 보고서를 확인합니다."
    }
  ];

  return (
    <div className="bg-gray-50">
      <main className="max-w-screen-xl mx-auto px-20 py-16 space-y-32">
        {/* 타이틀 섹션 */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl break-keeps font-bold text-gray-900">
              <span className="text-bit-main break-keeps">최종 보고서</span>로
              <br />
              종합 분석을 한눈에 보세요
            </h1>
            <p className="text-sm break-keep text-gray-700 leading-relaxed">
              매출, 리뷰, 상권 데이터를 통합 분석하여 비즈니스의 전체 그림을
              파악하세요. 종합적인 인사이트와 맞춤형 전략으로 사업 성과를
              극대화할 수 있습니다.
            </p>
            <div className="flex gap-4">
              <Link
                to="/result"
                className="px-6 py-3 bg-bit-main text-white break-keep font-medium rounded-lg shadow-lg hover:bg-bit-main/90 transition duration-300 flex items-center"
              >
                최종 보고서 시작하기
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
                title: "통합 데이터 분석",
                description:
                  "매출, 리뷰, 상권 데이터를 통합 분석하여 전체적인 비즈니스 현황 파악"
              },
              {
                title: "종합 인사이트 도출",
                description: "SWOT 분석 형태로 종합 인사이트를 제공"
              },
              {
                title: "맞춤형 전략 제안",
                description:
                  "비즈니스 특성에 맞는 실행 가능한 전략과 우선순위 로드맵 제공"
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
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full break-keeps text-bit-main font-semibold mb-4">
              서비스 소개
            </span>
            <h2 className="text-3xl break-keeps font-bold mb-6 text-center">
              개별 분석을 넘어선 통합 인사이트
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center break-keep">
              소상고민의 최종 보고서 서비스는 개별 분석 결과를 통합하여
              <br />
              사업의 전체 그림을 보여주고 성장을 위한 명확한 방향을 제시합니다.
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
            <h2 className="text-3xl font-bold mb-6">최종 보고서 이용 방법</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              간단한 3단계 과정으로 비즈니스의 통합 인사이트를 얻을 수 있습니다.
            </p>
          </div>
          <StepGuide steps={steps} />
        </section>

        {/* FAQ 섹션 */}
        <section className="py-16">
          <div className="text-center mb-16">
            <span className="inline-block bg-bit-main/10 px-4 py-2 rounded-full text-bit-main font-semibold mb-4">
              자주 묻는 질문
            </span>
            <h2 className="text-3xl font-bold mb-6">최종 보고서 서비스 FAQ</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              고객님들이 자주 문의하시는 질문과 답변을 모았습니다.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 break-keep">
            {[
              {
                question: "최종 보고서는 어떤 데이터를 포함하나요?",
                answer:
                  "최종 보고서는 POS 매출 데이터, 고객 리뷰 분석, 경쟁사 분석, 상권 및 입지 분석 등 소상고민에서 제공하는 모든 분석 서비스의 결과를 통합하여 제공합니다. 개별 분석을 모두 이용하셨다면, 그 결과를 종합한 보고서를 받아보실 수 있습니다."
              },
              {
                question:
                  "개별 분석 서비스를 모두 이용해야 최종 보고서를 받을 수 있나요?",
                answer:
                  "최종 보고서는 가능한 많은 데이터 분석 결과를 통합할수록 더 풍부한 인사이트를 제공합니다. 데이터 분석, 리뷰 분석 및 상권 분석까지 모두 진행하셔야 최종 보고서를 받아보실 수 있습니다."
              },
              {
                question: "최종 보고서는 얼마나 자주 업데이트되나요?",
                answer:
                  "새로운 데이터가 추가될 때마다 더 정확한 분석과 인사이트를 제공받으실 수 있습니다."
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

export default FinalReportService;
