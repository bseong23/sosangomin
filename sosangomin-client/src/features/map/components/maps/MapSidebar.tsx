import React, { useState } from "react";
import { MapSidebarProps } from "@/features/map/types/map";
import Analysismap from "@/features/map/components/maps/Analysismap";
import Recommendmap from "@/features/map/components/maps/Recommendmap";
import ToggleSwitch from "@/features/map/components/maps/ToggleSwitch";

const MapSidebar: React.FC<MapSidebarProps> = ({ onSearch, onClose }) => {
  const [activeTab, setActiveTab] = useState<"상권분석" | "입지추천">(
    "상권분석"
  );

  const [searchAddress, setSearchAddress] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    if (searchAddress.trim() && onSearch) {
      onSearch(searchAddress);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 엔터 키 기본 동작 방지
      if (searchAddress.trim() && onSearch) {
        onSearch(searchAddress);
      }
    }
  };

  const handleTabChange = (selected: string) => {
    setActiveTab(selected as "상권분석" | "입지추천");
  };

  return (
    <div className="absolute max-md:left-1/2 max-md:top-1/2 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:w-[90%] max-md:h-[80%] md:top-9 md:left-8 md:h-[90%] md:w-88 bg-white shadow-lg rounded-lg z-20 font-inter">
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

      {/* 위치 찾기 섹션 */}
      <div className="pt-2 px-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10"
            placeholder="주소를 입력하세요"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="#4B5563"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
      <div className="p-4">
        <ToggleSwitch
          options={["상권분석", "입지추천"]}
          defaultSelected="상권분석"
          onChange={handleTabChange}
        />
      </div>

      <div className="h-[calc(100%-150px)] overflow-y-auto">
        {activeTab === "상권분석" ? (
          <Analysismap onSearch={onSearch} onClose={onClose} />
        ) : (
          <Recommendmap />
        )}
      </div>
    </div>
  );
};

export default MapSidebar;
