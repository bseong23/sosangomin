// API 에러 응답 타입
export interface ApiErrorResponse {
  status: string;
  errorMessage: string;
}

// 사용자 관련 타입
export interface User {
  id: string;
  name: string;
  mail: string;
  isMailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// 회원가입 관련 타입
export interface SignupFormValues {
  name: string;
  mail: string;
  password: string;
  confirmPassword: string;
  isMailVerified: boolean;
}

export interface SignupRequest {
  mail: string;
  name: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  user: User;
  accessToken?: string;
  refreshToken?: string;
  message?: string;
}

// 로그인 관련 타입
export interface LoginFormValues {
  mail: string;
  password: string;
  saveMail: boolean;
}

export interface LoginRequest {
  mail: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userName: string;
  userProfileUrl: string | null;
  isFirstLogin: string;
  userId: string;
}

// 이메일 인증 관련 타입
export interface MailVerificationModalProps {
  mail: string;
  onClose: () => void;
  onComplete: (success: boolean) => void;
}

export interface MailVerificationFormValues {
  code: string;
}

// 메일 인증 요청 타입
export interface MailVerificationRequest {
  mail: string;
}

// 메일 인증번호 확인 요청 타입
export interface MailVerificationCheckRequest {
  mail: string;
  userNumber: number;
}

export interface MailVerificationResponse {
  success: boolean;
  message?: string;
}

// 닉네임 중복 확인 요청 타입
export interface NameCheckRequest {
  name: string;
}

// 중복 확인 관련 타입
export interface DuplicateCheckRequest {
  type: "mail" | "name";
  value: string;
}

export interface DuplicateCheckResponse {
  isDuplicate: boolean;
  message?: string;
}

// API 응답 결과 타입
export type ApiResponse<T = {}> = T | ApiErrorResponse;

// 에러 메시지 상수
export enum ErrorMessages {
  NAME_DUPLICATE = "ERR_NAME_DUPLICATE",
  INVALID_MAIL_NUMBER = "ERR_INVALID_MAIL_NUMBER",
  MAIL_SEND_FAIL = "ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR",
  LOGIN_FAILED = "ERR_LOGIN_FAILED"
}

// useSignup 훅의 상태 타입들
export interface SignupState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

export interface NameCheckState {
  isLoading: boolean;
  error: string | null;
  isAvailable: boolean;
}

export interface MailVerificationState {
  isLoading: boolean;
  error: string | null;
  isSent: boolean;
  isVerified: boolean;
}

// useLogin 훅의 상태 타입
export interface LoginState {
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  userData: LoginResponse | null;
}

// 타입 가드
export const isApiError = (
  response: ApiResponse
): response is ApiErrorResponse => {
  return (response as ApiErrorResponse).status !== undefined;
};

// 비밀번호 변경 (로그인 안 한 상태)
export interface UsePasswordResetReturn {
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}
