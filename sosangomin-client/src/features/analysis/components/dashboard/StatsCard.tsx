// src/features/analysis/components/StatsCard.tsx
import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  colorClass?: string;
  icon?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subValue,
  colorClass = "text-blue-500",
  icon
}) => {
  // 숫자 값인 경우 자동으로 포맷팅
  const formattedValue =
    typeof value === "number" && value >= 1000
      ? `₩${value.toLocaleString("ko-KR")}`
      : value;

  return (
    <div className="bg-white rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold">{formattedValue}</p>
          {subValue && <p className={`${colorClass} text-sm`}>{subValue}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </div>
  );
};

export default StatsCard;
