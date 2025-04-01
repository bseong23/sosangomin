import { create } from "zustand";

// 위치 정보 타입
interface LocationInfo {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

// 가게 정보 타입
interface StoreData {
  name: string;
  businessNumber: string;
  selectedCategory: string;
  location: LocationInfo | null;
}

// 모달 상태 타입
interface StoreModalState {
  isOpen: boolean;
  currentStep: number;
  storeName: string;
  businessNumber: string;
  selectedLocation: LocationInfo | null;
  selectedCategory: string;
  storeData: StoreData | null;

  // 액션
  openModal: () => void;
  closeModal: () => void;
  setCurrentStep: (step: number) => void;
  setStoreName: (name: string) => void;
  setBusinessNumber: (number: string) => void;
  setSelectedLocation: (location: LocationInfo) => void;
  setSelectedCategory: (category: string) => void;
  saveStoreData: () => void;
  resetModalData: () => void;
}

const useStoreModalStore = create<StoreModalState>((set, get) => ({
  isOpen: false,
  currentStep: 1,
  storeName: "",
  businessNumber: "",
  selectedLocation: null,
  selectedCategory: "",
  storeData: null,

  openModal: () => set({ isOpen: true }),
  closeModal: () =>
    set({
      isOpen: false,
      currentStep: 1,
      storeName: "",
      businessNumber: "",
      selectedLocation: null,
      selectedCategory: "",
      storeData: null
    }),

  setCurrentStep: (step) => set({ currentStep: step }),
  setStoreName: (name) => set({ storeName: name }),
  setBusinessNumber: (number) => set({ businessNumber: number }),
  setSelectedLocation: (location) =>
    set(() => ({
      selectedLocation: location,
      storeName: location.name
    })),
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  saveStoreData: () => {
    const { storeName, businessNumber, selectedCategory, selectedLocation } =
      get();
    if (
      !storeName ||
      !businessNumber ||
      !selectedCategory ||
      !selectedLocation
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const storeData: StoreData = {
      name: storeName,
      businessNumber,
      selectedCategory,
      location: selectedLocation
    };

    set({ storeData });
    console.log("저장된 가게 정보:", storeData);
  },

  resetModalData: () =>
    set({
      currentStep: 1,
      storeName: "",
      businessNumber: "",
      selectedLocation: null,
      selectedCategory: "",
      storeData: null
    })
}));

// ✅ 개발용으로 window에 저장 (프로덕션에서는 제거해야 함)
if (typeof window !== "undefined") {
  (window as any).useStoreModalStore = useStoreModalStore;
}

export default useStoreModalStore;
