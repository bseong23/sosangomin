import React, { useState, useEffect } from "react";
import EmailVerificationModal from "./EmailVerificationModal";
import eyeIcon from "@/assets/eye.svg";
import eyeCloseIcon from "@/assets/eye_close.svg";
import { useSignup } from "@/features/auth/hooks/useSignup";
import { SignupRequest } from "@/features/auth/types/auth";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  // 커스텀 훅 사용
  const {
    signupState,
    submitSignup,
    nameCheckState,
    checkName,
    emailCheckState,
    checkEmail,
    mailVerificationState,
    sendVerification,
    setMailVerified,
    resetMailVerification
  } = useSignup();
  const navigate = useNavigate();

  // 로컬 상태 관리
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [prevMail, setPrevMail] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isEmailBeingVerified, setIsEmailBeingVerified] = useState(false); // 이메일 검증 진행 상태

  // 비밀번호 유효성 검사
  useEffect(() => {
    setIsPasswordValid(password.length >= 8);
  }, [password]);

  // 메일 주소가 변경되면 인증 상태 초기화
  useEffect(() => {
    if (
      prevMail !== "" &&
      prevMail !== mail &&
      mailVerificationState.isVerified
    ) {
      // 이메일이 변경되고 이전에 인증된 상태였다면 인증 상태를 리셋
      resetMailVerification();
    }

    setPrevMail(mail);
  }, [mail, prevMail, mailVerificationState.isVerified, resetMailVerification]);

  // 양식 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 기본 유효성 검사
    if (!isPasswordValid) {
      alert("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!nameCheckState.isAvailable) {
      alert("닉네임 중복 확인이 필요합니다.");
      return;
    }

    if (!emailCheckState.isAvailable) {
      alert("이메일 중복 확인이 필요합니다.");
      return;
    }

    if (!mailVerificationState.isVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    // 회원가입 요청
    const signupData: SignupRequest = {
      mail,
      name,
      password
    };

    const success = await submitSignup(signupData);
    if (success) {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
      // 여기서 리다이렉트 등 추가 작업 가능
    }
  };

  // 닉네임 중복 확인
  const handleCheckDuplicate = async () => {
    const isAvailable = await checkName(name);
    if (isAvailable) {
      return;
    }
  };

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    if (!mail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    // 먼저 모달을 열고
    setIsVerificationModalOpen(true);
    setIsEmailBeingVerified(true);

    try {
      // 이메일 중복 체크
      const isAvailable = await checkEmail(mail);

      // 이메일이 사용 가능하면 인증 코드 발송
      if (isAvailable) {
        await sendVerification(mail);
      } else {
        // 이메일이 사용 불가능하면 모달 닫기 (필요시)
        // setIsVerificationModalOpen(false);
      }
    } catch (error) {
      console.error("이메일 검증 에러:", error);
      // 에러 처리 (모달 내부에서 처리할 수 있음)
    } finally {
      setIsEmailBeingVerified(false);
    }
  };

  // 인증 완료 처리
  const handleVerificationComplete = (success: boolean) => {
    setIsVerificationModalOpen(false);

    // 인증 성공 시 상태 업데이트
    if (success) {
      setMailVerified(true);
      console.log("인증 완료 처리: 인증 성공");
    }
  };

  return (
    <div className="w-full">
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* 일반 에러 메시지 */}
        {signupState.error && (
          <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
            {signupState.error}
          </div>
        )}

        <div className="space-y-5">
          {/* 닉네임 입력 */}
          <div>
            <label
              htmlFor="name"
              className="block text-base font-medium text-comment"
            >
              닉네임 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="닉네임을 입력해주세요."
                className={`block w-full px-3 py-4 border ${
                  nameCheckState.error ? "border-red-500" : "border-border"
                } rounded focus:outline-none focus:border-bit-main pr-24`}
              />
              <button
                type="button"
                onClick={handleCheckDuplicate}
                disabled={nameCheckState.isLoading}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center px-4 py-1.5 border border-border rounded bg-gray-50 text-comment-text text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
              >
                {nameCheckState.isLoading ? "확인 중..." : "중복확인"}
              </button>
            </div>
            {nameCheckState.error && (
              <p className="mt-1 text-sm text-red-500">
                {nameCheckState.error}
              </p>
            )}
            {nameCheckState.isAvailable && (
              <p className="mt-1 text-sm text-green-600">
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          {/* 이메일 아이디 입력 */}
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-comment"
            >
              이메일<span className="text-red-500">*</span>
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
                placeholder="example@naver.com"
                className={`block w-full px-3 py-4 border ${
                  emailCheckState.error || mailVerificationState.error
                    ? "border-red-500"
                    : mailVerificationState.isVerified
                    ? "border-border"
                    : emailCheckState.isAvailable
                    ? "border-blue-500"
                    : "border-border"
                } rounded focus:outline-none focus:border-bit-main pr-24`}
              />
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center px-4 py-1.5 border border-border rounded bg-gray-50 text-sm font-medium">
                {emailCheckState.isLoading || isEmailBeingVerified ? (
                  <span className="text-comment-text">처리 중...</span>
                ) : mailVerificationState.isVerified ? (
                  <div className="flex items-center text-green-600 font-medium">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    인증완료
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleEmailVerification}
                    className="text-comment-text hover:text-comment"
                  >
                    인증하기
                  </button>
                )}
              </div>
            </div>
            {emailCheckState.error && (
              <p className="mt-1 text-sm text-red-500">
                {emailCheckState.error}
              </p>
            )}
            {emailCheckState.isAvailable &&
              !mailVerificationState.isVerified &&
              !mailVerificationState.error && (
                <p className="mt-1 text-sm text-blue-600">
                  사용 가능한 이메일입니다. 인증을 진행해주세요.
                </p>
              )}
            {mailVerificationState.error && (
              <p className="mt-1 text-sm text-red-500">
                {mailVerificationState.error}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label
              htmlFor="password"
              className="block text-base font-medium text-comment"
            >
              비밀번호 입력 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
                className={`block w-full px-3 py-4 border ${
                  password && !isPasswordValid
                    ? "border-border"
                    : password && isPasswordValid
                    ? "border-border"
                    : "border-border"
                } rounded focus:outline-none focus:border-bit-main`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <img
                  src={showPassword ? eyeIcon : eyeCloseIcon}
                  alt={showPassword ? "비밀번호 보이기" : "비밀번호 숨기기"}
                  className="h-6 w-6"
                />
              </button>
            </div>
            {password && !isPasswordValid && (
              <p className="mt-1 text-sm text-red-500">
                비밀번호는 8자 이상이어야 합니다.
              </p>
            )}
            {password && isPasswordValid && (
              <p className="mt-1 text-sm text-green-600">
                사용가능한 비밀번호입니다.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-base font-medium text-comment"
            >
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요."
                className="block w-full px-3 py-4 border border-border rounded focus:outline-none focus:border-bit-main"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <img
                  src={showConfirmPassword ? eyeIcon : eyeCloseIcon}
                  alt={
                    showConfirmPassword ? "비밀번호 보기" : "비밀번호 숨기기"
                  }
                  className="h-6 w-6"
                />
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={signupState.isLoading}
            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-basic-white ${
              signupState.isLoading ? "bg-opacity-70" : "hover:bg-blue-900"
            } bg-bit-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bit-main`}
          >
            {signupState.isLoading ? "처리 중..." : "회원가입"}
          </button>
        </div>
      </form>

      {/* 이메일 인증 모달 */}
      {isVerificationModalOpen && (
        <EmailVerificationModal
          mail={mail}
          onClose={() => setIsVerificationModalOpen(false)}
          onComplete={handleVerificationComplete}
          isInitializing={isEmailBeingVerified}
        />
      )}
    </div>
  );
};

export default Signup;
