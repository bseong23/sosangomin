import { useState } from "react";
import { withdrawUser } from "@/features/auth/api/authApi";
import { useNavigate } from "react-router-dom";

interface UseUserWithdrawalReturn {
  isWithdrawing: boolean;
  error: string | null;
  withdrawUserAccount: () => Promise<void>;
}

/**
 * 회원 탈퇴 기능을 관리하는 커스텀 훅
 */
const useUserWithdrawal = (): UseUserWithdrawalReturn => {
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * 회원 탈퇴 처리 함수
   */
  const withdrawUserAccount = async (): Promise<void> => {
    setIsWithdrawing(true);
    setError(null);

    try {
      // 회원 탈퇴 API 호출 (withdrawUser 내부에서 토큰 삭제 및 Zustand 스토어 초기화 처리)
      await withdrawUser();

      // 탈퇴 성공 후 홈페이지로 리다이렉트
      navigate("/");

      // 성공 메시지 표시 (선택 사항)
      alert("회원 탈퇴가 완료되었습니다.");
    } catch (err) {
      // 오류 메시지 설정
      setError("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("회원 탈퇴 오류:", err);
    } finally {
      setIsWithdrawing(false);
    }
  };

  return {
    isWithdrawing,
    error,
    withdrawUserAccount
  };
};

export default useUserWithdrawal;
