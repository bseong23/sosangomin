// src/hooks/usePasswordReset.ts
import { useState } from "react";
import axiosInstance from "@/api/axios";
import { UsePasswordResetReturn } from "@/features/auth/types/auth";

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 비밀번호 재설정 함수 (비로그인 상태용)
  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!newPassword.trim() || newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        "/api/auth/reset-password/reset",
        {
          mail: email,
          verificationCode: code,
          password: newPassword
        }
      );

      return response.data.success || true;
    } catch (err: any) {
      console.error("비밀번호 재설정 오류:", err);

      if (err.response) {
        const errorMsg =
          err.response.data?.message || "비밀번호 재설정에 실패했습니다.";
        setError(errorMsg);
      } else if (err.request) {
        setError("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
      } else {
        setError("요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.");
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
    error
  };
};

export default usePasswordReset;
