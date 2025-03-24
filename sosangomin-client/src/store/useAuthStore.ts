import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse } from "@/features/auth/types/auth";

// 인증 스토어 상태 타입
interface AuthState {
  userInfo: LoginResponse | null;
  isAuthenticated: boolean;
  // 상태 변경 함수들
  setUserInfo: (userInfo: LoginResponse) => void;
  updateUserInfo: (updates: Partial<LoginResponse>) => void;
  clearUserInfo: () => void;
}

// Zustand 스토어 생성
const useAuthStore = create<AuthState>()(
  // persist 미들웨어로 로컬스토리지 지속성 추가
  persist(
    (set) => ({
      userInfo: null,
      isAuthenticated: false,

      // 사용자 정보 설정
      setUserInfo: (userInfo) => set({ userInfo, isAuthenticated: true }),

      // 사용자 정보 업데이트
      updateUserInfo: (updates) =>
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...updates } : null
        })),

      // 사용자 정보 제거 (로그아웃)
      clearUserInfo: () => set({ userInfo: null, isAuthenticated: false })
    }),
    {
      name: "auth-storage", // 로컬스토리지에 저장될 키 이름
      partialize: (state) => ({ userInfo: state.userInfo }) // 저장할 부분 상태 선택
    }
  )
);

export default useAuthStore;
