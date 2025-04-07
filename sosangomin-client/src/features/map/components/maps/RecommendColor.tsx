import React, { useState } from "react";
import { LegendItem, ColorLegendProps } from "@/features/map/types/map";

const RecommendColor: React.FC<ColorLegendProps> = ({
  position = "bottom-right",
  title = "등급 범례"
}) => {
  // 툴팁 표시 상태를 관리하는 state
  const [showTooltip, setShowTooltip] = useState(false);

  const legendItems: LegendItem[] = [
    {
      color: "#FF0000",
      label: "1등급",
      description: "매우 추천: 선택한 조건에 가장 적합한 지역입니다."
    },
    {
      color: "#FF8C00",
      label: "2등급",
      description: "추천: 선택한 조건에 적합한 지역입니다."
    },
    {
      color: "#FFFF00",
      label: "3등급",
      description: "보통: 일반적인 수준의 조건을 갖춘 지역입니다."
    },
    {
      color: "#00FF00",
      label: "4등급",
      description: "비추천: 선택한 조건에 다소 미흡한 지역입니다."
    },
    {
      color: "#0000FF",
      label: "5등급",
      description: "매우 비추천: 선택한 조건에 적합하지 않은 지역입니다."
    }
  ];

  // 위치에 따른 클래스 설정
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-left": "bottom-4 left-4"
  };

  // 툴팁 위치 계산 (오른쪽 정렬일 경우 왼쪽에 표시, 왼쪽 정렬일 경우 오른쪽에 표시)
  const tooltipPosition = position.includes("right")
    ? "right-full mr-2"
    : "left-full ml-2";

  return (
    <div
      className={`absolute ${positionClasses[position]} bg-white p-3 rounded-md shadow-lg z-10  min-w-[200px]`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
        <div className="relative">
          <button
            className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-700 focus:outline-none"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="등급 설명"
          >
            ?
          </button>

          {showTooltip && (
            <div
              className={`absolute ${tooltipPosition} bottom-0 w-64 bg-white p-3 rounded-md shadow-lg z-20 text-xs`}
            >
              <h4 className="font-bold mb-2 text-gray-800">등급 기준 설명</h4>
              <ul className="space-y-2">
                {legendItems.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex items-center mt-0.5">
                      <div
                        className="w-3 h-3 mr-1 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></div>
                    </div>
                    <div>
                      <span className="font-medium">{item.label}:</span>{" "}
                      {item.description}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

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

export default RecommendColor;
