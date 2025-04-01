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
  selectedPaymentOption: string;
  selectedCategory: string;
  location: LocationInfo | null;
}

// 모달 상태 타입
interface StoreModalState {
  isOpen: boolean;
  currentStep: number;
  storeName: string;
  businessNumber: string;
  selectedPaymentOption: string;
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
  setSelectedPaymentOption: (payment: string) => void;
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
  selectedPaymentOption: "",

  openModal: () => set({ isOpen: true }),
  closeModal: () =>
    set({
      isOpen: false,
      currentStep: 1,
      storeName: "",
      businessNumber: "",
      selectedLocation: null,
      selectedPaymentOption: "",
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
  setSelectedPaymentOption: (payment) =>
    set({ selectedPaymentOption: payment }),
  saveStoreData: () => {
    const {
      storeName,
      businessNumber,
      selectedCategory,
      selectedPaymentOption,
      selectedLocation
    } = get();
    if (
      !storeName ||
      !businessNumber ||
      !selectedCategory ||
      !selectedPaymentOption ||
      !selectedLocation
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const storeData: StoreData = {
      name: storeName,
      businessNumber,
      selectedPaymentOption,
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
      selectedPaymentOption: "",
      selectedLocation: null,
      selectedCategory: "",
      storeData: null
    })
}));

export default useStoreModalStore;
