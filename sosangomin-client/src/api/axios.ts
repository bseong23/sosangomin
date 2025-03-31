// src/api/axios.ts
import axios, { AxiosError } from "axios";
import { getAccessToken, clearAuthData } from "@/features/auth/api/userStorage";
import useAuthStore from "@/store/useAuthStore";

// 기본 axios 인스턴스 생성
const API_URL = import.meta.env.VITE_API_SERVER_URL || "";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 유효하지 않은 토큰 처리
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     //     // if (error.response?.status === 401) {
//     //     //   // 로컬 스토리지 데이터 삭제
//     //     //   clearAuthData();

//     //     //   // Zustand 스토어 직접 접근
//     //     //   useAuthStore.getState().clearUserInfo();

//     //     //   // 로그인 페이지로 리다이렉트
//     //     //   window.location.href = "/login";
//     //     // }

//     if (error.code === "ERR_NETWORK" || !error.response) {
//       clearAuthData();

//       useAuthStore.getState().clearUserInfo();

//       window.location.href = "/login";

//       console.log("네트워크 에러 발생:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
