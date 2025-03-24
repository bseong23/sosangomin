// src/api/axios.ts
import axios from "axios";
import { getAccessToken } from "@/features/auth/api/userStorage";

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

export default axiosInstance;
