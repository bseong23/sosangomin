import React from "react";
import { TabProps } from "@/features/map/types/map";
const PopulationTab: React.FC<TabProps> = ({ selectedAdminName }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">인구 분포 상세 정보</h3>
      <p>인구 통계 데이터를 표시하는 컴포넌트{selectedAdminName}</p>
    </div>
  );
};

export default PopulationTab;
