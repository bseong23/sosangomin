// src/features/auth/types/mypage.ts
export interface StoreListResponse {
  status: string;
  message: string;
  stores: StoreInfo[];
}

export interface StoreInfo {
  store_id: string;
  is_main: boolean;
  store_name: string;
  business_number: string;
  category: string;
  pos_type: string;
  place_id: string;
  analysis_id: string;
}

// src/features/auth/types/mypage.ts에 추가
export interface StoreProps {
  store: StoreInfo;
  isRepresentative?: boolean;
  onSelect?: (storeId: string) => void;
  onSetRepresentative?: (store: StoreInfo) => void;
  onDeleteStore?: (store: StoreInfo) => void; // 삭제 핸들러 추가
}

export interface StoreListProps {
  onAddStore?: () => void;
}
