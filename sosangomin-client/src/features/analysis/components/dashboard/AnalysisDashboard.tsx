// src/features/analysis/components/dashboard/AnalysisDashboard.tsx
import React, { useState, useCallback } from "react";
import StatsCard from "./StatsCard";
import SummarySection from "./SummarySection";
import HourlySalesSection from "./HourlySalesSection";
import TopProductsSection from "./TopProductsSection";
import WeekdaySalesSection from "./WeekdaySalesSection";
import DistributionSection from "./DistributionSection";
import SeasonalSalesSection from "./SeasonalSalesSection";
import StrategySection from "./StrategySection";
import ForecastSection from "./ForecastSection";
import AnalysisSelector from "./AnalysisSelector";
import { useAnalysisData } from "../../hooks/useAnalysisData";

// TODO: 백엔드 API 연동 시 주석 해제
// import { useAnalysisStore } from '@/features/analysis';
// import { useAnalysisPolling } from '@/features/analysis';
// import { useLocation } from 'react-router-dom';

const AnalysisDashboard: React.FC = () => {
  // 현재 선택된 분석 ID 상태
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<
    string | undefined
  >(undefined);

  // API 통합 시 상점 ID는 컨텍스트 또는 Redux에서 가져올 수 있음
  const storeId = 1; // 임시 상점 ID

  const { data, loading, error } = useAnalysisData(selectedAnalysisId);

  // 분석 선택 핸들러
  const handleAnalysisSelect = useCallback((analysisId: string) => {
    setSelectedAnalysisId(analysisId);
    // 실제 구현에서는 여기서 해당 분석 ID에 대한 데이터를 불러오는 API 호출
    // fetchAnalysisResult(analysisId);
  }, []);

  // TODO: 백엔드 API 연동 시 주석 해제
  // const location = useLocation();
  // const { currentAnalysis, isLoading: analysisLoading, error: analysisError, fetchAnalysisResult } = useAnalysisStore();

  // 라우팅으로 전달받은 분석 ID가 있는지 확인
  // useEffect(() => {
  //   // URL 쿼리 파라미터나 state에서 분석 ID 가져오기
  //   const searchParams = new URLSearchParams(location.search);
  //   const analysisId = searchParams.get('analysis_id') ||
  //                     (location.state && location.state.analysisId);
  //
  //   if (analysisId) {
  //     // 분석 결과 조회
  //     fetchAnalysisResult(analysisId);
  //     setSelectedAnalysisId(analysisId);
  //   }
  // }, [location, fetchAnalysisResult]);

  // 폴링을 통한 분석 상태 확인 (백엔드 API 연동 시 주석 해제)
  // const { analysisState, startPolling } = useAnalysisPolling(
  //   selectedAnalysisId,
  //   { pollingInterval: 3000, maxAttempts: 100 }
  // );

  // 분석 ID가 있으면 폴링 시작
  // useEffect(() => {
  //   if (selectedAnalysisId) {
  //     startPolling();
  //   }
  // }, [selectedAnalysisId, startPolling]);

  // TODO: 백엔드 API 연동 시 replace
  // const loadingState = loading;
  // const errorState = error;
  // const dataState = data;

  // TODO: 백엔드 API 연동 시 주석 해제
  // // 폴링 또는 단일 요청의 결과를 사용
  // const loadingState = analysisState.isLoading || analysisLoading;
  // const errorState = analysisState.error || analysisError;
  // const dataState = analysisState.data || currentAnalysis;

  if (loading)
    return (
      <div className="text-center py-10">데이터를 불러오는 중입니다...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        데이터를 불러오는데 실패했습니다.
      </div>
    );
  if (!data) return null;

  // 기본 통계 데이터
  const basicStats = data?.result_data?.basic_stats?.data || {
    total_sales: 14089000,
    avg_transaction: 46042.48366013072,
    total_transactions: 306,
    unique_products: 27,
    customer_avg: 47278.523489932886
  };

  const basicStatsSummary = data?.result_data?.basic_stats?.summary || "";

  // 전체 요약
  const overallSummary = data?.summary || "";

  return (
    <div>
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-comment">지금 우리 가게는?</h1>

          {/* 분석 선택기 */}
          <div className="flex items-center">
            <AnalysisSelector
              storeId={storeId}
              currentAnalysisId={selectedAnalysisId}
              onAnalysisSelect={handleAnalysisSelect}
            />
          </div>
        </div>

        {/* 전체 요약 섹션 */}
        <SummarySection summary={overallSummary} />

        {/* 기본 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="총 매출"
            value={basicStats.total_sales}
            subValue={`${basicStats.total_transactions}건의 거래`}
            colorClass="text-bit-main"
          />
          <StatsCard
            title="평균 거래 금액"
            value={`₩${Math.round(basicStats.avg_transaction).toLocaleString(
              "ko-KR"
            )}`}
            subValue={`고객당 평균 ₩${Math.round(
              basicStats.customer_avg
            ).toLocaleString("ko-KR")}`}
            colorClass="text-bit-main"
          />
          <StatsCard
            title="총 거래 건수"
            value={`${basicStats.total_transactions}건`}
            subValue={`${basicStats.unique_products}개 고유 제품`}
            colorClass="text-bit-main"
          />
          <StatsCard
            title="시즌 매출"
            value={`봄 ₩${basicStats.total_sales.toLocaleString("ko-KR")}`}
            subValue="계절별 분석"
            colorClass="text-bit-main"
          />
        </div>

        {/* 기본 통계 요약 */}
        <div className="bg-basic-white p-4 rounded-lg shadow-md mb-6">
          <p className="text-sm text-comment">{basicStatsSummary}</p>
        </div>

        {/* 시간별 매출 섹션 */}
        <HourlySalesSection data={data} />

        {/* 평일/휴일 매출 비율 & 시간대별 매출 분석 섹션 */}
        <DistributionSection data={data} />

        {/* 인기 메뉴 랭킹 섹션 */}
        <TopProductsSection data={data} />

        {/* 요일별 매출 현황 섹션 */}
        <WeekdaySalesSection data={data} />

        {/* 시즌 매출 & 영업 전략 제안 섹션 */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <SeasonalSalesSection data={data} />
          <StrategySection />
        </div>

        {/* 다음달 예상 매출 섹션 */}
        <ForecastSection basicStats={basicStats} />
      </div>
    </div>
  );
};

export default AnalysisDashboard;
