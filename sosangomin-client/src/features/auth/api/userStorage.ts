import { LoginResponse } from "@/features/auth/types/auth";
import useAuthStore from "@/store/useAuthStore";

/**
 * 액세스 토큰과 사용자 정보를 저장합니다.
 * 액세스 토큰은 로컬스토리지에, 사용자 정보는 Zustand 스토어에 저장합니다.
 * @param accessToken 액세스 토큰
 * @param userData 사용자 정보 객체
 */
export const saveAuthData = (
  accessToken: string,
  userData: LoginResponse
): void => {
  // 액세스 토큰 로컬스토리지에 저장
  localStorage.setItem("accessToken", accessToken);

  // 사용자 정보 Zustand 스토어에 저장
  useAuthStore.getState().setUserInfo(userData);
};

/**
 * 액세스 토큰을 반환합니다.
 * @returns 액세스 토큰 또는 null
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

/**
 * 사용자가 로그인되어 있는지 확인합니다.
 * 액세스 토큰과 Zustand 스토어의 사용자 정보를 확인합니다.
 * @returns 로그인 여부
 */
export const isLoggedIn = (): boolean => {
  return !!getAccessToken() && !!useAuthStore.getState().userInfo;
};

/**
 * 로그아웃 처리 - 인증 관련 데이터 삭제
 * 로컬스토리지의 액세스 토큰과 Zustand 스토어의 사용자 정보를 제거합니다.
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("accessToken");
  useAuthStore.getState().clearUserInfo();
};

/**
 * 사용자 정보를 반환합니다.
 * Zustand 스토어에서 사용자 정보를 가져옵니다.
 * @returns 사용자 정보 객체 또는 null
 */
export const getUserInfo = (): LoginResponse | null => {
  return useAuthStore.getState().userInfo;
};
