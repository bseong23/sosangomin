import React, { useState } from "react";
import { StoreProps } from "@/features/auth/types/mypage";

const Store: React.FC<StoreProps> = ({
  store,
  isRepresentative = false,
  onSetRepresentative,
  onDeleteStore
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isMainStore = isRepresentative || store.is_main === true;

  // 삭제 확인 핸들러 - 대표 가게 삭제 경고 추가
  const handleDeleteClick = () => {
    let confirmMessage = `"${store.store_name}" 가게를 정말 삭제하시겠습니까?`;

    // 대표 가게인 경우 추가 경고 메시지
    if (isMainStore) {
      confirmMessage = `"${store.store_name}"은(는) 대표 가게입니다. 삭제하면 다른 가게를 대표 가게로 지정해야 합니다. 정말 삭제하시겠습니까?`;
    }

    if (window.confirm(confirmMessage)) {
      setIsDeleting(true);
      onDeleteStore && onDeleteStore(store);
    }
  };

  return (
    <div
      className={`border rounded-lg shadow-sm overflow-hidden ${
        isMainStore ? "border-blue-500" : "border-gray-200"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-base font-medium text-gray-700">상호</h3>
            <p className="text-sm mt-1 text-gray-900">{store.store_name}</p>
          </div>

          <div className="flex gap-2">
            {isMainStore ? (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded">
                대표 가게
              </span>
            ) : (
              <button
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium px-3 py-1 rounded transition-colors"
                onClick={() =>
                  onSetRepresentative && onSetRepresentative(store)
                }
              >
                대표 가게로 설정
              </button>
            )}

            {/* 모든 가게 삭제 가능하게 수정 */}
            <button
              className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                isDeleting
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
              onClick={handleDeleteClick}
              disabled={isDeleting} // 삭제 중일 때만 비활성화
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
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
