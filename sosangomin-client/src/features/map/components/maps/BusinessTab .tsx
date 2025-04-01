import React from "react";
import LineChart from "@/components/chart/LineChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import MixedChart from "@/components/chart/MixedChart";
import BarChart from "@/components/chart/BarChart";
interface BusinessTabProps {
  selectedAdminName?: string;
  businessData?: any;
}

const BusinessTab: React.FC<BusinessTabProps> = ({
  selectedAdminName = "지역 미지정",
  businessData
}) => {
  if (!businessData) return <p>데이터를 불러오는 중...</p>;

  // 분기별 데이터 정렬 (1분기부터 4분기까지)
  const sortedQuarterData = [...businessData.main_category_store_count].sort(
    (a, b) => a.quarter - b.quarter
  );

  // 차트 데이터 준비
  const quarters = sortedQuarterData.map(
    (item) => `${item.year} Q${item.quarter}`
  );

  // 각 카테고리별 데이터 추출
  const foodServiceData = sortedQuarterData.map(
    (item) => item.main_category_store_count["외식업"]
  );
  const wholesaleData = sortedQuarterData.map(
    (item) => item.main_category_store_count["도소매업"]
  );
  const serviceData = sortedQuarterData.map(
    (item) => item.main_category_store_count["서비스업"]
  );
  const otherData = sortedQuarterData.map(
    (item) => item.main_category_store_count["기타"]
  );
  const prepareDonutChartData = (region: any) => {
    const donutData = businessData.food_category_stats[region].donut;

    return {
      labels: Object.keys(donutData),
      datasets: [
        {
          label: `${region} 외식업 분포`, // 라벨 추가
          data: Object.values(donutData) as number[], // 명시적 타입 변환
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
            "rgba(199, 199, 199, 0.7)",
            "rgba(83, 102, 255, 0.7)",
            "rgba(40, 159, 64, 0.7)",
            "rgba(210, 105, 30, 0.7)",
            "rgba(128, 0, 128, 0.7)"
          ],
          borderColor: [
            // 테두리 색상 추가
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(199, 199, 199, 1)",
            "rgba(83, 102, 255, 1)",
            "rgba(40, 159, 64, 1)",
            "rgba(210, 105, 30, 1)",
            "rgba(128, 0, 128, 1)"
          ],
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
        label: "자치구",
        data: [
          businessData.operation_duration_summary["자치구 운영 영업 개월 평균"],
          businessData.operation_duration_summary["자치구 폐업 영업 개월 평균"]
        ],
        backgroundColor: "rgba(255, 159, 64, 0.6)" // 주황색
      },
      {
        label: "행정동",
        data: [
          businessData.operation_duration_summary["행정동 운영 영업 개월 평균"],
          businessData.operation_duration_summary["행정동 폐업 영업 개월 평균"]
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)" // 파란색
      }
    ]
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {selectedAdminName} 업종 현황
      </h3>
      {/* 분기별 업종 카테고리 추이 차트 */}
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <div className="flex flex-col px-2 py-4 md:flex-row">
          <div className="w-full md:w-3/4">
            <LineChart
              title={`${selectedAdminName} 분기별 업종 현황 (${sortedQuarterData[0].year})`}
              labels={quarters}
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
              yAxisTitle="업소 수"
            />
          </div>

          <div className="grid grid-rows-3 gap-4 md:px-10 justify-center md:w-1/4">
            <div>
              <p className="text-sm text-gray-600">가장 많은 업종</p>
              <p className="text-2xl font-bold">외식업</p>
              <p className="text-sm text-gray-600">
                {foodServiceData[foodServiceData.length - 1]}개 업소
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">외식업 비율</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  (foodServiceData[foodServiceData.length - 1] /
                    (foodServiceData[foodServiceData.length - 1] +
                      wholesaleData[wholesaleData.length - 1] +
                      serviceData[serviceData.length - 1] +
                      otherData[otherData.length - 1])) *
                    100
                )}
                %
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">전체 업소 수</p>
              <p className="text-2xl font-bold">
                {foodServiceData[foodServiceData.length - 1] +
                  wholesaleData[wholesaleData.length - 1] +
                  serviceData[serviceData.length - 1] +
                  otherData[otherData.length - 1]}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">
          외식업 세부 카테고리 분포
        </h3>
        <div className="flex flex-wrap justify-between">
          {/* 서울시 */}
          <div className="w-full md:w-1/3 mb-4">
            <h4 className="text-md font-medium mb-2">서울시</h4>
            <div className="">
              <DoughnutChart chartData={seoulDonutData} legendPosition="left" />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium">TOP 3</p>
              {businessData.food_category_stats.서울시.top3.map(
                (item: any, index: any) => (
                  <p key={index} className="text-xs">
                    {index + 1}. {item.category} ({item.count}개)
                  </p>
                )
              )}
            </div>
            <p className="text-sm mt-2">
              업종 순위:{" "}
              <span className="font-bold">
                {businessData.food_category_stats.서울시.industry_rank}위
              </span>
            </p>
          </div>

          {/* 자치구 */}
          <div className="w-full md:w-1/3 mb-4">
            <h4 className="text-md font-medium mb-2">자치구</h4>
            <div className="">
              <DoughnutChart
                chartData={districtDonutData}
                legendPosition="left"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium">TOP 3</p>
              {businessData.food_category_stats.자치구.top3.map(
                (item: any, index: any) => (
                  <p key={index} className="text-xs">
                    {index + 1}. {item.category} ({item.count}개)
                  </p>
                )
              )}
            </div>
            <p className="text-sm mt-2">
              업종 순위:{" "}
              <span className="font-bold">
                {businessData.food_category_stats.자치구.industry_rank}위
              </span>
            </p>
          </div>

          {/* 행정동 */}
          <div className="w-full md:w-1/3 mb-4">
            <h4 className="text-md font-medium mb-2">{selectedAdminName}</h4>
            <div className="">
              <DoughnutChart
                chartData={neighborhoodDonutData}
                legendPosition="left"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium">TOP 3</p>
              {businessData.food_category_stats.행정동.top3.map(
                (item: any, index: any) => (
                  <p key={index} className="text-xs">
                    {index + 1}. {item.category} ({item.count}개)
                  </p>
                )
              )}
            </div>
            <p className="text-sm mt-2">
              내 업종 순위:{" "}
              <span className="font-bold">
                {businessData.food_category_stats.행정동.industry_rank}위
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* 혼합 차트 (업소수는 막대 그래프 / 개업률과 폐업률은 선 그래프) */}
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <MixedChart
          labels={quarters}
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
          title="분기별 업소수와 개업/폐업률"
          xAxisLabel="분기"
          yAxisLabel="비율 (%)"
        />
      </div>
      <div className="p-4 rounded-lg shadow-md bg-white">
        <BarChart
          labels={businessChartData.labels}
          datasets={businessChartData.datasets}
          title="운영 vs 폐업 (시, 구, 동 별)"
          xAxisLabel="개월 수"
          yAxisLabel="운영 / 폐업"
          legend={true}
          horizontal={true} // ✅ 가로 바 차트로 변경
        />
      </div>
      ;
    </div>
  );
};

export default BusinessTab;
