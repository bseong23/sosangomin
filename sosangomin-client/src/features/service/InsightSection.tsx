// src/components/feature/InsightSection.tsx
import React from "react";

interface InsightItemProps {
  text: string;
}

interface InsightSectionProps {
  insights: string[];
  recommendations: string[];
}

const InsightItem: React.FC<InsightItemProps> = ({ text }) => {
  return (
    <li className="flex items-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-comment text-base">{text}</span>
    </li>
  );
};

const RecommendationItem: React.FC<InsightItemProps> = ({ text }) => {
  return (
    <li className="flex items-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
      </svg>
      <span className="text-comment text-base">{text}</span>
    </li>
  );
};

const InsightSection: React.FC<InsightSectionProps> = ({
  insights,
  recommendations
}) => {
  return (
    <section className="bg-basic-white rounded-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6 text-bit-main">
        맞춤형 인사이트 및 추천
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-md p-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center text-comment">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-bit-main"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            비즈니스 인사이트
          </h3>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <InsightItem key={index} text={insight} />
            ))}
          </ul>
        </div>

        <div className="rounded-md p-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center text-comment">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-bit-main"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            맞춤형 추천
          </h3>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <RecommendationItem key={index} text={recommendation} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default InsightSection;
