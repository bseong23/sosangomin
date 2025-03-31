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

const AnalysisDashboard: React.FC = () => {
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

  const basicStatsSummary = data?.result_data?.basic_stats?.summary || "";

  // 요일별 매출 데이터
  const weekdaySales = data?.result_data?.weekday_sales?.data || {
    Saturday: 3264000,
    Sunday: 3703000,
    Thursday: 2649000,
    Tuesday: 1836000,
    Wednesday: 2637000
  };

  const weekdaySalesSummary = data?.result_data?.weekday_sales?.summary || "";

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

  const hourlySalesSummary = data?.result_data?.hourly_sales?.summary || "";

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

  const topProductsSummary = data?.result_data?.top_products?.summary || "";

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

  const timePeriodSalesSummary =
    data?.result_data?.time_period_sales?.summary || "";

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

  const holidaySalesSummary = data?.result_data?.holiday_sales?.summary || "";

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

  // 시즌 매출 데이터
  const seasonSales = data?.result_data?.season_sales?.data || {
    봄: 14089000
  };

  const seasonSalesSummary = data?.result_data?.season_sales?.summary || "";

  // 전체 요약
  const overallSummary = data?.summary || "";

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

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength: number = 300) => {
    if (!summary) return "";
    return summary.length > maxLength
      ? summary.substring(0, maxLength) + "..."
      : summary;
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            지금 우리 가게는?
          </h1>
          <div className="text-sm text-gray-500">
            최근 분석 일자:{" "}
            {/* {new Date(data.created_at.$date).toLocaleDateString("ko-KR")} */}
          </div>
        </div>

        {/* 전체 요약 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            핵심 요약
          </h2>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-gray-700">
              {truncateSummary(overallSummary, 500)}
            </p>
          </div>
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

        {/* 기본 통계 요약 */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <p className="text-sm text-gray-700">
            {truncateSummary(basicStatsSummary)}
          </p>
        </div>

        {/* 시간별 매출 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">
            우리 가게 시간별 매출액
          </h2>
          <div
            className="mb-4"
            style={{ width: "100%", height: "350px", overflow: "hidden" }}
          >
            <LineChart
              title=""
              labels={hourlySalesLabels}
              datasets={hourlySalesDatasets}
              yAxisTitle="금액 (원)"
            />
          </div>
          <div className="mt-2 mb-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-700">데이터 분석</h3>
              <p className="text-sm text-gray-600">
                {truncateSummary(hourlySalesSummary)}
              </p>
            </div>
          </div>
        </div>

        {/* 인기 메뉴 랭킹 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">인기 메뉴 랭킹</h2>
          <div
            className="mb-4"
            style={{ width: "100%", height: "350px", overflow: "hidden" }}
          >
            <BarChart
              labels={topProductsLabels}
              datasets={topProductsDatasets}
              horizontal={true}
              yAxisLabel="금액 (원)"
            />
          </div>
          <div className="mt-2 mb-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-700">메뉴 매출 분석</h3>
              <p className="text-sm text-gray-600">
                {truncateSummary(topProductsSummary)}
              </p>
            </div>
          </div>
        </div>

        {/* 요일별 매출 현황 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">요일별 매출 현황</h2>
          <div
            className="mb-4"
            style={{ width: "100%", height: "350px", overflow: "hidden" }}
          >
            <BarChart
              labels={weekdaySalesLabels}
              datasets={weekdaySalesDatasets}
            />
          </div>
          <div className="mt-2 mb-2">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2 text-gray-700">요일별 분석</h3>
              <p className="text-sm text-gray-600">
                {truncateSummary(weekdaySalesSummary)}
              </p>
            </div>
          </div>
        </div>

        {/* 평일/휴일 매출 비율 & 시간대별 매출 분석 */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">평일/휴일 매출 비율</h2>
            <div
              className="flex justify-center items-center mb-4"
              style={{ height: "220px" }}
            >
              <div style={{ width: "200px", height: "200px" }}>
                <DoughnutChart chartData={holidaySalesData} />
              </div>
            </div>
            <div className="mt-2">
              <div className="grid grid-cols-2 gap-2 mb-2">
                {holidaySalesLegendItems.map((item, idx) => (
                  <div
                    className="flex items-center px-2 py-1 bg-gray-50 rounded"
                    key={idx}
                  >
                    <div
                      className={`w-3 h-3 ${item.color} mr-2 rounded-sm`}
                    ></div>
                    <div className="text-xs">
                      {item.label}: {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {truncateSummary(holidaySalesSummary, 150)}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              식사 시간대별 매출 비율
            </h2>
            <div
              className="flex justify-center items-center mb-4"
              style={{ height: "220px" }}
            >
              <div style={{ width: "200px", height: "200px" }}>
                <PieChart chartData={timePeriodData} />
              </div>
            </div>
            <div className="mt-2">
              <div className="grid grid-cols-2 gap-2 mb-2">
                {timePeriodLegendItems.map((item, idx) => (
                  <div
                    className="flex items-center px-2 py-1 bg-gray-50 rounded"
                    key={idx}
                  >
                    <div
                      className={`w-3 h-3 ${item.color} mr-2 rounded-sm`}
                    ></div>
                    <div className="text-xs">
                      {item.label}: {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  {truncateSummary(timePeriodSalesSummary, 150)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 시즌 매출 & 영업 전략 제안 */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">시즌별 매출 분석</h2>
            <div className="p-4 mb-4">
              {Object.entries(seasonSales).map(([season, amount], idx) => (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{season}</span>
                    <span>₩{amount.toLocaleString("ko-KR")}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full w-full"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {truncateSummary(seasonSalesSummary, 200)}
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">영업 전략 제안</h2>
            <div className="p-4 bg-blue-50 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2 mt-0.5">
                    1
                  </div>
                  <p className="text-sm">
                    주말(토,일) 매출 강세를 활용한 주말 특별 메뉴나 이벤트
                    기획을 고려해보세요.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2 mt-0.5">
                    2
                  </div>
                  <p className="text-sm">
                    저녁 시간대(특히 19시) 매출이 가장 높으므로, 저녁 시간
                    서비스 품질 향상과 메뉴 다양화에 집중하세요.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2 mt-0.5">
                    3
                  </div>
                  <p className="text-sm">
                    화요일 매출 증대를 위한 '화요일 특가' 프로모션이나 마케팅
                    활동을 고려해보세요.
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2 mt-0.5">
                    4
                  </div>
                  <p className="text-sm">
                    매출이 낮은 오후 시간대(특히 15-16시)에 특별 할인이나 세트
                    메뉴를 도입해보세요.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 다음달 예상 매출 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">다음달 예상 매출액</h2>
          <div className="p-8 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">이번달 매출</span>
                <span className="font-medium">₩14,089,000</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700">예상 성장률</span>
                <span className="text-green-600 font-medium">+12.1%</span>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center mb-4">
                <p className="text-gray-600 mb-2">다음달 예상 매출액</p>
                <p className="text-blue-700 text-3xl font-bold">₩15,800,000</p>
              </div>
              <p className="text-center text-sm text-gray-600">
                이상적인 성장 그래프를 그리고 있으니 현재 전략을 유지하는 것을
                목표로 해보세요!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
