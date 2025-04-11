import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreInfo } from "@/features/auth/types/mypage";

interface StoreState {
  representativeStore: StoreInfo | null;
  stores: StoreInfo[];
  setRepresentativeStore: (store: StoreInfo) => void;
  addStore: (store: StoreInfo) => void;
  resetStore: () => void; // 스토어 초기화 함수 추가
}

const initialState = {
  representativeStore: null,
  stores: []
};

const useStoreStore = create<StoreState>()(
  persist(
    (set) => ({
      ...initialState,
      setRepresentativeStore: (store) => set({ representativeStore: store }),
      addStore: (store) =>
        set((state) => ({ stores: [...state.stores, store] })),
      resetStore: () => set(initialState) // 초기 상태로 리셋
    }),
    {
      name: "store-storage"
    }
  )
);

export default useStoreStore;
