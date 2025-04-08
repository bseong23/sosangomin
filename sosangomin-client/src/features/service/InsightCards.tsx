import React from "react";

interface InsightCardsProps {
  insights: string[];
  recommendations: string[];
}

const InsightCards: React.FC<InsightCardsProps> = ({
  insights,
  recommendations
}) => {
  const cards = [
    {
      title: "인사이트 예시",
      items: insights
    },
    {
      title: "추천 액션 플랜 예시",
      items: recommendations
    }
  ];

  return (
    <section className="bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-bit-main mb-12">
        분석 인사이트 & 추천 전략
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-bit-main mb-4">
              {card.title}
            </h3>
            <ul className="space-y-3">
              {card.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-bit-main text-lg">•</span>
                  <span className="text-gray-700 break-words">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InsightCards;
