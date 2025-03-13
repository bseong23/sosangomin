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
