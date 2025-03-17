import React from "react";
import MixedChart from "@/components/chart/MixedChart"; // 위에서 만든 MixedChart 컴포넌트 import

/**
 * MixedChart 컴포넌트 사용 예시
 */
const DataUploadPage: React.FC = () => {
  // 예시 데이터 - 월별 매출과 목표
  const labels = ["1월", "2월", "3월"];

  const datasets = [
    {
      // 막대 그래프 - 실제 매출
      type: "bar" as const,
      label: "매출",
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
      data: [4500, 5200, 4800, 6100, 5800, 7200]
    },
    {
      // 선 그래프 - 매출 목표
      type: "line" as const,
      label: "객수",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
      fill: false,
      tension: 0.1, // 약간의 곡선
      pointRadius: 4,
      data: [5000, 5000, 5500, 5500, 6000, 6000]
    }
  ];

  return (
    <div className="p-4">
      <MixedChart
        labels={labels}
        datasets={datasets}
        height={400}
        title="월별 매출, 비용 및 목표"
        xAxisLabel="월"
        yAxisLabel="금액 (천원)"
        legend={true}
        legendPosition="top"
        beginAtZero={true}
        onClick={(
          _,
          elements: Array<{ datasetIndex: number; index: number }>
        ) => {
          if (elements.length > 0) {
            const { datasetIndex, index } = elements[0];
            const datasetLabel = datasets[datasetIndex].label;
            const value = datasets[datasetIndex].data[index];
            const month = labels[index];
            alert(`${month}의 ${datasetLabel}: ${value.toLocaleString()}원`);
          }
        }}
      />
    </div>
  );
};

export default DataUploadPage;
