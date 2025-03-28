import React, { useState } from "react";
import { ReportData } from "../types";

interface HeaderComponentProps {
  data: ReportData;
}

// 가게 종류 목록 (예시)
const storeTypes = [
  "명태조림 전문점",
  "한식당",
  "일식당",
  "중식당",
  "양식당",
  "카페",
  "베이커리",
  "분식점"
];

const HeaderComponent: React.FC<HeaderComponentProps> = ({ data }) => {
  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(data.store_name);

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // 가게 종류 선택 핸들러
  const handleStoreSelect = (store: string) => {
    setSelectedStore(store);
    setIsDropdownOpen(false);
    // 여기에 선택된 가게 종류에 따른 데이터 로드 로직을 추가할 수 있습니다
  };

  return (
    <div className="bg-white rounded-lg mb-6 p-4">
      <div className="flex justify-between items-center flex-wrap">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="relative mb-2 sm:mb-0 sm:mr-3">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full sm:w-64 px-4 py-2 text-indigo-600 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="text-lg font-semibold">{selectedStore}</span>
              <svg
                className={`w-5 h-5 ml-2 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 max-h-60 overflow-auto">
                  {storeTypes.map((store, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 text-sm hover:bg-indigo-50 cursor-pointer ${
                        store === selectedStore
                          ? "bg-indigo-100 font-medium"
                          : ""
                      }`}
                      onClick={() => handleStoreSelect(store)}
                    >
                      {store}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <h1 className="text-xl font-bold text-gray-800">종합 분석 보고서</h1>
        </div>

        <div className="text-right mt-2 sm:mt-0">
          <p className="text-gray-600 font-medium">
            작성일: {formatDate(data.created_at.$date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
