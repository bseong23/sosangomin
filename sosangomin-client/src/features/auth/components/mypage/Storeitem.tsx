// src/features/auth/components/mypage/Storeitem.tsx
import React from "react";
import { StoreProps } from "@/features/auth/types/mypage";

const Store: React.FC<StoreProps> = ({
  store,
  isRepresentative = false,
  onSetRepresentative
}) => {
  return (
    <div
      className={`border rounded-lg shadow-sm overflow-hidden ${
        isRepresentative ? "border-blue-500" : "border-gray-200"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-base font-medium text-gray-700">상호</h3>
            <p className="text-sm mt-1 text-gray-900">{store.store_name}</p>
          </div>

          {isRepresentative ? (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded">
              대표 가게
            </span>
          ) : (
            <button
              className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium px-3 py-1 rounded transition-colors"
              onClick={() => onSetRepresentative && onSetRepresentative(store)}
            >
              대표 가게로 설정
            </button>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-base font-medium text-gray-700">
            사업자등록 번호
          </h3>
          <p className="text-sm mt-1 text-gray-900">{store.business_number}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-medium text-gray-700">카테고리</h3>
          <p className="text-sm mt-1 text-gray-900">{store.category}</p>
        </div>

        <div className="mt-4">
          <h3 className="text-base font-medium text-gray-700">결제 타입</h3>
          <p className="text-sm mt-1 text-gray-900">{store.pos_type}</p>
        </div>
      </div>
    </div>
  );
};

export default Store;
