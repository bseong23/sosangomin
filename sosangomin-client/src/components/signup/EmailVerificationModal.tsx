import React, { useState, useEffect } from "react";
import { MailVerificationModalProps } from "@/types/auth";
import { useSignup } from "@/hooks/useSignup";

const EmailVerificationModal: React.FC<MailVerificationModalProps> = ({
  mail,
  onClose,
  onComplete
}) => {
  // 커스텀 훅 사용
  const { sendVerification, verifyCode, mailVerificationState } = useSignup();

  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(300); // 5분 타이머
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 인증번호 입력란 참조 생성 (자동 포커스용)
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 컴포넌트 마운트 시 타이머 시작
  useEffect(() => {
    // 타이머 설정
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    // 인풋에 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(interval);
  }, [mail]);

  // mailVerificationState.isVerified 상태 변화 감지
  useEffect(() => {
    if (mailVerificationState.isVerified) {
      setIsSuccess(true);
    }
  }, [mailVerificationState.isVerified]);

  // 성공 메시지 후 자동 닫기
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        onComplete(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, onComplete]);

  // 타이머 포맷팅 (분:초)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // 인증번호 재발송
  const handleResend = async () => {
    // 훅의 sendVerification 사용
    const result = await sendVerification(mail);
    if (result) {
      // 타이머 리셋
      setTimer(300);
      setError("");
    }
  };

  // 인증번호 확인
  const handleVerify = async () => {
    // 유효성 검사
    if (!verificationCode.trim()) {
      setError("인증번호를 입력해주세요.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("인증번호 6자리를 정확히 입력해주세요.");
      return;
    }

    setIsVerifying(true);

    try {
      // 훅의 verifyCode 사용
      const success = await verifyCode(mail, parseInt(verificationCode));

      if (!success) {
        setError(
          mailVerificationState.error || "인증번호 확인에 실패했습니다."
        );
      }
      // 성공 시 isVerified 상태 변경은 훅에서 처리됨
      // useEffect에서 이 상태 변화를 감지하고 isSuccess 설정
    } catch (err) {
      setError("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* 모달 컨텐츠 */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">이메일 인증</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center">
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
              인증이 완료되었습니다
            </h3>
            <p className="text-gray-600">회원가입을 계속 진행해주세요.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>{mail}</strong>으로 인증번호가 발송되었습니다.
              </p>
              <p className="text-sm text-gray-600">
                이메일에 포함된 인증번호 6자리를 입력해주세요.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => {
                    // 숫자만 입력 가능하도록
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                    setVerificationCode(onlyNumbers);
                    if (error) setError("");
                  }}
                  placeholder="인증번호 6자리"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-sm font-medium text-red-500 whitespace-nowrap">
                  {formatTime(timer)}
                </span>
              </div>
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleVerify}
                disabled={
                  timer === 0 || isVerifying || mailVerificationState.isLoading
                }
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isVerifying || mailVerificationState.isLoading
                  ? "확인 중..."
                  : "인증 확인"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={mailVerificationState.isLoading}
                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {mailVerificationState.isLoading
                  ? "재발송 중..."
                  : "인증번호 재발송"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationModal;
