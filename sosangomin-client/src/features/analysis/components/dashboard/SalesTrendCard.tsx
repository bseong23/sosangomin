// src/features/analysis/components/SalesTrendCard.tsx

import React from "react";
import LineChart from "@/components/chart/LineChart";

interface SalesTrendCardProps {
  title: string;
  labels: string[];
  datasets: any[];
  height?: number;
  comment?: string;
}

const SalesTrendCard: React.FC<SalesTrendCardProps> = ({
  title,
  labels,
  datasets,
  height = 250,
  comment
}) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div style={{ height: `${height}px` }}>
        <LineChart
          title=""
          labels={labels}
          datasets={datasets}
          legend={false}
        />
      </div>
      {comment && <p className="text-sm text-gray-600 mt-2">{comment}</p>}
    </div>
  );
};

export default SalesTrendCard;
