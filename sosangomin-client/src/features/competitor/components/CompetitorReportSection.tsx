// features/competitor/components/CompetitorReportSection.tsx
import React from "react";
import CompareSummary from "./CompareSummary";
import ImprovedWordCloudComparison from "./WordCloudComparison";
import { ComparisonData } from "@/features/competitor/types/competitor";

/**
 * 경쟁사 분석 보고서 섹션
 */
interface CompetitorReportSectionProps {
  data: ComparisonData;
}

const CompetitorReportSection: React.FC<CompetitorReportSectionProps> = ({
  data
}) => {
  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* 🟣 요약 비교 */}
      <section className="bg-white p-4 rounded-md shadow-sm border">
        <h2 className="text-base font-semibold mb-3">기본 정보 비교</h2>
        <CompareSummary myStore={data.my_store} competitor={data.competitor} />
      </section>

      {/* 🟣 워드 클라우드 */}
      <section className="bg-white p-4 rounded-md shadow-sm border">
        <h2 className="text-base font-semibold mb-3">리뷰 주요 키워드 비교</h2>
        <ImprovedWordCloudComparison
          myStoreWords={data.word_cloud_comparison.my_store.positive_words}
          competitorWords={data.word_cloud_comparison.competitor.positive_words}
          maxWords={20}
          height="h-72"
        />
      </section>

      {/* 🟣 AI 인사이트 */}
      <section className="bg-white p-4 rounded-md shadow-sm border">
        <h2 className="text-base font-semibold mb-3">AI 분석 요약</h2>
        {data.comparison_insight ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {data.comparison_insight}
          </p>
        ) : (
          <p className="text-gray-500 text-sm">AI 분석 결과가 없습니다.</p>
        )}
      </section>
    </div>
  );
};

export default CompetitorReportSection;
