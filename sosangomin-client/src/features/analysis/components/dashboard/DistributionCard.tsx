// src/features/analysis/components/DistributionCard.tsx
import React from "react";
import PieChart from "@/components/chart/PieChart";
import DoughnutChart from "@/components/chart/DoughnutChart";

interface LegendItem {
  color: string;
  label: string;
  value: string;
}

interface DistributionCardProps {
  title: string;
  chartData: any;
  chartType: "pie" | "doughnut";
  legendItems: LegendItem[];
  comment?: string;
}

const DistributionCard: React.FC<DistributionCardProps> = ({
  title,
  chartData,
  chartType = "pie",
  legendItems,
  comment
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-30 w-full">
          {chartType === "pie" ? (
            <PieChart chartData={chartData} />
          ) : (
            <DoughnutChart chartData={chartData} />
          )}
        </div>
        <div className="flex flex-col justify-center">
          {legendItems.map((item, index) => (
            <div className="mb-3" key={index}>
              <div className="flex items-center">
                <div className={`w-4 h-4 ${item.color} mr-2 rounded-sm`}></div>
                <div className="text-sm">
                  {item.label}: {item.value}
                </div>
              </div>
            </div>
          ))}
          {comment && <p className="text-sm text-gray-600 mt-2">{comment}</p>}
        </div>
      </div>
    </div>
  );
};

export default DistributionCard;
