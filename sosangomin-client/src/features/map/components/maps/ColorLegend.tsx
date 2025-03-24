import React from "react";
import { LegendItem, ColorLegendProps } from "@/features/map/types/map";

const ColorLegend: React.FC<ColorLegendProps> = ({
  position = "bottom-right",
  title = "인구 분포 범례"
}) => {
  const legendItems: LegendItem[] = [
    { color: "#FF0000", label: "30,000명 초과" },
    { color: "#FF8C00", label: "20,000 ~ 30,000명" },
    { color: "#FFFF00", label: "10,000 ~ 20,000명" },
    { color: "#00FF00", label: "5,000 ~ 10,000명" },
    { color: "#0000FF", label: "5,000명 이하" }
  ];

  // 위치에 따른 클래스 설정
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-left": "bottom-4 left-4"
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} bg-white p-3 rounded-md shadow-lg z-10 min-w-[200px]`}
    >
      <h3 className="text-sm font-bold mb-2 text-gray-700">{title}</h3>
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-5 h-5 mr-2 rounded-sm"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorLegend;
