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
      className={`absolute ${positionClasses[position]} bg-white p-3 rounded-md shadow-lg z-10 min-w-[200px]`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
        <div className="relative">
          <button
            className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-700 focus:outline-none hover:bg-gray-300 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            aria-label="등급 설명"
          >
            ?
          </button>

          {showTooltip && (
            <div
              className={`absolute ${tooltipPosition} bottom-0 w-72 bg-white p-4 rounded-md shadow-lg z-20 border border-gray-200`}
            >
              <div className="bg-blue-50 p-3 rounded-md">
                <h4 className="font-bold text-sm text-blue-800 mb-2">
                  등급 기준 안내
                </h4>
                <p className="text-gray-700 leading-relaxed text-xs">
                  각 행정동은{" "}
                  <span className="font-semibold text-blue-700">
                    인구, 매출, 임대료, 시설 접근성
                  </span>{" "}
                  등 다양한 지표를 종합적으로 분석한 점수를 기준으로 1등급부터
                  5등급까지 나누었습니다.
                </p>
                <p className="text-gray-700 leading-relaxed text-xs mt-2">
                  점수는{" "}
                  <span className="font-semibold text-blue-700">
                    우선순위로 선택한 요소
                  </span>
                  를 더 중요하게 반영하여 계산되며, 전체 점수 분포를 바탕으로{" "}
                  <span className="font-semibold text-blue-700">
                    상위 20%는 1등급, 하위 20%는 5등급
                  </span>
                  으로 구분됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-5 h-5 mr-2 rounded-sm shadow-sm"
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
