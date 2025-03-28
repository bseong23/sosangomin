import React from "react";
import { ReportData } from "../types";

interface RelatedAnalysesComponentProps {
  data: ReportData;
}

const RelatedAnalysesComponent: React.FC<RelatedAnalysesComponentProps> = ({
  data
}) => {
  const analysesItems = [
    {
      id: data.related_analyses.review_analysis_id,
      title: "고객 리뷰 분석",
      description: "방문자 리뷰와 감성 분석 결과를 확인합니다.",
      icon: (
        <svg
          className="w-6 h-6 text-pink-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      )
    },
    {
      id: data.related_analyses.combined_analysis_id,
      title: "통합 분석 리포트",
      description: "매출, 메뉴, 고객 데이터를 종합적으로 분석한 결과입니다.",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      )
    },
    {
      id: data.related_analyses.competitor_analysis_id,
      title: "경쟁사 분석",
      description: "주요 경쟁사와의 비교 분석 결과를 확인합니다.",
      icon: (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        관련 분석 보고서
      </h2>

      <div className="space-y-4">
        {analysesItems.map((item) => (
          <a
            key={item.id}
            href={`/analysis/${item.id}`}
            className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition duration-200"
          >
            <div className="bg-white p-3 rounded-full shadow-sm mr-4">
              {item.icon}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 ml-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedAnalysesComponent;
