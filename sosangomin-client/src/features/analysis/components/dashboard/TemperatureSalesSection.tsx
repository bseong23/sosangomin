import React from "react";
import BarChart from "@/components/chart/BarChart";
import { AnalysisResultData } from "../../types/analysis";

interface TemperatureSalesSectionProps {
  data: AnalysisResultData;
}

const TemperatureSalesSection: React.FC<TemperatureSalesSectionProps> = ({
  data
}) => {
  // 기온별 매출 데이터
  const temperatureSales = data?.result_data?.temperature_sales?.data || {};
  const temperatureSalesSummary =
    data?.result_data?.temperature_sales?.summary || "";

  const temperatureSalesLabels = Object.keys(temperatureSales);
  const temperatureSalesDatasets = [
    {
      label: "기온별 매출",
      data: Object.values(temperatureSales),
      backgroundColor: [
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(199, 199, 199, 0.6)"
      ],
      borderWidth: 1
    }
  ];

  // 요약 텍스트 축약 함수
  const truncateSummary = (summary: string, maxLength: number = 300) => {
    return summary.length > maxLength
      ? summary.substring(0, maxLength) + "..."
      : summary;
  };

  return (
    <div className="bg-basic-white p-6 mb-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-10 text-comment">
        기온별 매출 분석
      </h2>
      <div
        className="mb-10"
        style={{ width: "100%", height: "350px", overflow: "hidden" }}
      >
        <BarChart
          labels={temperatureSalesLabels}
          datasets={temperatureSalesDatasets}
          height={350}
          yAxisLabel="매출 (원)"
          xAxisLabel="기온 구간"
          legend={false}
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-comment">
            {truncateSummary(temperatureSalesSummary)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureSalesSection;
