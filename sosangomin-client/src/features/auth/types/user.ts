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

// 에러 메시지 상수
export enum ErrorMessages {
  NAME_DUPLICATE = "ERR_NAME_DUPLICATE"
}

// 커스텀 훅 반환 타입
export interface UseUserProfileReturn {
  userProfile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  changeNickname: (name: string) => Promise<boolean>;
  changePassword: (password: string) => Promise<boolean>;
}
