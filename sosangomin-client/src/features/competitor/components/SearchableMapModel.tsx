// components/modal/SearchableMapModal.tsx
import React, { useState } from "react";
import SearchableMap from "@/components/modal/SearchableMap";

interface SearchableMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (location: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

const SearchableMapModal: React.FC<SearchableMapModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">경쟁사 매장 검색</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <p className="mb-2 text-sm text-gray-600">
            검색 후 리스트에서 매장을 선택하고 아래에서 '선택 완료'를 눌러주세요
          </p>
          <SearchableMap
            width="100%"
            height="300px"
            onSelectLocation={(location) => setSelectedLocation(location)} // ✅ 선택만
          />
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <div>
            {selectedLocation && (
              <div className="text-sm">
                <p className="font-bold">{selectedLocation.name}</p>
                <p className="text-gray-600">{selectedLocation.address}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={() => {
                if (selectedLocation) {
                  onComplete(selectedLocation); // ✅ 완료 시점에만 전달
                  onClose();
                }
              }}
              disabled={!selectedLocation}
              className="px-4 py-2 bg-bit-main text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              선택 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchableMapModal;
