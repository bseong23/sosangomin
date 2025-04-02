// src/features/auth/components/mypage/StoreList.tsx
import React, { useEffect, useState } from "react";
import { StoreListResponse, StoreInfo } from "@/features/auth/types/mypage";
import Store from "@/features/auth/components/mypage/Storeitem";
import useStoreStore from "@/store/storeStore";
import { getStoreList } from "@/features/auth/api/mypageApi";

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

  // 대표 가게 설정 핸들러
  const handleSetRepresentative = (store: StoreInfo) => {
    setRepresentativeStore(store);
    alert(`${store.store_name}이(가) 대표 가게로 설정되었습니다.`);
  };

  if (!storeListData) {
    return <div className="text-center py-8">데이터를 불러오는 중...</div>;
  }

  if (storeListData.stores.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{storeListData.message}</p>
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
            key={store.business_number}
            store={store}
            isRepresentative={
              representativeStore?.business_number === store.business_number
            }
            onSetRepresentative={() => handleSetRepresentative(store)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
