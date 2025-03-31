import React from "react";
import { TabProps } from "@/features/map/types/map";
const EtcTab: React.FC<TabProps> = ({ selectedAdminName }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">기타 정보</h3>
      <p>기타 관련 데이터를 표시하는 컴포넌트 {selectedAdminName}</p>
    </div>
  );
};

export default EtcTab;
