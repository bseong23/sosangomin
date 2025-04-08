import React, { useState, useEffect } from "react";
import LineChart from "@/components/chart/LineChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import MixedChart from "@/components/chart/MixedChart";
import BarChart from "@/components/chart/BarChart";
import Legend from "./Legend";
import { getBuiness } from "@/features/map/api/analiysisApi";
import Loading from "@/components/common/Loading";
interface BusinessTabProps {
  selectedAdminName?: string;
  selectedCategory?: string;
}
interface DonutData {
  [key: string]: number;
}

const BusinessTab: React.FC<BusinessTabProps> = ({
  selectedAdminName = "지역 미지정",
  selectedCategory
}) => {
  const [businessData, setBusinessData] = useState<any>(null);
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (
        selectedAdminName &&
        selectedAdminName !== "지역 미지정" &&
        selectedCategory
      ) {
        try {
          const data = await getBuiness(selectedAdminName, selectedCategory);
          setBusinessData(data);
        } catch (error) {
          console.error("업종 데이터 로딩 실패:", error);
        } finally {
        }
      }
    };

    fetchBusinessData();
  }, [selectedAdminName, selectedCategory]);
  if (!businessData) return <Loading />;

  // 분기별 데이터 정렬 (1분기부터 4분기까지)
  const sortedQuarterData = [
    ...businessData.main_category_store_count.growth_rate_trend
  ].sort((a, b) => a.quarter - b.quarter);
  const quarterLabel = ["2024년 2분기", "2024년 3분기", "2024년 4분기"];
  const quarterLabels = [
    "2024년 1분기",
    "2024년 2분기",
    "2024년 3분기",
    "2024년 4분기"
  ];
  // 차트 데이터 준비

  // 각 카테고리별 데이터 추출
  const foodServiceData = sortedQuarterData.map(
    (item) => item.main_category_store_count_growth_rate["외식업"]
  );
  const wholesaleData = sortedQuarterData.map(
    (item) => item.main_category_store_count_growth_rate["도소매업"]
  );
  const serviceData = sortedQuarterData.map(
    (item) => item.main_category_store_count_growth_rate["서비스업"]
  );
  const otherData = sortedQuarterData.map(
    (item) => item.main_category_store_count_growth_rate["기타"]
  );

  const categoryColors: Record<string, string> = {
    한식음식점: "rgba(255, 99, 132, 0.7)", // 빨강
    "커피-음료": "rgba(54, 162, 235, 0.7)", // 파랑
    "호프-간이주점": "rgba(255, 206, 86, 0.7)", // 노랑
    양식음식점: "rgba(75, 192, 192, 0.7)", // 청록
    분식전문점: "rgba(153, 102, 255, 0.7)", // 보라
    일식음식점: "rgba(255, 159, 64, 0.7)", // 주황
    반찬가게: "rgba(100, 181, 246, 0.7)", // 하늘색
    제과점: "rgba(174, 214, 241, 0.7)", // 연파랑
    중식음식점: "rgba(255, 140, 0, 0.7)", // 다크 오렌지
    패스트푸드점: "rgba(46, 204, 113, 0.7)", // 연두색
    치킨전문점: "rgba(231, 76, 60, 0.7)" // 진빨강
  };
  const prepareDonutChartData = (region: any) => {
    const donutData: DonutData = businessData.food_category_stats[region].donut;

    // 상위 5개 필터링
    const top5Entries = Object.entries(donutData)
      .sort((a, b) => b[1] - a[1]) // 내림차순 정렬
      .slice(0, 5); // 상위 5개 선택
    return {
      labels: top5Entries.map(([key]) => key),
      datasets: [
        {
          label: `${region} 외식업 분포`,
          data: top5Entries.map(([, value]) => value),
          backgroundColor: top5Entries.map(
            ([key]) => categoryColors[key] || "rgba(200, 200, 200, 0.7)"
          ),
          borderColor: top5Entries.map(
            ([key]) => categoryColors[key] || "rgba(200, 200, 200, 1)"
          ),
          borderWidth: 1
        }
      ]
    };
  };

  const openRates = businessData.store_open_close["개업률"];
  const closeRates = businessData.store_open_close["폐업률"];
  const storeCounts = businessData.store_open_close["업소수"];

  // 각 지역별 도넛 차트 데이터
  const seoulDonutData = prepareDonutChartData("서울시");
  const districtDonutData = prepareDonutChartData("자치구");
  const neighborhoodDonutData = prepareDonutChartData("행정동");

  const businessChartData = {
    labels: ["운영", "폐업"], // Y축 카테고리
    datasets: [
      {
        label: "서울시",
        data: [
          businessData.operation_duration_summary["서울시 운영 영업 개월 평균"],
          businessData.operation_duration_summary["서울시 폐업 영업 개월 평균"]
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)" // 청록색
      },
      {
        label: businessData.food_category_stats["자치구 이름"],
        data: [
          businessData.operation_duration_summary["자치구 운영 영업 개월 평균"],
          businessData.operation_duration_summary["자치구 폐업 영업 개월 평균"]
        ],
        backgroundColor: "rgba(255, 159, 64, 0.6)" // 주황색
      },
      {
        label: businessData.food_category_stats["행정동 이름"],
        data: [
          businessData.operation_duration_summary["행정동 운영 영업 개월 평균"],
          businessData.operation_duration_summary["행정동 폐업 영업 개월 평균"]
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)" // 파란색
      }
    ]
  };
  const allValues = [
    ...foodServiceData,
    ...wholesaleData,
    ...serviceData,
    ...otherData
  ];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  // 최소값에서 5를 뺀 후 올림
  const yMin = Math.ceil(minValue - 5);
  // 최대값에서 5를 더한 후 올림
  const yMax = Math.ceil(maxValue + 5);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {selectedAdminName} 업종 현황
      </h3>
      {/* 분기별 업종 카테고리 추이 차트 */}
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">업종별 업소수 증감율</h3>
        <div className="flex flex-col px-2 py-4">
          {/* 차트 영역 */}
          <div className="w-full">
            <LineChart
              labels={quarterLabel}
              referenceYear="2024년"
              datasets={[
                {
                  label: "외식업",
                  data: foodServiceData,
                  borderColor: "rgba(53, 162, 235, 1)",
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                  tension: 0.1,
                  pointRadius: 4,
                  borderWidth: 2
                },
                {
                  label: "도소매업",
                  data: wholesaleData,
                  borderColor: "rgba(255, 159, 64, 1)",
                  backgroundColor: "rgba(255, 159, 64, 0.5)",
                  tension: 0.1,
                  pointRadius: 4,
                  borderWidth: 2
                },
                {
                  label: "서비스업",
                  data: serviceData,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.5)",
                  tension: 0.1,
                  pointRadius: 4,
                  borderWidth: 2
                },
                {
                  label: "기타",
                  data: otherData,
                  borderColor: "rgba(255, 99, 132, 1)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                  tension: 0.1,
                  pointRadius: 4,
                  borderWidth: 2
                }
              ]}
              yAxisTitle="증감률 (%)"
              unit="%"
              customOptions={{
                scales: {
                  y: {
                    min: yMin,
                    max: yMax,
                    ticks: {
                      callback: (value: any) => `${value}%` // Y축 라벨을 퍼센트 형식으로 표시
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context: any) =>
                        `${context.dataset.label}: ${context.raw}%` // 툴팁 값을 퍼센트 형식으로 표시
                    }
                  }
                }
              }}
            />
          </div>

          {/* Summary 영역 */}
          <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">요약</h4>
            <p className="text-base text-gray-700 leading-relaxed">
              {businessData.main_category_store_count.summary}
            </p>
          </div>
        </div>
      </div>
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">
          외식업 세부 카테고리 분포
        </h3>
        <div className="pb-5">
          <Legend categories={categoryColors} />
        </div>
        <div className="flex flex-wrap justify-between px-15 py-4">
          {/* 서울시 */}
          <div className="w-full md:w-1/5 mb-4 ">
            <h4 className="text-md font-medium mb-2">서울시</h4>
            <div className="">
              <DoughnutChart
                chartData={seoulDonutData}
                legendPosition="top"
                showLegend={false}
              />
            </div>
            <div className="flex flex-col justify-center pt-4 w-60">
              <p className="text-sm font-medium text-blue-600 mb-3">TOP 3</p>
              <div className="space-y-2">
                {businessData.food_category_stats.서울시.top3.map(
                  (item: any, index: any) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white 
            ${
              index === 0
                ? "bg-yellow-500"
                : index === 1
                ? "bg-gray-400"
                : "bg-amber-600"
            }`}
                      >
                        {index + 1}
                      </div>
                      <p className="ml-2 text-sm font-medium">
                        {item.category}{" "}
                        <span className="text-gray-500">({item.count}개)</span>
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm">
                  {selectedCategory} 순위:
                  <span className="font-bold text-lg text-blue-600">
                    {businessData.food_category_stats.서울시.industry_rank} 위
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 자치구 */}
          <div className="w-full md:w-1/5 mb-4">
            <h4 className="text-md font-medium mb-2">
              {businessData.food_category_stats["자치구 이름"]}
            </h4>
            <div className="">
              <DoughnutChart
                chartData={districtDonutData}
                legendPosition="top"
                showLegend={false}
              />
            </div>
            <div className="pt-4 w-60">
              <p className="text-sm font-medium text-blue-600 mb-3">TOP 3</p>
              <div className="space-y-2">
                {businessData.food_category_stats.자치구.top3.map(
                  (item: any, index: any) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white 
            ${
              index === 0
                ? "bg-yellow-500"
                : index === 1
                ? "bg-gray-400"
                : "bg-amber-600"
            }`}
                      >
                        {index + 1}
                      </div>
                      <p className="ml-2 text-sm font-medium">
                        {item.category}{" "}
                        <span className="text-gray-500">({item.count}개)</span>
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm">
                  {selectedCategory} 순위:{" "}
                  <span className="font-bold text-lg text-blue-600">
                    {businessData.food_category_stats.자치구.industry_rank}위
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 행정동 */}
          <div className="w-full md:w-1/5 mb-4">
            <h4 className="text-md font-medium mb-2">{selectedAdminName}</h4>
            <div className="">
              <DoughnutChart
                chartData={neighborhoodDonutData}
                legendPosition="top"
                showLegend={false}
              />
            </div>
            <div className="pt-4 w-60">
              <p className="text-sm font-medium text-blue-600 mb-3">TOP 3</p>
              <div className="space-y-2">
                {businessData.food_category_stats.행정동.top3.map(
                  (item: any, index: any) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white 
            ${
              index === 0
                ? "bg-yellow-500"
                : index === 1
                ? "bg-gray-400"
                : "bg-amber-600"
            }`}
                      >
                        {index + 1}
                      </div>
                      <p className="ml-2 text-sm font-medium">
                        {item.category}{" "}
                        <span className="text-gray-500">({item.count}개)</span>
                      </p>
                    </div>
                  )
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-sm">
                  {selectedCategory} 순위:{" "}
                  <span className="font-bold text-lg text-blue-600">
                    {businessData.food_category_stats.행정동.industry_rank}위
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 혼합 차트 (업소수는 막대 그래프 / 개업률과 폐업률은 선 그래프) */}
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">
          업종별 업소수 변화율 추이
        </h3>
        <MixedChart
          labels={quarterLabels}
          datasets={[
            {
              type: "bar",
              label: "업소수",
              data: storeCounts,
              backgroundColor: "rgba(75,192,192,0.6)"
            },
            {
              type: "line",
              label: "개업률",
              data: openRates,
              borderColor: "rgba(53,162,235,1)",
              borderWidth: 2,
              tension: 0.1
            },
            {
              type: "line",
              label: "폐업률",
              data: closeRates,
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 2,
              tension: 0.1
            }
          ]}
          yAxisLabel="업소 수"
          rightYAxisLabel="비율 (%)"
          leftMin={0}
          rightMin={0}
          height={400}
        />
      </div>
      <div className="p-4 rounded-lg shadow-md bg-white">
        <h3 className="text-lg font-semibold mb-4">운영 폐업 점포 갯수</h3>
        <BarChart
          labels={businessChartData.labels}
          datasets={businessChartData.datasets}
          yAxisLabel="운영 / 폐업"
          unit="개"
          customOptions={{
            scales: {
              y: {
                min: 0 // Y축 최소값을 20으로 설정
              }
            },
            // 막대 사이 간격 설정
            datasets: {
              bar: {
                categoryPercentage: 0.5, // 카테고리(x축 항목) 영역을 최대한 사용
                barPercentage: 1.0 // 막대가 카테고리 영역을 최대한 차지하도록 설정
              }
            }
          }}
          legend={true}
        />
      </div>
      ;
    </div>
  );
};

export default BusinessTab;
