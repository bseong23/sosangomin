import React, { useState } from "react";
import { MapSidebarProps } from "@/types/map";

const Analysismap: React.FC<MapSidebarProps> = ({ onSearch }) => {
  const [searchAddress, setSearchAddress] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress.trim() && onSearch) {
      onSearch(searchAddress);
    }
  };

  return (
    <div className="p-6">
      {/* 헤더 섹션 */}
      <div className="mb-6 relative">
        <h2 className="text-xl font-bold">내 주변 상권은?</h2>
      </div>

      {/* 위치 찾기 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">위치 찾기</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10"
            placeholder="주소를 입력하세요"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <button
            type="submit"
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

      {/* 인구 분포도 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">인구 분포도</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-center mb-2">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-blue-400 to-pink-500 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white"></div>
            </div>
          </div>
          <div className="flex justify-center text-sm text-gray-600">
            <div className="mx-2 flex items-center">
              <span className="w-3 h-3 inline-block bg-blue-400 mr-1"></span>
              <span>10대</span>
            </div>
            <div className="mx-2 flex items-center">
              <span className="w-3 h-3 inline-block bg-pink-400 mr-1"></span>
              <span>20대</span>
            </div>
            <div className="mx-2 flex items-center">
              <span className="w-3 h-3 inline-block bg-purple-400 mr-1"></span>
              <span>30대</span>
            </div>
          </div>
        </div>
      </div>

      {/* 상권 분포도 섹션 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">상권 분포도</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">
            총 점포 수 <span className="font-bold text-blue-600">41개</span>
          </div>
          <div className="h-32">
            <div className="flex h-full items-end">
              <div className="bg-blue-400 w-1/6 h-[70%] mx-1"></div>
              <div className="bg-blue-400 w-1/6 h-[90%] mx-1"></div>
              <div className="bg-blue-400 w-1/6 h-[80%] mx-1"></div>
              <div className="bg-blue-400 w-1/6 h-[60%] mx-1"></div>
              <div className="bg-blue-400 w-1/6 h-[50%] mx-1"></div>
              <div className="bg-blue-400 w-1/6 h-[70%] mx-1"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>한식</span>
            <span>양식</span>
            <span>중식</span>
            <span>일식</span>
            <span>카페</span>
            <span>주점</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysismap;
