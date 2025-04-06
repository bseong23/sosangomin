import React from "react";
import WordCloud from "@/features/review/components/WordCloud";
import BarChart from "@/components/chart/BarChart";

const ReviewAnalysisIntro: React.FC = () => {
  return (
    <div className="w-full bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-28">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            고객의 목소리를 데이터로 이해하세요
          </h1>
          <p className="text-lg text-gray-600">
            AI 기반 리뷰 분석으로 매장의 강점과 개선점을 한눈에 파악할 수
            있습니다
          </p>
        </section>

        {/* 리뷰 분석 기능 */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">리뷰 분석 기능</h2>
            <p className="text-gray-600 mt-2">
              다양한 시각화 도구로 고객의 평가를 빠르게 이해하세요
            </p>
          </div>

          {/* 워드클라우드 */}
          <div className="bg-white rounded-xl shadow border p-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              핵심 키워드 분석 (워드클라우드)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WordCloud
                words={{ 맛있어요: 22, 친절해요: 18, 분위기: 12 }}
                title="긍정 키워드"
                colors={{ primary: "#2563EB", secondary: "#60A5FA" }}
                maxWords={10}
              />
              <WordCloud
                words={{ 시끄러워요: 14, 불친절: 10, 오래걸려요: 6 }}
                title="부정 키워드"
                colors={{ primary: "#DC2626", secondary: "#F87171" }}
                maxWords={10}
              />
            </div>
          </div>

          {/* 바 차트 */}
          <div className="bg-white rounded-xl shadow border p-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              카테고리별 긍/부정 리뷰 분석
            </h3>
            <BarChart
              labels={["맛", "서비스", "가격", "분위기"]}
              datasets={[
                {
                  label: "긍정",
                  data: [18, 12, 7, 9],
                  backgroundColor: "rgba(59, 130, 246, 0.6)"
                },
                {
                  label: "부정",
                  data: [3, 6, 9, 4],
                  backgroundColor: "rgba(239, 68, 68, 0.6)"
                }
              ]}
              height={300}
              xAxisLabel="카테고리"
              yAxisLabel="리뷰 수"
            />
          </div>
        </section>

        {/* 경쟁사 비교 기능 */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              경쟁사 비교 분석
            </h2>
            <p className="text-gray-600 mt-2">
              경쟁 매장과 비교해 우리 매장의 평가를 객관적으로 파악하세요
            </p>
          </div>

          {/* 워드클라우드 비교 */}
          <div className="bg-white rounded-xl shadow border p-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              주요 키워드 비교
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-center text-bit-main font-semibold mb-2">
                  내 매장
                </p>
                <WordCloud
                  words={{ 맛있어요: 15, 청결해요: 10 }}
                  colors={{ primary: "#2563EB", secondary: "#60A5FA" }}
                  maxWords={8}
                />
              </div>
              <div>
                <p className="text-center text-bit-main font-semibold mb-2">
                  경쟁 매장
                </p>
                <WordCloud
                  words={{ 친절해요: 17, 불편해요: 5 }}
                  colors={{ primary: "#DC2626", secondary: "#F87171" }}
                  maxWords={8}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-bit-main text-white py-16 rounded-xl shadow-md">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 리뷰 분석을 시작해보세요
          </h2>
          <p className="text-white/80 mb-6">
            고객의 의견 속 숨은 인사이트를 발견할 시간입니다
          </p>
          <button className="bg-white text-bit-main px-6 py-3 font-semibold rounded-lg hover:bg-gray-100">
            분석 시작하기 →
          </button>
        </section>
      </div>
    </div>
  );
};

export default ReviewAnalysisIntro;
