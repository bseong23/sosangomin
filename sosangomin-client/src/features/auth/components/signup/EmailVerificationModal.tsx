import React, { useState, useEffect } from "react";
import { MailVerificationModalProps } from "@/features/auth/types/auth";
import { useSignup } from "@/features/auth/hooks/useSignup";

// 타입 정의 확장
interface ExtendedMailVerificationModalProps
  extends MailVerificationModalProps {
  isInitializing?: boolean; // 초기화 상태 추가
}

const EmailVerificationModal: React.FC<ExtendedMailVerificationModalProps> = ({
  mail,
  onClose,
  onComplete,
  isInitializing = false
}) => {
  // 커스텀 훅 사용
  const { sendVerification, verifyCode, mailVerificationState } = useSignup();

  const [verificationCode, setVerificationCode] = useState("");
  const [timer, setTimer] = useState(300); // 5분 타이머
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [initializing, setInitializing] = useState(isInitializing); // 초기화 상태 관리

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

    // 인풋에 포커스 (초기화 중이 아닐 때만)
    if (inputRef.current && !initializing) {
      inputRef.current.focus();
    }

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(interval);
  }, [mail, initializing]);

  // isInitializing prop이 변경될 때 업데이트
  useEffect(() => {
    setInitializing(isInitializing);
  }, [isInitializing]);

  // mailVerificationState 변화 감지
  useEffect(() => {
    // 로딩이 끝나면 초기화 상태를 해제
    if (initializing && !mailVerificationState.isLoading) {
      setInitializing(false);

      // 초기화 후 에러가 있으면 표시
      if (mailVerificationState.error) {
        setError(mailVerificationState.error);
      }

      // 초기화 후 인증 코드 입력란에 포커스
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    // 인증 성공 시
    if (mailVerificationState.isVerified) {
      console.log("인증 성공 - isSuccess를 true로 설정");
      setIsSuccess(true);
    }
  }, [mailVerificationState, initializing]);

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

      if (success) {
        console.log(
          "인증 성공 - handleVerify에서 직접 isSuccess를 true로 설정"
        );
        setIsSuccess(true);
      } else {
        setError(
          mailVerificationState.error || "인증번호 확인에 실패했습니다."
        );
      }
    } catch (err) {
      setError("인증 처리 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  // 배경 클릭시 처리 함수
  const handleBackdropClick = () => {
    // 초기화 중이거나 인증 성공 상태일 때는 배경 클릭을 무시
    if (!initializing && !isSuccess) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleBackdropClick}
      ></div>

      {/* 모달 컨텐츠 */}
      <div className="bg-basic-white rounded-lg p-6 w-full max-w-md mx-4 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-comment">이메일 인증</h2>

          {/* 초기화 중이거나 인증 성공 시 X 버튼 숨김 */}
          {!(initializing || isSuccess || mailVerificationState.isVerified) && (
            <button
              onClick={onClose}
              className="text-comment-text hover:text-comment"
              aria-label="닫기"
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
          )}
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
            <p className="text-comment-text">회원가입을 계속 진행해주세요.</p>
          </div>
        ) : initializing ? (
          <div className="py-8 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-10 h-10 text-bit-main animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-comment mb-2">
              이메일 인증 준비 중...
            </h3>
            <p className="text-comment-text">잠시만 기다려주세요.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-comment-text mb-2">
                <strong>{mail}</strong>으로 인증번호가 발송되었습니다.
              </p>
              <p className="text-sm text-comment-text">
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
                  className="w-full px-3 py-3 border border-border rounded focus:outline-none focus:border-bit-main"
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
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-basic-white bg-bit-main hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bit-main disabled:opacity-50"
              >
                {isVerifying || mailVerificationState.isLoading
                  ? "확인 중..."
                  : "인증 확인"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={mailVerificationState.isLoading}
                className="w-full py-3 px-4 border border-border rounded-md shadow-sm text-base font-medium text-comment bg-basic-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bit-main disabled:opacity-50"
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
