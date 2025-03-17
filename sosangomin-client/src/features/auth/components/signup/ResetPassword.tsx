// ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePasswordReset } from "@/features/auth/hooks/usePasswordReset";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 커스텀 훅 호출
  const {
    requestResetEmail,
    resetPasswordWithAccessToken,
    isLoading: isResetLoading,
    error: resetError
  } = usePasswordReset();

  // URL에서 토큰 추출
  const [token, setToken] = useState<string | null>(null);

  // 상태 관리
  const [mail, setMail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isResetComplete, setIsResetComplete] = useState(false);

  // URL에서 액세스 토큰 가져오기
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get("accessToken");
    if (accessToken) {
      setToken(accessToken);
      console.log("토큰 확인:", accessToken); // 디버깅용
    }
  }, [location]);

  // resetError가 변경되면 컴포넌트의 error 상태에 반영
  useEffect(() => {
    if (resetError) {
      setError(resetError);
    }
  }, [resetError]);

  // 현재 단계: 1=이메일 입력(링크 요청), 2=비밀번호 재설정
  // 토큰이 있을 때만 2단계로 이동 (로그인 상태와 무관하게)
  const currentStep = token ? 2 : 1;

  // 진행 표시기 렌더링
  const renderProgressBar = () => (
    <div className="flex items-center justify-left space-x-2 text-sm md:text-base text-gray-500 mt-6 mb-6">
      {/* 1단계: 이메일 인증 */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <div
          className={`absolute inset-0 ${
            currentStep === 1
              ? "bg-blue-200 border-blue-200"
              : "bg-gray-200 border-gray-200"
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
        이메일 요청
      </span>

      <span>&gt;</span>

      {/* 2단계: 비밀번호 재설정 */}
      <div className="relative flex items-center justify-center w-6 h-6">
        <div
          className={`absolute inset-0 ${
            currentStep === 2
              ? "bg-blue-200 border-blue-200"
              : "bg-gray-200 border-gray-200"
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

  // 이메일로 비밀번호 재설정 링크 요청
  const handleRequestResetEmail = async () => {
    if (!mail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await requestResetEmail(mail);

      if (!success) {
        // 에러는 usePasswordReset에서 이미 설정됨
        // 성공 시 이메일 발송 완료 상태로 변경
        setIsEmailSent(true);
        return;
      }
    } catch (error) {
      console.error("비밀번호 재설정 링크 요청 오류:", error);
      setError("이메일 발송 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
      let success = false;

      // 토큰이 있는 경우에만 resetPasswordWithAccessToken 사용
      if (token) {
        success = await resetPasswordWithAccessToken(token, newPassword);
      } else {
        setError("인증 정보가 유효하지 않습니다.");
        setIsLoading(false);
        return;
      }

      if (!success) {
        setError("비밀번호 변경에 실패했습니다.");
        return;
      }

      setIsResetComplete(true);
      setTimeout(() => {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 단계에 따른 폼 렌더링
  const renderForm = () => {
    // 비밀번호 재설정 완료 상태
    if (isResetComplete) {
      return (
        <div className="mt-10 text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-green-600 mb-2">
            비밀번호 재설정 완료
          </h3>
          <p className="text-gray-600">
            비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.
          </p>
        </div>
      );
    }

    // 이메일 발송 성공 후 안내 메시지 (1단계에서만 표시)
    if (isEmailSent && currentStep === 1) {
      return (
        <div className="mt-10">
          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1
                    1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  비밀번호 재설정 링크 발송 완료
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    {mail} 주소로 비밀번호 재설정 링크를 발송했습니다. 이메일을
                    확인하고 링크를 클릭하여 비밀번호를 재설정해주세요.
                  </p>
                  <p className="mt-2">
                    링크는 발송 시점으로부터 5분 동안 유효합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-bit-main hover:text-indigo-800"
            >
              로그인 페이지로 돌아가기
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      // 비밀번호 재설정 단계
      return (
        <div className="mt-10">
          <label
            htmlFor="newPassword"
            className="block text-base md:text-lg font-medium text-[#333333]"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded md:rounded-md lg:rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              비밀번호는 8자 이상이어야 합니다.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={
                isLoading ||
                isResetLoading ||
                !newPassword.trim() ||
                newPassword.length < 8
              }
              className="w-full bg-bit-main text-white p-2 rounded md:rounded-md lg:rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading || isResetLoading
                ? "비밀번호 변경 중..."
                : "비밀번호 변경하기"}
            </button>
          </div>
        </div>
      );
    } else {
      // 초기 이메일 입력 단계 (로그인 상태와 무관하게 항상 표시)
      return (
        <div className="mt-10">
          <label
            htmlFor="email"
            className="block text-base md:text-lg text-bit-comment"
          >
            이메일
          </label>
          <div className="mt-2">
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
                ${error ? "border-red-500" : "border-border"} 
                rounded md:rounded-md lg:rounded-md`}
            />
            <div className="mt-7">
              <button
                type="button"
                onClick={handleRequestResetEmail}
                disabled={isLoading}
                className="w-full bg-bit-main text-white p-2 border rounded md:rounded-md lg:rounded-md hover:bg-blue-800"
              >
                {isLoading ? "처리 중..." : "비밀번호 재설정 링크 받기"}
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

      <div className="w-full max-w-ml py-8 mx-auto">
        <div className="text-left mb-6">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
            {currentStep === 2 ? "비밀번호 재설정" : "이메일 인증"}
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-5">
            {isEmailSent
              ? "이메일로 발송된 링크를 통해 비밀번호를 재설정할 수 있습니다."
              : currentStep === 2
              ? "새로운 비밀번호를 입력해주세요."
              : "가입하신 이메일 주소로 비밀번호 재설정 링크를 보내드립니다."}
          </p>
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded md:rounded-md lg:rounded-md">
            {error}
          </div>
        )}

        {/* 현재 단계에 따른 폼 렌더링 */}
        {renderForm()}

        {/* 로그인 페이지로 돌아가기 링크 (완료 상태와 이메일 발송 상태가 아닐 때만 표시) */}
        {!isResetComplete && !(isEmailSent && currentStep === 1) && (
          <div className="mt-6 text-center">
            <a href="/login" className="text-bit-main hover:text-indigo-800">
              로그인 페이지로 돌아가기
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
