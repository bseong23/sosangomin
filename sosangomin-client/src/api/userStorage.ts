// src/api/userStorage.ts

// 사용자 정보 타입
export interface UserInfo {
  userId?: string;
  userName?: string;
  userProfileUrl?: string;
  isFirstLogin?: boolean;
  // 필요한 다른 사용자 정보 필드 추가
}

/**
 * 로컬 스토리지에서 사용자 정보 가져오기
 */
export const getUserInfo = (): UserInfo | null => {
  try {
    const userInfoStr = localStorage.getItem("userInfo");
    if (!userInfoStr) return null;
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error("사용자 정보 파싱 오류:", error);
    return null;
  }
};

/**
 * 로컬 스토리지에 사용자 정보 저장
 */
export const saveUserInfo = (userInfo: UserInfo): void => {
  try {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  } catch (error) {
    console.error("사용자 정보 저장 오류:", error);
  }
};

/**
 * 로컬 스토리지에 액세스 토큰 저장
 */
export const saveAccessToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

/**
 * 로컬 스토리지에서 액세스 토큰 가져오기
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

/**
 * 사용자 정보 및 토큰 모두 저장 (로그인 성공 시)
 */
export const saveAuthData = (accessToken: string, userInfo: UserInfo): void => {
  // 액세스 토큰 저장
  saveAccessToken(accessToken);

  // 사용자 정보 저장
  saveUserInfo(userInfo);
};

/**
 * 로컬 스토리지에서 사용자 정보 및 토큰 삭제 (로그아웃 시)
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("accessToken");
};

/**
 * 사용자 로그인 여부 확인
 */
export const isUserLoggedIn = (): boolean => {
  return !!getAccessToken();
};
