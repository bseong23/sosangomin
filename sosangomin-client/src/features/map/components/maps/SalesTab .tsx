import React, { useState, useEffect } from "react";
import { getSales } from "@/features/map/api/analiysisApi";
import BarChart from "@/components/chart/BarChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import Legend from "./Legend";
import SalesTabSalesCount from "./SalesTabsalescount";
import SalesTabsalessale from "@/features/map/components/maps/SalesTabsalessale";
import LineChart from "@/components/chart/LineChart";
interface SalesTabProps {
  selectedAdminName?: string;
  selectedCategory?: string;
}

interface DonutData {
  [key: string]: number;
}

const SalesTab: React.FC<SalesTabProps> = ({
  selectedAdminName,
  selectedCategory
}) => {
  const [salesData, setSalesData] = useState<any>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (selectedAdminName && selectedCategory) {
        try {
          const data = await getSales(selectedAdminName, selectedCategory);
          setSalesData(data);
        } catch (error) {
          console.error("매출 데이터 로딩 실패:", error);
        }
      }
    };

    fetchSalesData();
  }, [selectedAdminName, selectedCategory]);

  if (!salesData) {
    return <p>데이터를 불러오는 중...</p>;
  }

  // 📌 바 차트 데이터 (분기별 매출)
  const quarterlySales = [...(salesData?.main_category_sales_count || [])].sort(
    (a, b) => a.quarter - b.quarter
  );

  // 분기 라벨 (ex: "2024 Q1")
  const labels = quarterlySales.map(
    (item: any) => `${item.year} ${item.quarter}분기`
  );

  // 카테고리별 색상 설정
  const barcategoryColors: Record<string, string> = {
    기타: "rgba(255, 99, 132, 0.5)",
    도소매업: "rgba(255, 159, 64, 0.5)",
    서비스업: " rgba(75, 192, 192, 0.5)",
    외식업: "rgba(53, 162, 235, 0.5) "
  };

  // 데이터셋 생성
  const categories = ["외식업", "도소매업", "서비스업", "기타"];
  const datasets = categories.map((category) => ({
    label: category,
    data: quarterlySales.map(
      (item: any) => item.main_category_sales_count?.[category] || 0
    ),
    backgroundColor: barcategoryColors[category],
    borderColor: barcategoryColors[category].replace("0.6", "1"), // 테두리 색상
    borderWidth: 1
  }));
  const barChartData = {
    labels,
    datasets
  };

  // 📌 도넛 차트 데이터 (상위 5개 업종 매출)
  const categoryColors: Record<string, string> = {
    한식음식점: "rgba(255, 99, 132, 0.7)",
    "커피-음료": "rgba(54, 162, 235, 0.7)",
    "호프-간이주점": "rgba(255, 206, 86, 0.7)",
    양식음식점: "rgba(75, 192, 192, 0.7)",
    분식전문점: "rgba(153, 102, 255, 0.7)",
    일식음식점: "rgba(255, 159, 64, 0.7)",
    반찬가게: "rgba(100, 181, 246, 0.7)",
    제과점: "rgba(174, 214, 241, 0.7)",
    중식음식점: "rgba(255, 140, 0, 0.7)",
    패스트푸드점: "rgba(46, 204, 113, 0.7)",
    치킨전문점: "rgba(231, 76, 60, 0.7)"
  };
  const sortedQuarterData = [...salesData.main_category_sales_count].sort(
    (a, b) => a.quarter - b.quarter
  );

  const foodServiceData = sortedQuarterData.map(
    (item) => item.main_category_sales_count["외식업"]
  );
  const wholesaleData = sortedQuarterData.map(
    (item) => item.main_category_sales_count["도소매업"]
  );
  const serviceData = sortedQuarterData.map(
    (item) => item.main_category_sales_count["서비스업"]
  );
  const otherData = sortedQuarterData.map(
    (item) => item.main_category_sales_count["기타"]
  );
  const prepareDonutChartData = (region: string) => {
    const donutData: DonutData =
      salesData.food_sales_stats?.[region]?.donut || {};

    const top5Entries = Object.entries(donutData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

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
  <BarChart
    labels={barChartData.labels}
    datasets={barChartData.datasets}
    title="분기별 매출 비교"
    height={300}
    customOptions={{
      scales: {
        y: {
          min: 0 // Y축 최소값을 20,000으로 설정
        }
      }
    }}
  />;
  const seoulDonutData = prepareDonutChartData("서울시");
  const districtDonutData = prepareDonutChartData("자치구");
  const neighborhoodDonutData = prepareDonutChartData("행정동");
  const summaryData = salesData?.sales_detail.요약 || {};
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {selectedAdminName} 매출 정보
      </h3>
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">
          업종별 매출 건수 변화율 추이
        </h3>
        <div className="flex flex-col px-2 py-4 md:flex-row">
          <div className="md:w-2/3">
            <LineChart
              labels={labels}
              referenceYear={sortedQuarterData[0].year + "년"}
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
              unit="개"
            />
          </div>

          <div className="md:w-1/3 flex flex-col justify-center mt-6 md:mt-0">
            <div className="flex flex-col gap-6 md:px-6">
              <div className="p-5 bg-white shadow-lg rounded-lg border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow">
                <p className="text-sm text-blue-600 font-medium mb-2">
                  가장 매출 높은 행정동
                </p>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  {salesData.sales_comparison.가장_매출_높은_행정동.지역}
                </p>
                <div className="flex flex-col mt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">매출금액</p>
                    <p className="text-lg text-blue-600 font-bold">
                      {salesData.sales_comparison.가장_매출_높은_행정동.매출.toLocaleString()}
                      원
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-600">매출건수</p>
                    <p className="text-lg text-blue-600 font-bold">
                      {salesData.sales_comparison.가장_매출_높은_행정동.건수.toLocaleString()}
                      건
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white shadow-lg rounded-lg border-l-4 border-l-green-500 hover:shadow-xl transition-shadow">
                <p className="text-sm text-green-600 font-medium mb-2">
                  선택 행정동
                </p>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  {salesData.sales_comparison.내_행정동.지역}
                </p>
                <div className="flex flex-col mt-3">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">매출금액</p>
                    <p className="text-lg text-green-600 font-bold">
                      {(
                        salesData.sales_comparison.내_행정동.매출 ?? 0
                      ).toLocaleString()}
                      원
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-600">매출건수</p>
                    <p className="text-lg text-green-600 font-bold">
                      {(
                        salesData.sales_comparison.내_행정동.건수 ?? 0
                      ).toLocaleString()}
                      건
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-5 text-gray-700">
          {selectedAdminName} {selectedCategory} 매출 요약
        </h3>

        {/* 매출 금액 섹션 */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-4">
            매출 금액
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white shadow rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-2">
                가장 많은 요일
              </h5>
              <p className="text-base font-bold text-gray-900">
                {summaryData.매출_금액_많은_요일}
              </p>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-2">
                가장 많은 시간대
              </h5>
              <p className="text-base font-bold text-gray-900">
                {summaryData.매출_금액_많은_시간대}
              </p>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-2">
                가장 많은 연령대
              </h5>
              <p className="text-base font-bold text-gray-900">
                {summaryData.매출_금액_많은_연령대}
              </p>
            </div>
          </div>
        </div>

        {/* 매출 건수 섹션 */}
        <div>
          <h4 className="text-md font-semibold text-gray-700 mb-4">
            매출 건수
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white shadow rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-2">
                가장 많은 요일
              </h5>
              <p className="text-base font-bold text-gray-900">
                {summaryData.매출_건수_많은_요일}
              </p>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-2">
                가장 많은 시간대
              </h5>
              <p className="text-base font-bold text-gray-900">
                {summaryData.매출_건수_많은_시간대}
              </p>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 border-b pb-2">
                가장 많은 연령대
              </h5>
              <p className="text-base font-bold text-gray-900">
                {summaryData.매출_건수_많은_연령대}
              </p>
            </div>
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
        <div className="flex flex-wrap justify-between">
          {["서울시", "자치구", "행정동"].map((region) => (
            <div key={region} className="w-full md:w-1/4 mb-4">
              <h4 className="text-md font-medium mb-2">
                {region === "행정동" ? selectedAdminName : region}
              </h4>
              <DoughnutChart
                chartData={
                  region === "서울시"
                    ? seoulDonutData
                    : region === "자치구"
                    ? districtDonutData
                    : neighborhoodDonutData
                }
                legendPosition="top"
                showLegend={false}
              />
              <div className="pt-4 w-60">
                <p className="text-sm font-medium text-blue-600 mb-3">TOP 3</p>
                <div className="space-y-2">
                  {salesData.food_sales_stats?.[region]?.top3?.map(
                    (item: any, index: number) => (
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
                          <span className="text-gray-500">
                            ({item.count.toLocaleString()}번)
                          </span>
                        </p>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm">
                    {selectedCategory} 순위:
                    <span className="font-bold text-lg text-blue-600">
                      {salesData.food_sales_stats?.[region]?.industry_rank}위
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <SalesTabsalessale
          salesData={salesData.sales_detail}
          selectedAdminName={selectedAdminName}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        {" "}
        <SalesTabSalesCount
          salesData={salesData.sales_detail}
          selectedAdminName={selectedAdminName}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
};

export default SalesTab;
