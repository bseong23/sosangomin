// src/api/authApi.ts
import axiosInstance from "./axios";

/**
 * 카카오 로그인 URL을 반환합니다.
 */
export const getKakaoAuthUrl = (): string => {
  const API_URL = import.meta.env.VITE_API_SERVER_URL || "";
  return `${API_URL}/api/v1/auth/kakao`;
};

/**
 * 로그아웃 API 호출
 */
export const logout = async () => {
  try {
    // 이미 axios 인스턴스에서 토큰을 헤더에 추가함
    const response = await axiosInstance.post("/api/v1/auth/logout");
    return response.data;
  } catch (error) {
    console.error("로그아웃 오류:", error);
    throw error;
  }
};

/**
 * 일반 로그인 API 호출
 */
export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/api/v1/auth/login", {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error("로그인 오류:", error);
    throw error;
  }
};

/**
 * 사용자 정보 조회 API 호출
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/users/me");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    throw error;
  }
};
