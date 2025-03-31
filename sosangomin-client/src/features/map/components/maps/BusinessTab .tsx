import React from "react";
import { TabProps } from "@/features/map/types/map";
const BusinessTab: React.FC<TabProps> = ({ selectedAdminName }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">상권 분석 정보</h3>
      <p>상권 분석 데이터를 표시하는 컴포넌트 {selectedAdminName}</p>
    </div>
  );
};

export default BusinessTab;
