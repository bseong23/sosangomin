import React, { useState } from "react";
import { MapSidebarProps } from "@/features/map/types/map";
import Analysismap from "@/features/map/components/maps/Analysismap";
import Recommendmap from "@/features/map/components/maps/Recommendmap";
import ToggleSwitch from "@/features/map/components/maps/ToggleSwitch";

const MapSidebar: React.FC<MapSidebarProps> = ({ onSearch, onClose }) => {
  const [activeTab, setActiveTab] = useState<"상권분석" | "입지추천">(
    "상권분석"
  );

  const handleTabChange = (selected: string) => {
    setActiveTab(selected as "상권분석" | "입지추천");
  };

  return (
    <div className="absolute top-[30px] left-[20px] h-[90%] w-[350px] bg-white shadow-lg rounded-lg overflow-y-auto z-10 font-inter">
      <div className="p-4">
        <ToggleSwitch
          options={["상권분석", "입지추천"]}
          defaultSelected="상권분석"
          onChange={handleTabChange}
        />
      </div>

      {activeTab === "상권분석" ? (
        <Analysismap onSearch={onSearch} onClose={onClose} />
      ) : (
        <Recommendmap />
      )}
    </div>
  );
};

export default MapSidebar;
