import axiosInstance from "@/api/axios";
import axios from "axios";
import {
  UserProfileResponse,
  ApiErrorResponse,
  ChangeNameResponse,
  ChangePasswordResponse,
  ChangeProfileImageResponse
} from "@/features/auth/types/user";

/**
 * 사용자 정보를 가져오는 API 함수
 */
export const getUserInfo = async (): Promise<UserProfileResponse> => {
  try {
    const response = await axiosInstance.get("/api/user");
    return response.data;
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    throw error;
  }
};

/**
 * 사용자 닉네임 변경 API 함수
 * @param name 새 닉네임
 */
export const changeName = async (name: string): Promise<ChangeNameResponse> => {
  try {
    const response = await axiosInstance.patch("/api/user/name", null, {
      params: { name }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("닉네임 변경 실패:", error);
    throw error;
  }
};

/**
 * 사용자 비밀번호 변경 API 함수
 * @param password 새 비밀번호
 */
export const changePassword = async (
  password: string
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axiosInstance.patch("/api/user/password", null, {
      params: { password }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("비밀번호 변경 실패:", error);
    throw error;
  }
};

/**
 * 사용자 프로필 이미지 변경 API 함수
 * @param imageFile 새 프로필 이미지 파일
 */
export const changeProfileImage = async (
  imageFile: File
): Promise<ChangeProfileImageResponse> => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    formData.append("profileImg", imageFile);

    // multipart/form-data로 전송
    const response = await axiosInstance.patch(
      "/api/user/profile_img",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiErrorResponse;
    }
    console.error("프로필 이미지 변경 실패:", error);
    throw error;
  }
};

/**
 * API 응답이 에러인지 확인하는 함수
 */
export const isApiError = (response: any): response is ApiErrorResponse => {
  return response && (response as ApiErrorResponse).status !== undefined;
};
