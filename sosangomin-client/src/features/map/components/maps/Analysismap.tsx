import React, { useState } from "react";
import { MapSidebarProps } from "@/features/map/types/map";
import DoughnutChart from "@/components/chart/DoughnutChart";
import BarChart from "@/components/chart/BarChart";

const Analysismap: React.FC<MapSidebarProps> = () => {
  const [chartData] = useState({
    labels: ["10대", "20대", "30대", "40대", "50대 이상"],
    datasets: [
      {
        label: "연령별 분포",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1
      }
    ]
  });

  // 상권 분포도를 위한 데이터
  const barLabels = ["한식", "일식", "중식", "양식", "기타"];
  const barDatasets = [
    {
      label: "상권 분포",
      data: [25, 18, 12, 8, 5],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1
    }
  ];

  return (
    <div className="p-6">
      {/* 헤더 섹션 */}
      <div className="mb-6 relative">
        <h2 className="text-xl font-bold">내 주변 상권은?</h2>
      </div>

      {/* 인구 분포도 섹션 */}
      <div className="mb-6 h-full">
        <h3 className="text-lg font-semibold mb-2">인구 분포도</h3>
        <div className="w-full h-full">
          <DoughnutChart chartData={chartData} />
        </div>
      </div>

      {/* 상권 분포도 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">상권 분포도</h3>
        <BarChart
          labels={barLabels}
          datasets={barDatasets}
          height={200}
          title="업종별 분포"
          responsive={true}
          maintainAspectRatio={false}
          gridLines={true}
          beginAtZero={true}
          animation={true}
        />
      </div>
    </div>
  );
};

export default Analysismap;
