import { useState } from "react";
import { login, isApiError } from "@/features/auth/api/authApi";
import { saveAuthData } from "@/features/auth/api/userStorage";
import {
  LoginRequest,
  LoginResponse,
  ErrorMessages,
  LoginState
} from "@/features/auth/types/auth";

/**
 * 로그인 프로세스를 관리하는 커스텀 훅
 */
export const useLogin = () => {
  // 로그인 상태
  const [loginState, setLoginState] = useState<LoginState>({
    isLoading: false,
    error: null,
    isSuccess: false,
    userData: null
  });

  /**
   * 이메일 저장
   */
  const saveEmail = (email: string) => {
    localStorage.setItem("savedEmail", email);
  };

  /**
   * 저장된 이메일 삭제
   */
  const clearSavedEmail = () => {
    localStorage.removeItem("savedEmail");
  };

  /**
   * 로그인 요청 함수
   * @param data 로그인 요청 데이터 (mail, password)
   * @param rememberEmail 이메일 저장 여부
   * @returns 로그인 성공 여부
   */
  const submitLogin = async (
    data: LoginRequest,
    rememberEmail: boolean
  ): Promise<boolean> => {
    setLoginState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false,
      userData: null
    }));

    try {
      const response = await login(data.mail, data.password);

      if (isApiError(response)) {
        const errorMessage =
          response.errorMessage === ErrorMessages.LOGIN_FAILED
            ? "이메일 또는 비밀번호가 올바르지 않습니다."
            : "로그인 중 오류가 발생했습니다.";

        setLoginState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isSuccess: false
        }));
        return false;
      }

      // 로그인 성공 처리
      const loginResponse = response as LoginResponse;

      // 상태 업데이트
      setLoginState({
        isLoading: false,
        error: null,
        isSuccess: true,
        userData: loginResponse
      });

      // username을 userName으로 변경하기 위해 데이터 변환
      const userData = {
        ...loginResponse,
        userName: loginResponse.userName // userName 속성 추가
      };

      // 변환된 데이터를 저장
      saveAuthData(loginResponse.accessToken, userData);

      // 이메일 저장 처리
      if (rememberEmail) {
        saveEmail(data.mail);
      } else {
        clearSavedEmail();
      }

      console.log("로그인 성공! 액세스 토큰과 사용자 정보 저장 완료");
      return true;
    } catch (error) {
      console.error("로그인 오류:", error);
      setLoginState((prev) => ({
        ...prev,
        isLoading: false,
        error: "로그인 중 오류가 발생했습니다.",
        isSuccess: false
      }));
      return false;
    }
  };

  /**
   * 로그인 상태 초기화
   */
  const resetLoginState = () => {
    setLoginState({
      isLoading: false,
      error: null,
      isSuccess: false,
      userData: null
    });
  };

  /**
   * 저장된 이메일 가져오기
   */
  const getSavedEmail = (): string | null => {
    return localStorage.getItem("savedEmail");
  };

  return {
    loginState,
    submitLogin,
    resetLoginState,
    getSavedEmail
  };
};

export default useLogin;
