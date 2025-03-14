import React from "react";
import { MapSidebarProps } from "@/features/map/types/map";

const Analysismap: React.FC<MapSidebarProps> = () => {
  return (
    <div className="p-6">
      {/* 헤더 섹션 */}
      <div className="mb-6 relative">
        <h2 className="text-xl font-bold">내 주변 상권은?</h2>
      </div>

      {/* 인구 분포도 섹션 */}
      <div className="mb-6 h-[200px]">
        <h3 className="text-lg font-semibold mb-2">인구 분포도</h3>
      </div>

      {/* 상권 분포도 섹션 */}
      <div className="mb-6 h-[200px]">
        <h3 className="text-lg font-semibold mb-2">상권 분포도</h3>
      </div>
    </div>
  );
};

export default Analysismap;
