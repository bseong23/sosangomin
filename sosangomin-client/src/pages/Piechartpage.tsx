import React, { useState } from "react";
import PieChart from "@/components/chart/PieChart";
import DoughnutChart from "@/components/chart/DoughnutChart";

const Piechartpage: React.FC = () => {
  // 차트 데이터 상태 설정
  const [chartData] = useState({
    labels: ["빨강", "파랑", "노랑", "초록", "보라"],
    datasets: [
      {
        label: "데이터셋 1",
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

  return (
    <div className="App">
      <div className="w-full mx-0 my-auto">
        <PieChart chartData={chartData} />
      </div>
      <div className="w-full mx-0 my-auto">
        <DoughnutChart chartData={chartData} />
      </div>
    </div>
  );
};

export default Piechartpage;
