import { useState } from "react";
import {
  signup,
  checkNameDuplicate,
  sendVerificationMail,
  verifyMailCode,
  isApiError
} from "@/features/auth/api/authApi";
import {
  SignupRequest,
  MailVerificationState,
  NameCheckState,
  SignupState,
  ErrorMessages
} from "@/features/auth/types/auth";

/**
 * 회원가입 프로세스를 관리하는 커스텀 훅
 */
export const useSignup = () => {
  // 회원가입 상태
  const [signupState, setSignupState] = useState<SignupState>({
    isLoading: false,
    error: null,
    isSuccess: false
  });

  // 닉네임 중복 확인 상태
  const [nameCheckState, setNameCheckState] = useState<NameCheckState>({
    isLoading: false,
    error: null,
    isAvailable: false
  });

  // 메일 인증 상태
  const [mailVerificationState, setMailVerificationState] =
    useState<MailVerificationState>({
      isLoading: false,
      error: null,
      isSent: false,
      isVerified: false
    });

  /**
   * 회원가입 제출 함수
   */
  const submitSignup = async (data: SignupRequest): Promise<boolean> => {
    setSignupState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false
    }));

    try {
      const response = await signup(data);

      if (isApiError(response)) {
        setSignupState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.errorMessage,
          isSuccess: false
        }));
        return false;
      }

      setSignupState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
        isSuccess: true
      }));
      return true;
    } catch (error) {
      setSignupState((prev) => ({
        ...prev,
        isLoading: false,
        error: "회원가입 중 오류가 발생했습니다.",
        isSuccess: false
      }));
      return false;
    }
  };

  /**
   * 닉네임 중복 확인 함수
   */
  const checkName = async (name: string): Promise<boolean> => {
    if (!name.trim()) {
      setNameCheckState((prev) => ({
        ...prev,
        isLoading: false,
        error: "닉네임을 입력해주세요.",
        isAvailable: false
      }));
      return false;
    }

    setNameCheckState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      isAvailable: false
    }));

    try {
      const response = await checkNameDuplicate(name);

      if (isApiError(response)) {
        const errorMessage =
          response.errorMessage === ErrorMessages.NAME_DUPLICATE
            ? "이미 사용 중인 닉네임입니다."
            : "닉네임 확인 중 오류가 발생했습니다.";

        setNameCheckState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isAvailable: false
        }));
        return false;
      }

      setNameCheckState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
        isAvailable: true
      }));
      return true;
    } catch (error) {
      setNameCheckState((prev) => ({
        ...prev,
        isLoading: false,
        error: "닉네임 확인 중 오류가 발생했습니다.",
        isAvailable: false
      }));
      return false;
    }
  };

  /**
   * 메일 인증 요청 함수
   */
  const sendVerification = async (mail: string): Promise<boolean> => {
    if (!mail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setMailVerificationState((prev) => ({
        ...prev,
        error: "유효한 이메일 주소를 입력해주세요.",
        isSent: false
      }));
      return false;
    }

    setMailVerificationState((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await sendVerificationMail(mail);

      if (isApiError(response)) {
        const errorMessage =
          response.errorMessage === ErrorMessages.MAIL_SEND_FAIL
            ? "이메일 발송에 실패했습니다."
            : "이메일 인증 요청 중 오류가 발생했습니다.";

        setMailVerificationState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isSent: false
        }));
        return false;
      }

      setMailVerificationState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
        isSent: true
      }));
      return true;
    } catch (error) {
      setMailVerificationState((prev) => ({
        ...prev,
        isLoading: false,
        error: "이메일 인증 요청 중 오류가 발생했습니다.",
        isSent: false
      }));
      return false;
    }
  };

  /**
   * 메일 인증번호 확인 함수
   */
  const verifyCode = async (mail: string, code: number): Promise<boolean> => {
    setMailVerificationState((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await verifyMailCode(mail, code);

      if (isApiError(response)) {
        const errorMessage =
          response.errorMessage === ErrorMessages.INVALID_MAIL_NUMBER
            ? "인증번호가 일치하지 않습니다."
            : "인증번호 확인 중 오류가 발생했습니다.";

        setMailVerificationState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isVerified: false
        }));
        console.log("인증 실패:", errorMessage);
        return false;
      }

      setMailVerificationState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
        isVerified: true,
        isSent: true
      }));
      console.log("인증 성공: isVerified = true로 설정됨");
      return true;
    } catch (error) {
      setMailVerificationState((prev) => ({
        ...prev,
        isLoading: false,
        error: "인증번호 확인 중 오류가 발생했습니다.",
        isVerified: false
      }));
      console.error("인증 오류:", error);
      return false;
    }
  };

  /**
   * 메일 인증 상태 직접 설정 함수
   */
  const setMailVerified = (isVerified: boolean) => {
    setMailVerificationState((prev) => ({
      ...prev,
      isVerified
    }));
  };

  /**
   * 모든 상태 초기화 함수
   */
  const resetStates = () => {
    setSignupState({
      isLoading: false,
      error: null,
      isSuccess: false
    });

    setNameCheckState({
      isLoading: false,
      error: null,
      isAvailable: false
    });

    setMailVerificationState({
      isLoading: false,
      error: null,
      isSent: false,
      isVerified: false
    });
  };

  /**
   * 메일 인증 상태만 초기화 함수
   */
  const resetMailVerification = () => {
    setMailVerificationState({
      isLoading: false,
      error: null,
      isSent: false,
      isVerified: false
    });
  };

  return {
    signupState,
    submitSignup,
    nameCheckState,
    checkName,
    mailVerificationState,
    sendVerification,
    verifyCode,
    setMailVerified,
    resetStates,
    resetMailVerification
  };
};

export default useSignup;
