// src/features/auth/components/mypage/StoreList.tsx
import React, { useEffect, useState } from "react";
import { StoreListResponse } from "@/features/auth/types/mypage";
import Store from "@/features/auth/components/mypage/Storeitem";
import useStoreStore from "@/store/storeStore";
import { getStoreList } from "@/features/auth/api/mypageApi";

// onAddStore를 선택적 속성으로 변경
const StoreList: React.FC = () => {
  const [storeListData, setStoreListData] = useState<StoreListResponse | null>(
    null
  );
  const { representativeStore, setRepresentativeStore } = useStoreStore();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await getStoreList();
        setStoreListData(response);

        if (
          response.status === "success" &&
          response.stores.length > 0 &&
          !representativeStore
        ) {
          setRepresentativeStore(response.stores[0]);
        }
      } catch (error) {
        console.error("가게 목록 불러오기 실패:", error);
      }
    };

    fetchStores();
  }, [representativeStore, setRepresentativeStore]);

  if (!storeListData) {
    return <div className="text-center py-8">데이터를 불러오는 중...</div>;
  }

  if (storeListData.stores.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{storeListData.message}</p>
        {/* 등록하기 버튼 제거 */}
      </div>
    );
  }

  return (
    <div className="mt-6">
      {representativeStore && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">대표 가게</h3>
          <Store store={representativeStore} isRepresentative={true} />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-3">모든 가게</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {storeListData.stores.map((store) => (
          <Store
            key={store.store_id}
            store={store}
            isRepresentative={representativeStore?.store_id === store.store_id}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
