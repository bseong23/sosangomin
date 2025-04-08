import React from "react";
import BarChart from "@/components/chart/BarChart";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

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

  const markdownComponents = {
    h1: (props: any) => (
      <h1 className="text-2xl font-bold my-4 text-bit-main" {...props} />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-semibold my-3 mb-5 text-bit-main"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3 className="text-lg font-medium my-2 text-bit-main" {...props} />
    ),
    p: (props: any) => (
      <p className="my-2 text-base  text-comment" {...props} />
    ),
    ul: (props: any) => <ul className="list-disc pl-5 my-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
    li: (props: any) => <li className="my-1" {...props} />,
    blockquote: (props: any) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic my-2"
        {...props}
      />
    )
  };

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
          customOptions={{
            scales: {
              y: {
                min: 0 // Y축 최소값을 20,000으로 설정
              }
            }
          }}
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-comment">
            <Markdown components={markdownComponents}>
              {temperatureSalesSummary}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureSalesSection;
