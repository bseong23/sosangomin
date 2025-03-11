import React from "react";
import { MapSidebarProps } from "@/types/map";
import Analysismap from "@/components/maps/Analysismap";
import ToggleSwitch from "@/components/maps/ToggleSwitch";

const MapSidebar: React.FC<MapSidebarProps> = ({ onSearch }) => {
  return (
    <div className="absolute top-[30px] left-[20px] h-[90%] w-[350px] bg-white shadow-lg rounded-lg overflow-y-auto z-10">
      <ToggleSwitch
        options={["상권분석", "입지추천"]}
        defaultSelected="상권분석"
        onChange={(selected) => {
          console.log(selected); // 선택된 옵션에 따라 다른 컴포넌트 렌더링 등의 로직
        }}
      />
      <Analysismap onSearch={onSearch} />
    </div>
  );
};

export default MapSidebar;
