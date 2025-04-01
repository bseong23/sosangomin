import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreInfo } from "@/features/auth/types/mypage";

interface StoreState {
  representativeStore: StoreInfo | null;
  stores: StoreInfo[];
  setRepresentativeStore: (store: StoreInfo) => void;
  addStore: (store: StoreInfo) => void;
}

const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      representativeStore: null,
      stores: [
        // 기존 더미 데이터
      ],
      setRepresentativeStore: (store) => set({ representativeStore: store }),
      addStore: (store) =>
        set((state) => ({ stores: [...state.stores, store] }))
    }),
    {
      name: "store-storage" // localStorage에 저장될 키 이름
    }
  )
);

export default useStoreStore;
