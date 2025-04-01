// src/features/analysis/components/dashboard/StrategySection.tsx
import React from "react";

const StrategySection: React.FC = () => {
  return (
    <div className="w-full lg:w-1/2 bg-basic-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        영업 전략 제안
      </h2>
      <div className="p-4 bg-blue-50 rounded-lg">
        <ul className="space-y-3">
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 bg-bit-main rounded-full flex items-center justify-center text-basic-white font-bold mr-2 mt-0.5">
              1
            </div>
            <p className="text-sm text-comment">
              주말(토,일) 매출 강세를 활용한 주말 특별 메뉴나 이벤트 기획을
              고려해보세요.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 bg-bit-main rounded-full flex items-center justify-center text-basic-white font-bold mr-2 mt-0.5">
              2
            </div>
            <p className="text-sm text-comment">
              저녁 시간대(특히 19시) 매출이 가장 높으므로, 저녁 시간 서비스 품질
              향상과 메뉴 다양화에 집중하세요.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 bg-bit-main rounded-full flex items-center justify-center text-basic-white font-bold mr-2 mt-0.5">
              3
            </div>
            <p className="text-sm text-comment">
              화요일 매출 증대를 위한 '화요일 특가' 프로모션이나 마케팅 활동을
              고려해보세요.
            </p>
          </li>
          <li className="flex items-start">
            <div className="flex-shrink-0 w-5 h-5 bg-bit-main rounded-full flex items-center justify-center text-basic-white font-bold mr-2 mt-0.5">
              4
            </div>
            <p className="text-sm text-comment">
              매출이 낮은 오후 시간대(특히 15-16시)에 특별 할인이나 세트 메뉴를
              도입해보세요.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StrategySection;
