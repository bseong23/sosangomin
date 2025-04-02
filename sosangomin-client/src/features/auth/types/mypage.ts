// src/features/auth/types/mypage.ts
export interface StoreListResponse {
  status: string;
  message: string;
  stores: StoreInfo[];
}

export interface StoreInfo {
  store_id: string;
  store_name: string;
  business_number: string;
  category: string;
  pos_type: string;
  place_id: string;
}

export interface StoreProps {
  store: StoreInfo;
  isRepresentative?: boolean;
  onSelect?: (storeId: string) => void;
  onSetRepresentative?: (store: StoreInfo) => void;
}

export interface StoreListProps {
  onAddStore?: () => void;
}
