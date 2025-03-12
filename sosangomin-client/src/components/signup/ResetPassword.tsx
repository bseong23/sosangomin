// ResetPassword.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailVerificationModal from "@/components/signup/EmailVerificationModal";
import { isApiError } from "@/api/authApi";
import { useSignup } from "@/hooks/useSignup";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ErrorMessages } from "@/types/auth";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  // 커스텀 훅 호출 (컴포넌트 최상위 레벨)
  const { sendVerification } = useSignup();
  const { changePassword } = useUserProfile();

  // 상태 관리
  const [mail, setMail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // 현재 단계: 1=이메일 인증, 2=비밀번호 재설정
  const currentStep = isVerified ? 2 : 1;

  // 진행 표시기 렌더링
  const renderProgressBar = () => (
    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-6">
      {/* 1단계: 이메일 인증 */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <div
          className={`absolute inset-0 ${
            currentStep === 1
              ? "bg-blue-100 border-blue-200"
              : "bg-gray-100 border-gray-200"
          } border rounded-full blur-sm`}
        ></div>
        <span
          className={`relative text-sm font-medium ${
            currentStep === 1 ? "text-blue-500" : "text-gray-400"
          } z-10`}
        >
          1
        </span>
      </div>
      <span
        className={`${
          currentStep === 1 ? "text-blue-500" : "text-gray-400"
        } flex items-center`}
      >
        이메일 인증
      </span>

      <span>&gt;</span>

      {/* 2단계: 비밀번호 재설정 */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <div
          className={`absolute inset-0 ${
            currentStep === 2
              ? "bg-blue-100 border-blue-200"
              : "bg-gray-100 border-gray-200"
          } border rounded-full blur-sm`}
        ></div>
        <span
          className={`relative text-sm font-medium ${
            currentStep === 2 ? "text-blue-500" : "text-gray-400"
          } z-10`}
        >
          2
        </span>
      </div>
      <span
        className={`${
          currentStep === 2 ? "text-blue-500" : "text-gray-400"
        } flex items-center`}
      >
        비밀번호 재설정
      </span>
    </div>
  );

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    if (!mail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await sendVerification(mail);

      if (isApiError(response)) {
        const errorMsg =
          response.errorMessage === ErrorMessages.MAIL_SEND_FAIL
            ? "이메일 발송에 실패했습니다."
            : "이메일 인증 요청 중 오류가 발생했습니다.";

        setError(errorMsg);
        return;
      }

      setIsEmailSent(true);
      setIsVerificationModalOpen(true);
    } catch (error) {
      console.error("이메일 인증 요청 오류:", error);
      setError("이메일 인증 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 완료 처리
  const handleVerificationComplete = async (code: string, success: boolean) => {
    setIsVerificationModalOpen(false);

    if (success) {
      setIsVerified(true);
      setVerificationCode(code);
    }
  };

  // 비밀번호 변경 처리
  const handlePasswordChange = async () => {
    if (!newPassword.trim() || newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await changePassword(newPassword);

      if (!success) {
        setError("비밀번호 변경에 실패했습니다.");
        return;
      }

      alert("비밀번호가 성공적으로 변경되었습니다.");

      // 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 인증 단계에 따른 폼 렌더링
  const renderForm = () => {
    if (isVerified) {
      // 비밀번호 재설정 단계
      return (
        <div className="mt-4">
          <label
            htmlFor="newPassword"
            className="block text-md font-medium text-[#333333]"
          >
            새 비밀번호
          </label>
          <div className="mt-1">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호 입력"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              비밀번호는 8자 이상이어야 합니다.
            </p>
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={
                isLoading || !newPassword.trim() || newPassword.length < 8
              }
              className="w-full bg-[#16125D] text-white p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "처리 중..." : "비밀번호 변경하기"}
            </button>
          </div>
        </div>
      );
    } else if (isEmailSent && !isVerified) {
      // 인증코드 확인 단계
      return (
        <div className="mt-4">
          <label
            htmlFor="verificationCode"
            className="block text-md font-medium text-[#333333]"
          >
            인증번호
          </label>
          <div className="mt-1">
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증 번호 입력"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => handleVerificationComplete(verificationCode, true)}
              disabled={isLoading || !verificationCode.trim()}
              className="w-full bg-[#16125D] text-white p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "처리 중..." : "인증코드 확인"}
            </button>
          </div>
        </div>
      );
    } else {
      // 초기 이메일 입력 단계
      return (
        <div className="mt-4">
          <label
            htmlFor="email"
            className="block text-md font-medium text-[#333333]"
          >
            이메일
          </label>
          <div className="mt-1 relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="이메일을 입력해 주세요"
              className={`block w-full px-3 py-2 border 
                ${error ? "border-red-500" : "border-gray-300"} 
                rounded-md shadow-sm focus:outline-none`}
            />
            <div className="mt-2">
              <button
                type="button"
                onClick={handleEmailVerification}
                disabled={isLoading}
                className="w-full bg-[#16125D] text-white p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "처리 중..." : "인증메일 보내기"}
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {/* 프로그레스 바 */}
      {renderProgressBar()}

      <div className="w-full max-w-md p-8 mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            {isVerified ? "비밀번호 재설정" : "이메일 인증"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isVerified
              ? "새로운 비밀번호를 입력해주세요."
              : "가입하신 이메일 주소로 인증코드를 보내드립니다."}
          </p>
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 현재 단계에 따른 폼 렌더링 */}
        {renderForm()}

        {/* 로그인 페이지로 돌아가기 링크 */}
        <div className="mt-6 text-center">
          <a href="/login" className="text-indigo-600 hover:text-indigo-800">
            로그인 페이지로 돌아가기
          </a>
        </div>

        {/* 인증 모달 */}
        {isVerificationModalOpen && (
          <EmailVerificationModal
            mail={mail}
            isOpen={isVerificationModalOpen}
            onClose={() => setIsVerificationModalOpen(false)}
            onComplete={handleVerificationComplete}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
