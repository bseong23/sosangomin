// useStoreModalStore.ts
import { create } from "zustand";

// 위치 정보 타입
interface LocationInfo {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

// 모달 상태 타입
interface StoreModalState {
  // 상태
  isOpen: boolean;
  currentStep: number;
  storeName: string;
  businessNumber: string;
  storeDescription: string;
  selectedLocation: LocationInfo | null;

  // 액션
  openModal: () => void;
  closeModal: () => void;
  setCurrentStep: (step: number) => void;
  setStoreName: (name: string) => void;
  setBusinessNumber: (number: string) => void;
  setStoreDescription: (description: string) => void;
  setSelectedLocation: (location: LocationInfo) => void;
  resetModalData: () => void;
}

// 스토어 생성
const useStoreModalStore = create<StoreModalState>((set) => ({
  // 초기 상태
  isOpen: false,
  currentStep: 1,
  storeName: "",
  businessNumber: "",
  storeDescription: "",
  selectedLocation: null,

  // 액션 함수들
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setStoreName: (name) => set({ storeName: name }),
  setBusinessNumber: (number) => set({ businessNumber: number }),
  setStoreDescription: (description) => set({ storeDescription: description }),
  setSelectedLocation: (location) =>
    set(() => ({
      selectedLocation: location,
      // 위치 이름을 가게 이름으로 자동 설정 (기존 로직 유지)
      storeName: location.name
    })),
  resetModalData: () =>
    set({
      currentStep: 1,
      storeName: "",
      businessNumber: "",
      storeDescription: "",
      selectedLocation: null
    })
}));

export default useStoreModalStore;
