// usePasswordReset.ts
import { useState } from "react";
import axiosInstance from "@/api/axios";
import { UsePasswordResetReturn } from "@/features/auth/types/auth";
import axios from "axios";

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 비밀번호 재설정 이메일 요청 함수
  const requestResetEmail = async (email: string): Promise<boolean> => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/api/mail/password", null, {
        params: { mail: email }
      });

      if (response.data) {
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("비밀번호 재설정 메일 요청 오류:", err);

      if (err.response) {
        if (err.response.data?.errorMessage === "ERR_USER_NOT_FOUND") {
          setError("해당 이메일로 가입된 계정이 없습니다.");
        } else if (
          err.response.data?.errorMessage ===
          "ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR"
        ) {
          setError("메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("비밀번호 재설정 메일 발송 중 오류가 발생했습니다.");
        }
      } else {
        setError("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 임시 토큰으로 비밀번호 재설정 함수
  const resetPasswordWithAccessToken = async (
    token: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!newPassword.trim() || newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }

    setIsLoading(true);
    setError(null);

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
        params: { password: newPassword }
      });

      if (response.data) {
        return true;
      }
      return true;
    } catch (err: any) {
      console.error("비밀번호 재설정 오류:", err);

      if (err.response) {
        setError(
          "비밀번호 재설정에 실패했습니다. 링크가 만료되었거나 유효하지 않습니다."
        );
      } else {
        setError("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestResetEmail,
    resetPasswordWithAccessToken,
    isLoading,
    error
  };
};

export default usePasswordReset;
