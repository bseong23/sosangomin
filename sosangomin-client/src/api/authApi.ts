import axiosInstance from "./axios";
import axios from "axios";
import { SignupRequest, ApiResponse, ApiErrorResponse } from "@/types/auth";

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
export const logout = async (): Promise<ApiResponse> => {
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
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse> => {
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
export const getUserProfile = async (): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.get("/api/v1/users/me");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    throw error;
  }
};

/**
 * 회원가입 API 호출
 */
export const signup = async (data: SignupRequest): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post("/api/user", null, {
      params: {
        mail: data.mail,
        name: data.name,
        password: data.password
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("회원가입 오류:", error);
    throw error;
  }
};

/**
 * 닉네임 중복 확인 API 호출
 */
export const checkNameDuplicate = async (
  name: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post("/api/user/name/check", null, {
      params: { name }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("닉네임 중복 확인 오류:", error);
    throw error;
  }
};

/**
 * 이메일 인증 요청 API 호출
 */
export const sendVerificationMail = async (
  mail: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post("/api/mail", null, {
      params: { mail }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("이메일 인증 요청 오류:", error);
    throw error;
  }
};

/**
 * 이메일 인증번호 확인 API 호출
 */
export const verifyMailCode = async (
  mail: string,
  userNumber: number
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post("/api/mail/check", null, {
      params: { mail, userNumber }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("이메일 인증번호 확인 오류:", error);
    throw error;
  }
};

/**
 * API 응답이 에러인지 확인하는 함수
 */
export const isApiError = (
  response: ApiResponse
): response is ApiErrorResponse => {
  return (response as ApiErrorResponse).status !== undefined;
};
