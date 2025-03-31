import React from "react";
import StatsCard from "./StatsCard";
import LineChart from "@/components/chart/LineChart";
import BarChart from "@/components/chart/BarChart";
import PieChart from "@/components/chart/PieChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { useAnalysisData } from "../../hooks/useAnalysisData";

// TODO: 백엔드 API 연동 시 주석 해제
// import { useAnalysisStore } from '@/features/analysis';
// import { useAnalysisPolling } from '@/features/analysis';
// import { useLocation } from 'react-router-dom';

const AlternateLayoutDashboard: React.FC = () => {
  const { data, loading, error } = useAnalysisData();

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
  //   }
  // }, [location, fetchAnalysisResult]);

  // 폴링을 통한 분석 상태 확인 (백엔드 API 연동 시 주석 해제)
  // const { analysisState, startPolling } = useAnalysisPolling(
  //   location.state?.analysisId,
  //   { pollingInterval: 3000, maxAttempts: 100 }
  // );

  // 분석 ID가 있으면 폴링 시작
  // useEffect(() => {
  //   const analysisId = location.state?.analysisId;
  //   if (analysisId) {
  //     startPolling();
  //   }
  // }, [location.state, startPolling]);

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

  // 요일별 매출 데이터
  const weekdaySales = data?.result_data?.weekday_sales?.data || {
    Saturday: 3264000,
    Sunday: 3703000,
    Thursday: 2649000,
    Tuesday: 1836000,
    Wednesday: 2637000
  };

  const weekdaySalesLabels = Object.keys(weekdaySales).map((day) => {
    const koreanDays: { [key: string]: string } = {
      Monday: "월요일",
      Tuesday: "화요일",
      Wednesday: "수요일",
      Thursday: "목요일",
      Friday: "금요일",
      Saturday: "토요일",
      Sunday: "일요일"
    };
    return koreanDays[day] || day;
  });

  const weekdaySalesDatasets = [
    {
      label: "요일별 매출",
      data: Object.values(weekdaySales),
      backgroundColor: "rgba(75, 192, 192, 0.6)"
    }
  ];

  // 시간별 매출 데이터
  const hourlySales = data?.result_data?.hourly_sales?.data || {
    "11": 420000,
    "12": 1714000,
    "13": 1999000,
    "14": 1274000,
    "15": 103000,
    "16": 26000,
    "17": 1019000,
    "18": 1776000,
    "19": 3603000,
    "20": 2155000
  };

  const hourlySalesLabels = Object.keys(hourlySales).map((hour) => `${hour}시`);
  const hourlySalesDatasets = [
    {
      label: "시간별 매출",
      data: Object.values(hourlySales),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.3
    }
  ];

  // 상위 제품 데이터
  const topProducts = data?.result_data?.top_products?.data || {
    공기밥: 3025000,
    소주: 1601000,
    "조림점심특선(소)": 1538000,
    "조림점심특선(중)": 1321000,
    "매콤명태조림(소)": 975000
  };

  const topProductsLabels = Object.keys(topProducts);
  const topProductsDatasets = [
    {
      label: "상위 제품 매출",
      data: Object.values(topProducts),
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)"
      ],
      borderWidth: 1
    }
  ];

  // 시간대별 매출 데이터
  const timePeriodSales = data?.result_data?.time_period_sales?.data || {
    기타: 26000,
    저녁: 8553000,
    점심: 5510000
  };

  const timePeriodData = {
    labels: Object.keys(timePeriodSales),
    datasets: [
      {
        label: "시간대별 매출",
        data: Object.values(timePeriodSales),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // 평일/휴일 매출 데이터
  const holidaySales = data?.result_data?.holiday_sales?.data || {
    평일: 7122000,
    휴일: 6967000
  };

  const holidaySalesData = {
    labels: Object.keys(holidaySales),
    datasets: [
      {
        label: "평일/휴일 매출",
        data: Object.values(holidaySales),
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1
      }
    ]
  };

  // Legend 항목 생성 함수
  const formatLegendItems = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    return Object.entries(data).map(([key, value], idx) => {
      const colors = [
        "bg-red-400",
        "bg-blue-400",
        "bg-yellow-400",
        "bg-green-400",
        "bg-purple-400"
      ];
      const percentage = ((value / total) * 100).toFixed(1);
      return {
        color: colors[idx % colors.length],
        label: key,
        value: `₩${value.toLocaleString("ko-KR")} (${percentage}%)`
      };
    });
  };

  const timePeriodLegendItems = formatLegendItems(timePeriodSales);
  const holidaySalesLegendItems = formatLegendItems(holidaySales);

  // TODO: 백엔드 API 연동 시 주석 해제
  // // API 응답에서 데이터를 처리하는 함수들
  // const processAnalysisData = (apiData: any) => {
  //   // 이 함수에서 API 응답 데이터를 대시보드에 맞게 변환합니다
  //   // 예: apiData.eda_result, apiData.summaries 등에서 필요한 데이터 추출
  //
  //   // 시간별 매출 데이터 추출 예시
  //   const extractedHourlySales = apiData?.eda_result?.hourly_sales || {};
  //
  //   // 요일별 매출 데이터 추출 예시
  //   const extractedWeekdaySales = apiData?.eda_result?.weekday_sales || {};
  //
  //   // 기본 통계 데이터 추출 예시
  //   const extractedBasicStats = {
  //     total_sales: apiData?.summaries?.total_sales || 0,
  //     avg_transaction: apiData?.summaries?.avg_transaction || 0,
  //     total_transactions: apiData?.summaries?.total_transactions || 0,
  //     unique_products: apiData?.summaries?.unique_products || 0
  //   };
  //
  //   // 처리된 데이터 반환
  //   return {
  //     basicStats: extractedBasicStats,
  //     hourlySales: extractedHourlySales,
  //     weekdaySales: extractedWeekdaySales,
  //     // ... 기타 필요한 데이터
  //   };
  // };

  // // 실제 API 데이터가 있을 경우 처리된 데이터를 사용
  // const processedData = currentAnalysis ? processAnalysisData(currentAnalysis) : null;

  // // 처리된 API 데이터가 있으면 사용하고, 없으면 기존 데이터 사용
  // const displayData = processedData || {
  //   basicStats, weekdaySales, hourlySales, topProducts, timePeriodSales, holidaySales
  // };

  return (
    <div className="bg-white">
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">지금 우리 가게는?</h1>
        </div>

        {/* 기본 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="총 매출"
            value={basicStats.total_sales}
            subValue={`${basicStats.total_transactions}건의 거래`}
            colorClass="text-blue-500"
          />
          <StatsCard
            title="평균 거래 금액"
            value={`₩${Math.round(basicStats.avg_transaction).toLocaleString(
              "ko-KR"
            )}`}
            subValue={`고객당 평균 ₩${Math.round(
              basicStats.customer_avg
            ).toLocaleString("ko-KR")}`}
            colorClass="text-green-500"
          />
          <StatsCard
            title="총 거래 건수"
            value={`${basicStats.total_transactions}건`}
            subValue={`${basicStats.unique_products}개 고유 제품`}
            colorClass="text-purple-500"
          />
          <StatsCard
            title="시즌 매출"
            value={`봄 ₩${basicStats.total_sales.toLocaleString("ko-KR")}`}
            subValue="계절별 분석"
            colorClass="text-amber-500"
          />
        </div>

        {/* 첫 번째 행 - 시간별 매출 (왼쪽 70%) + 다음달 예상 (오른쪽 30%) */}
        <div className="flex flex-col lg:flex-row mb-6 gap-6">
          <div className="w-full lg:w-[70%] bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">
              우리 가게 시간별 매출액
            </h2>
            <div className="h-90">
              <LineChart
                title=""
                labels={hourlySalesLabels}
                datasets={hourlySalesDatasets}
                yAxisTitle="금액 (원)"
              />
            </div>
          </div>
          <div className="w-full lg:w-[30%] bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">다음달 예상 매출액</h2>
            <div className="p-4 bg-blue-50 rounded-lg h-60 flex flex-col justify-center">
              <p className="text-center text-blue-700 font-medium mb-2">
                다음 달 예상 매출액은
              </p>
              <p className="text-center text-blue-800 text-2xl font-bold mb-2">
                약 ₩15,800,000원
              </p>
              <p className="text-center text-blue-600 text-sm">
                이상적인 부성장 그래프를 그리고 있으니 유지하는 것 목표로
                해봐요!
              </p>
            </div>
          </div>
        </div>

        {/* 두 번째 행 - 상위 제품 (왼쪽 70%) + 매출 요약 (오른쪽 30%) */}
        <div className="flex flex-col lg:flex-row mb-6 gap-6">
          <div className="w-full lg:w-[70%] order-1 lg:order-1 bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">인기 메뉴 랭킹</h2>
            <div className="h-60">
              <BarChart
                labels={topProductsLabels}
                datasets={topProductsDatasets}
                height={250}
                horizontal={true}
                yAxisLabel="금액 (원)"
              />
            </div>
          </div>
          <div className="w-full lg:w-[30%] order-2 lg:order-2 bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">메뉴 매출 분석</h2>
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">
                공기밥이 3,025,000원으로 가장 높은 매출을 기록했으며, 이는 전체
                매출의 약 21.5%입니다.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                소주와 조림점심특선이 각각 2위와 3위를 차지했습니다.
              </p>
              <p className="text-sm text-gray-700">
                상위 5개 제품이 전체 매출의 약 60%를 차지합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 세 번째 행 - 요일별 매출 (왼쪽 70%) + 요약 (오른쪽 30%) */}
        <div className="flex flex-col lg:flex-row mb-6 gap-6">
          <div className="w-full lg:w-[30%] bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">요일별 분석</h2>
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">
                일요일이 3,703,000원으로 가장 높은 매출을 기록했습니다.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                주말(토, 일)에 전체 매출의 약 49.5%가 발생했습니다.
              </p>
              <p className="text-sm text-gray-700">
                화요일이 1,836,000원으로 가장 낮은 매출을 보였습니다.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[70%] bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">요일별 매출 현황</h2>
            <div className="h-60">
              <BarChart
                labels={weekdaySalesLabels}
                datasets={weekdaySalesDatasets}
                height={240}
              />
            </div>
          </div>
        </div>

        {/* 네 번째 행 - 평일/휴일 매출 (왼쪽 70%) + 시간대별 분석 (오른쪽 30%) */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[70%] order-1 lg:order-1 bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">평일/휴일 매출 비율</h2>
            <div className="flex items-center justify-between">
              <div className="w-1/2 h-full">
                <DoughnutChart chartData={holidaySalesData} />
              </div>
              <div className="w-1/2 px-4">
                {holidaySalesLegendItems.map((item, idx) => (
                  <div className="mb-3" key={idx}>
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 ${item.color} mr-2 rounded-sm`}
                      ></div>
                      <div className="text-sm">
                        {item.label}: {item.value}
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-gray-600 mt-2">
                  평일과 휴일 매출이 비슷한 수준으로 균형적인 분포를 보입니다.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[30%] order-2 lg:order-2 bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">시간대별 매출 분석</h2>
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">
                저녁 시간대 매출이 8,553,000원으로 전체의 60.7%를 차지합니다.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                점심 시간대 매출은 5,510,000원(39.1%)입니다.
              </p>
              <p className="text-sm text-gray-700">
                19시에 최고 매출 3,603,000원을 기록했습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 다섯 번째 행 - 시간대별 매출 (왼쪽 70%) + 분석 (오른쪽 30%) */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="w-full lg:w-[30%] bg-white p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">영업 전략 제안</h2>
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-2">
                저녁 시간대 매출 비중이 높으므로 저녁 메뉴 다양화를
                고려해보세요.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                주말 매출이 높은 점을 활용하여 주말 특별 메뉴나 이벤트를
                추가해보세요.
              </p>
              <p className="text-sm text-gray-700">
                화요일 매출 증대를 위한 '화요일 특가' 프로모션을 고려해보세요.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-[70%]  bg-white p-10 rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-2">
              식사 시간대별 매출 비율
            </h2>
            <div className="flex items-center justify-between">
              <div className="w-1/2 px-4">
                {timePeriodLegendItems.map((item, idx) => (
                  <div className="mb-3" key={idx}>
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 ${item.color} mr-2 rounded-sm`}
                      ></div>
                      <div className="text-sm">
                        {item.label}: {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-1/2 h-full">
                <PieChart chartData={timePeriodData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternateLayoutDashboard;
