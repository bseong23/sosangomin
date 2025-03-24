import axiosInstance from "@/api/axios";
import axios from "axios";
import {
  SignupRequest,
  ApiResponse,
  ApiErrorResponse
} from "@/features/auth/types/auth";
import { clearAuthData } from "@/features/auth/api/userStorage";
import useAuthStore from "@/store/useAuthStore";

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
 * @param email 사용자 이메일
 * @param password 사용자 비밀번호
 */
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post("/api/user/login", null, {
      params: {
        mail: email,
        password
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
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
 * 이메일 중복 확인 API 호출
 * @param mail 확인할 이메일
 */
/**
 * 이메일 중복 확인 API 호출
 * @param mail 확인할 이메일
 * @returns 성공 시 빈 객체 {}, 실패 시 ApiErrorResponse
 */
export const checkEmailDuplicate = async (
  mail: string
): Promise<ApiResponse<{}>> => {
  try {
    const response = await axiosInstance.post("/api/user/email/check", null, {
      params: { mail }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("이메일 중복 확인 오류:", error);
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
    const response = await axiosInstance.post("/api/mail/verify", null, {
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
 * 비밀번호 재설정 링크 요청 API 호출
 * @param mail 이메일 주소
 */
export const requestPasswordResetLink = async (
  mail: string
): Promise<ApiResponse> => {
  try {
    const response = await axiosInstance.post("/api/mail/password", null, {
      params: { mail }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("비밀번호 재설정 링크 요청 오류:", error);
    throw error;
  }
};

/**
 * 임시 토큰으로 비밀번호 재설정 API 호출
 * @param token 임시 액세스 토큰
 * @param password 새 비밀번호
 */
export const resetPasswordWithToken = async (
  token: string,
  password: string
): Promise<ApiResponse> => {
  try {
    // 임시 토큰을 헤더에 추가한 새로운 axios 인스턴스 생성
    const tempAxiosInstance = axios.create({
      baseURL: axiosInstance.defaults.baseURL,
      timeout: axiosInstance.defaults.timeout,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const response = await tempAxiosInstance.put("/api/user/password", null, {
      params: { password }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("비밀번호 재설정 오류:", error);
    throw error;
  }
};

/**
 * 회원 탈퇴 API 호출
 * 토큰 삭제 및 Zustand 스토어 초기화도 함께 처리
 */
export const withdrawUser = async (): Promise<ApiResponse> => {
  try {
    // API 회원 탈퇴 요청
    const response = await axiosInstance.delete("/api/user");

    // 로컬 스토리지 토큰 및 사용자 정보 삭제
    clearAuthData();

    // Zustand 스토어 초기화
    const resetUserInfo = useAuthStore.getState().clearUserInfo;
    resetUserInfo();

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("회원 탈퇴 오류:", error);
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
