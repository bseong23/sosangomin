import React from "react";
import BarChart from "@/components/chart/BarChart";

interface SalesRankingCardProps {
  title: string;
  labels: string[];
  datasets: any[];
  height?: number;
  horizontal?: boolean;
  comment?: string;
}

const SalesRankingCard: React.FC<SalesRankingCardProps> = ({
  title,
  labels,
  datasets,
  height = 250,
  horizontal = false,
  comment
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div style={{ height: `${height}px` }}>
        <BarChart
          labels={labels}
          datasets={datasets}
          height={height}
          yAxisLabel="금액 (원)"
          horizontal={horizontal}
        />
        {comment && <p className="text-sm text-gray-600 mt-2">{comment}</p>}
      </div>
    </div>
  );
};

export default SalesRankingCard;
