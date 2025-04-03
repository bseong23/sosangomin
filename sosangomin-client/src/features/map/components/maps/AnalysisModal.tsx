import React, { useState, useEffect } from "react";
import { AnalysisModalProps } from "@/features/map/types/map";
import { createPortal } from "react-dom";

// 탭별 컴포넌트 import
import PopulationTab from "@/features/map/components/maps/PopulationTab ";
import BusinessTab from "@/features/map/components/maps/BusinessTab ";
import SalesTab from "@/features/map/components/maps/SalesTab ";

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  selectedAdminName,
  selectedCategory
}) => {
  const [activeTab, setActiveTab] = useState<"인구" | "업종" | "매출">("인구");

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // 현재 활성화된 탭에 따라 다른 컴포넌트를 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case "인구":
        return (
          <PopulationTab
            selectedAdminName={selectedAdminName}
            selectedCategory={selectedCategory}
          />
        );
      case "업종":
        return (
          <BusinessTab
            selectedAdminName={selectedAdminName}
            selectedCategory={selectedCategory}
          />
        );
      case "매출":
        return (
          <SalesTab
            selectedAdminName={selectedAdminName}
            selectedCategory={selectedCategory}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      {/* 모달 컨테이너 */}
      <div className="bg-white h-[80%] w-[90%] mx-auto rounded-lg shadow-xl overflow-hidden">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          {/* 선택된 지역 이름 */}
          <div className="flex items-center gap-4">
            <p className="font-medium">{selectedAdminName}</p>
            <p className="font-medium">{selectedCategory}</p>
            {/* 탭 버튼 */}
            <div className="flex gap-2">
              {(["인구", "업종", "매출"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-1 md:px-4 md:py-2 rounded-lg ${
                    activeTab === tab
                      ? "bg-bit-main text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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
        </div>

        {/* 모달 본문 */}
        <div className="px-6 py-4 h-[calc(100%-80px)] overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AnalysisModal;
