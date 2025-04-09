import React, { useState } from "react";
import { StoreProps } from "@/features/auth/types/mypage";

const Store: React.FC<StoreProps> = ({
  store,
  isRepresentative = false,
  onSetRepresentative,
  onDeleteStore
}) => {
  const [, setIsDeleting] = useState(false);
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
    <div className="border rounded-lg shadow-md overflow-hidden">
      {/* 상단 헤더 */}
      <div className="bg-bit-main text-white flex justify-between items-center px-4 py-2 rounded-t-lg">
        <h3 className="text-lg font-semibold">{store.store_name}</h3>
        <button
          onClick={handleDeleteClick}
          className="text-white font-bold text-xl hover:text-gray-300"
        >
          ×
        </button>
      </div>

      {/* 본문 내용 */}
      <div className="p-6">
        {/* 사업자등록 번호 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">사업자등록 번호</h4>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {store.business_number}
          </p>
        </div>

        {/* 업종 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">업종</h4>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {store.category}
          </p>
        </div>

        {/* 결제 타입 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700">포스 타입</h4>
          <p className="text-base font-semibold text-gray-900 mt-1">
            {store.pos_type}
          </p>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="flex justify-end items-center bg-gray-100 px-4 py-3">
        {isMainStore ? (
          <span className="bg-bit-main text-white px-3 py-2 rounded-md font-bold">
            대표가게
          </span>
        ) : (
          <button
            onClick={() => onSetRepresentative && onSetRepresentative(store)}
            className="bg-blue-900 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            대표 가게로 설정
          </button>
        )}
      </div>
    </div>
  );
};

export default Store;
