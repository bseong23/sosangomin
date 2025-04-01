import React, { useState, useEffect } from "react";
import { AnalysisModalProps } from "@/features/map/types/map";
import { createPortal } from "react-dom";

// 탭별 컴포넌트 import
import PopulationTab from "@/features/map/components/maps/PopulationTab ";
import BusinessTab from "@/features/map/components/maps/BusinessTab ";
import EtcTab from "@/features/map/components/maps/EtcTab ";
const dummyPopulationData = {
  resident_pop: {
    성별_연령별_상주인구: {
      male_10: 150,
      male_20: 1200,
      male_30: 1000,
      male_40: 900,
      male_50: 800,
      male_60: 600,
      female_10: 160,
      female_20: 1300,
      female_30: 1100,
      female_40: 950,
      female_50: 850,
      female_60: 650
    },
    총_상주인구: 10960,
    서울시_평균_상주인구: 9875.3,
    가장_많은_성별_연령대: { 구분: "여성 20대", 인구수: 1300 }
  },
  working_pop: {
    성별_연령별_직장인구: {
      male_10: 30,
      male_20: 500,
      male_30: 800,
      male_40: 900,
      male_50: 600,
      male_60: 200,
      female_10: 25,
      female_20: 550,
      female_30: 850,
      female_40: 700,
      female_50: 500,
      female_60: 180
    },
    총_직장인구: 5835,
    서울시_평균_직장인구: 5240.1,
    가장_많은_성별_연령대: { 구분: "여성 20대", 인구수: 850 }
  },
  floating_pop: {
    성별_연령별_유동인구: {
      male_10: 300,
      male_20: 1100,
      male_30: 950,
      male_40: 800,
      male_50: 650,
      male_60: 400,
      female_10: 350,
      female_20: 1150,
      female_30: 980,
      female_40: 820,
      female_50: 700,
      female_60: 420
    },
    총_유동인구: 9620,
    서울시_평균_유동인구: 9102.4,
    가장_많은_성별_연령대: { 구분: "여성 20대", 인구수: 1150 },
    요일별_유동인구: {
      monday: 1100,
      tuesday: 1150,
      wednesday: 1200,
      thursday: 1180,
      friday: 1300,
      saturday: 1700,
      sunday: 1690
    },
    가장_많은_요일: "saturday",
    가장_적은_요일: "monday",
    평일_평균_유동인구: 1186.0,
    주말_평균_유동인구: 1695.0,
    시간대별_유동인구: {
      심야: 400,
      이른아침: 800,
      오전: 1100,
      오후: 1300,
      퇴근시간: 1450,
      저녁: 1500,
      밤: 1200
    },
    가장_많은_시간대: "저녁",
    가장_적은_시간대: "심야"
  }
};

const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  selectedAdminName
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
            populationData={dummyPopulationData}
          />
        );
      case "업종":
        return <BusinessTab selectedAdminName={selectedAdminName} />;
      case "매출":
        return <EtcTab selectedAdminName={selectedAdminName} />;
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

            {/* 탭 버튼 */}
            <div className="flex gap-2">
              {(["인구", "업종", "매출"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg ${
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
