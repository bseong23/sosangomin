// 사용자 프로필 정보 응답 타입
export interface UserProfileResponse {
  userType: string;
  mail: string;
  name: string;
  userProfileUrl: string;
}

// 사용자 정보 타입 (컴포넌트에서 사용)
export interface UserProfileData {
  profileImage: string | null;
  nickname: string;
  mail: string;
  userType: string;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  status: string;
  errorMessage: string;
}

// 닉네임 변경 응답 타입
export type ChangeNameResponse = {} | ApiErrorResponse;

// 비밀번호 변경 응답 타입
export type ChangePasswordResponse = {} | ApiErrorResponse;

// 프로필 이미지 변경 요청 타입
export interface ProfileImageRequest {
  profileImg: File;
}

// FormData로 변환할 때 사용할 타입
export type ProfileImageFormData = FormData;

// 프로필 이미지 변경 응답 타입
export type ChangeProfileImageResponse =
  | {
      profileImgUrl: string; // 실제 API가 반환하는 이미지 URL 키
    }
  | ApiErrorResponse;
// 에러 메시지 상수
export enum ErrorMessages {
  NAME_DUPLICATE = "ERR_NAME_DUPLICATE",
  PROFILE_IMG_UPLOAD_FAIL = "ERR_INTERNAL_SERVER_PROFILE_IMG_UPLOAD_FAIL_ERROR"
}

// 커스텀 훅 반환 타입
export interface UseUserProfileReturn {
  userProfile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  changeNickname: (name: string) => Promise<boolean>;
  changePassword: (password: string) => Promise<boolean>;
  changeProfileImg: (imageFile: File) => Promise<boolean>;
  fetchUserProfile: () => Promise<void>; // 함수 추가
}
