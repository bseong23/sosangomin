import React, { useState } from "react";
import BarChart from "@/components/chart/BarChart";

interface SalesData {
  매출금액: {
    [key: string]: {
      "내 지역": number;
      "서울 평균": number;
    };
  };
}

interface SalesTabSalesCountProps {
  salesData: SalesData;
  selectedAdminName?: string;
  selectedCategory?: string;
}

const SalesTabsalessale: React.FC<SalesTabSalesCountProps> = ({
  salesData,
  selectedAdminName,
  selectedCategory
}) => {
  const [activeTab, setActiveTab] = useState(0);

  // 탭 구성 변경 - 4개 탭으로 수정
  const tabData = [
    {
      name: "주중/주말",
      data: ["weekday", "weekend"],
      labels: ["평일", "주말"]
    },
    {
      name: "요일별",
      data: ["mon", "tues", "wed", "thur", "fri", "sat", "sun"],
      labels: ["월", "화", "수", "목", "금", "토", "일"]
    },
    {
      name: "시간별",
      data: [
        "time_00_06",
        "time_06_11",
        "time_11_14",
        "time_14_17",
        "time_17_21",
        "time_21_24"
      ],
      labels: [
        "0시~6시",
        "6시~11시",
        "11시~14시",
        "14시~17시",
        "17시~21시",
        "21시~24시"
      ]
    },
    {
      name: "연령대별",
      data: ["age_10", "age_20", "age_30", "age_40", "age_50", "age_60"],
      labels: ["10대", "20대", "30대", "40대", "50대", "60대 이상"]
    }
  ];

  const formatNumber = (num: number) => num.toLocaleString();
  // 현재 선택된 탭의 데이터로 차트 데이터 생성
  const currentTabData = tabData[activeTab];
  const chartLabels = currentTabData.labels;

  // 내 지역 데이터와 서울 평균 데이터 추출
  const myAreaData = currentTabData.data.map(
    (key) => salesData.매출금액[key]["내 지역"]
  );
  const seoulAvgData = currentTabData.data.map(
    (key) => salesData.매출금액[key]["서울 평균"]
  );

  // 차트 데이터셋 구성
  const chartDatasets = [
    {
      label: selectedAdminName || "내 지역",
      data: myAreaData,
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    },
    {
      label: "서울 평균",
      data: seoulAvgData,
      backgroundColor: "rgba(255, 99, 132, 0.6)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1
    }
  ];

  return (
    <div>
      {/* 탭 버튼 */}
      <h3 className="text-lg font-semibold mb-4">
        {selectedAdminName} {selectedCategory} 매출 금액 상세
      </h3>
      <div className="flex flex-wrap lg:flex-nowrap space-x-1 rounded-xl bg-blue-900/20 p-1 mb-10">
        {tabData.map((tab, index) => (
          <button
            key={index}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium leading-5 
              ${
                activeTab === index
                  ? "bg-bit-main shadow text-white"
                  : "text-gray-600 hover:bg-white/[0.12] hover:text-blue-700"
              }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      {/* 차트 영역 */}
      <div className="mb-6">
        <BarChart
          labels={chartLabels}
          datasets={chartDatasets}
          height={300}
          legend={true}
          legendPosition="top"
          responsive={true}
          maintainAspectRatio={false}
          animation={true}
          yAxisLabel="매출 금액"
          unit="원"
          stacked={false}
          beginAtZero={true}
          customOptions={{
            scales: {
              y: {
                min: 0
              }
            }
          }}
        />
      </div>
      {/* 테이블 영역 */}
      <div className="tab-content mt-6 hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                구분
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {selectedAdminName}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                서울 평균
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTabData.data.map((item, index) => (
              <tr key={item}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currentTabData.labels[index]}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatNumber(salesData.매출금액[item]["내 지역"])}원
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatNumber(salesData.매출금액[item]["서울 평균"])}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTabsalessale;
