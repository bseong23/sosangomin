import React, { useState } from "react";
import { MapSidebarProps } from "@/features/map/types/map";
import Analysismap from "@/features/map/components/maps/Analysismap";
import Recommendmap from "@/features/map/components/maps/Recommendmap";
import ToggleSwitch from "@/features/map/components/maps/ToggleSwitch";

const MapSidebar: React.FC<MapSidebarProps> = ({
  onSearch,
  onClose,
  selectedAdminName
}) => {
  const [activeTab, setActiveTab] = useState<"상권분석" | "입지추천">(
    "상권분석"
  );

  const handleTabChange = (selected: string) => {
    setActiveTab(selected as "상권분석" | "입지추천");
  };

  return (
    <div className="absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[90%] max-md:h-[80%] md:top-9 md:left-8 md:h-[90%] md:w-100 bg-white shadow-lg rounded-lg z-20">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="닫기"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="px-15 pt-10">
        <ToggleSwitch
          options={["상권분석", "입지추천"]}
          defaultSelected="상권분석"
          onChange={handleTabChange}
        />
      </div>

      <div className="h-[calc(100%-100px)] overflow-y-auto">
        {activeTab === "상권분석" ? (
          <Analysismap
            onSearch={onSearch}
            onClose={onClose}
            selectedAdminName={selectedAdminName}
          />
        ) : (
          <Recommendmap />
        )}
      </div>
    </div>
  );
};

export default MapSidebar;
