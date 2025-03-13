import { LoginResponse } from "@/features/auth/types/auth";

/**
 * 액세스 토큰과 사용자 정보를 저장합니다.
 * @param accessToken 액세스 토큰
 * @param userData 사용자 정보 객체
 */
export const saveAuthData = (
  accessToken: string,
  userData: LoginResponse
): void => {
  // 액세스 토큰 저장
  localStorage.setItem("accessToken", accessToken);

  // 사용자 정보를 JSON 문자열로 변환하여 저장
  localStorage.setItem("userInfo", JSON.stringify(userData));

  console.log("인증 정보 저장 완료:", { accessToken, userData });
};

/**
 * 사용자 정보를 반환합니다.
 * @returns 사용자 정보 객체 또는 null
 */
export const getUserInfo = (): LoginResponse | null => {
  const userInfoStr = localStorage.getItem("userInfo");
  if (!userInfoStr) return null;

  try {
    return JSON.parse(userInfoStr) as LoginResponse;
  } catch (error) {
    console.error("사용자 정보 파싱 오류:", error);
    return null;
  }
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
 * @returns 로그인 여부
 */
export const isLoggedIn = (): boolean => {
  return !!getAccessToken() && !!getUserInfo();
};

/**
 * 로그아웃 처리 - 인증 관련 데이터 삭제
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
  console.log("로그아웃: 인증 정보 삭제 완료");
};
