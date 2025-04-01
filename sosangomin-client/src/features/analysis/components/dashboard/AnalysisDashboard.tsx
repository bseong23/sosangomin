// src/features/analysis/components/dashboard/AnalysisDashboard.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
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
import Loading from "@/components/common/Loading";
import useAnalysisStore from "@/store/useAnalysisStore";

const AnalysisDashboard: React.FC = () => {
  // 매장 ID를 1로 고정 (추후 Zustand에서 관리하는 상태로 변경 가능)
  const storeId = "1hGScLSIMYqWR9OwRajVxw";
  const { analysisId } = useParams<{ analysisId?: string }>();

  // 스토어에서 상태와 액션 가져오기
  const {
    currentAnalysis,
    analysisList,
    isLoading,
    isLoadingList,
    error,
    listError,
    fetchStoreAnalysisList,
    fetchAnalysisResult
  } = useAnalysisStore();

  // 현재 선택된 분석 ID 상태
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<
    string | undefined
  >(analysisId);

  // 변환된 분석 목록 및 선택된 분석 항목 상태
  const [displayAnalysisList, setDisplayAnalysisList] = useState<any[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<any | null>(null);

  // 분석 목록 로드
  useEffect(() => {
    if (!storeId) return;

    const loadAnalysisList = async () => {
      await fetchStoreAnalysisList(storeId);
    };

    loadAnalysisList();
  }, [storeId, fetchStoreAnalysisList]);

  // 분석 목록이 로드되면, 목록을 컴포넌트가 이해할 수 있는 형식으로 변환
  useEffect(() => {
    console.log("전체 분석 목록:", analysisList);

    if (analysisList && (analysisList.analysisList || analysisList.analyses)) {
      const list = analysisList.analysisList || analysisList.analyses;
      const convertedList = list.map((item: any) => ({
        analysis_id: item.analysisId || item.analysis_id,
        created_at: item.createdAt || item.created_at,
        store_id: storeId,
        status: "success" // API에서 상태 정보가 없으면 success로 가정
      }));

      setDisplayAnalysisList(convertedList);

      // 선택된 분석 ID가 없으면 첫 번째 항목 선택
      if (!selectedAnalysisId && convertedList.length > 0) {
        const firstAnalysisId = convertedList[0].analysis_id;
        setSelectedAnalysisId(firstAnalysisId);
        setSelectedAnalysis(convertedList[0]);
        fetchAnalysisResult(firstAnalysisId);
      } else if (selectedAnalysisId) {
        // 선택된 분석이 있으면 해당 분석 정보 설정
        const selected = convertedList.find(
          (item: any) => item.analysis_id === selectedAnalysisId
        );
        if (selected) {
          setSelectedAnalysis(selected);
          fetchAnalysisResult(selectedAnalysisId);
        }
      }
    }
  }, [analysisList, selectedAnalysisId, fetchAnalysisResult, storeId]);

  useEffect(() => {
    console.log("analysisList:", analysisList);
    console.log("currentAnalysis:", currentAnalysis);
  }, [analysisList, currentAnalysis]);
  // 분석 선택 핸들러
  const handleAnalysisSelect = useCallback(
    (analysisId: string) => {
      setSelectedAnalysisId(analysisId);
      const selected = displayAnalysisList.find(
        (item) => item.analysis_id === analysisId
      );
      if (selected) {
        setSelectedAnalysis(selected);
      }

      // 분석 결과 가져오기
      fetchAnalysisResult(analysisId);
    },
    [displayAnalysisList, fetchAnalysisResult]
  );

  // 통합 로딩 상태
  const isLoadingData = isLoading || isLoadingList;
  const anyError = error || listError;

  if (isLoadingData) return <Loading />;
  if (anyError)
    return (
      <div className="text-center py-10 text-red-500">
        데이터를 불러오는데 실패했습니다: {anyError}
      </div>
    );
  if (!currentAnalysis) {
    return (
      <div className="text-center py-10">
        분석 데이터가 없습니다. 분석을 실행해주세요.
      </div>
    );
  }

  console.log("API 응답:", currentAnalysis);

  // result_data를 그대로 사용 (useAnalysisStore에서 이미 적절히 변환됨)
  const resultData = currentAnalysis.result_data;
  console.log("추출된 결과 데이터:", resultData);

  // 데이터가 API 응답 형식에 맞게 구성
  const data = {
    result_data: resultData,
    summary: currentAnalysis.summary,
    analysis_id: currentAnalysis._id,
    created_at: currentAnalysis.created_at,
    status: currentAnalysis.status
  };

  console.log("변환된 데이터 구조:", data);
  console.log("기본 통계 데이터:", resultData?.basic_stats?.data);

  // 기본 통계 데이터
  const basicStats = resultData?.basic_stats?.data || {
    total_sales: 0,
    avg_transaction: 0,
    total_transactions: 0,
    unique_products: 0,
    customer_avg: 0
  };

  const basicStatsSummary = resultData?.basic_stats?.summary || "";

  // 전체 요약
  const overallSummary = currentAnalysis?.summary || "";

  return (
    <div>
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-comment">지금 우리 가게는?</h1>

          {/* 분석 선택기 - API에서 로드된 분석 목록 전달 */}
          <div className="flex items-center">
            <AnalysisSelector
              storeId={Number(storeId)}
              analysisList={displayAnalysisList}
              currentAnalysisId={selectedAnalysisId}
              selectedAnalysis={selectedAnalysis}
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
        <div className="bg-basic-white p-4 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
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
