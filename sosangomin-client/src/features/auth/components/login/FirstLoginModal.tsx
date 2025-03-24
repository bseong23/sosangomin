import React, { useState, useRef, useEffect } from "react";
import { getUserInfo } from "@/features/auth/api/userApi";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { LoginResponse } from "@/features/auth/types/auth";

interface FirstLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: LoginResponse;
  setUserInfo: (userInfo: LoginResponse) => void;
}

const FirstLoginModal: React.FC<FirstLoginModalProps> = ({
  isOpen,
  onClose,
  userData,
  setUserInfo
}) => {
  const { changeNickname } = useUserProfile();
  const [isVisible, setIsVisible] = useState<boolean>(isOpen);
  const [newNickname, setNewNickname] = useState<string>(
    userData.userName || ""
  );
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1); // 1: 환영 메시지, 2: 닉네임 설정

  const nicknameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    // 닉네임 입력 단계에서 자동으로 인풋에 포커스
    if (step === 2 && nicknameInputRef.current) {
      nicknameInputRef.current.focus();
    }
  }, [step]);

  // 사용자 정보 새로고침 함수
  const refreshUserInfo = async () => {
    try {
      const freshUserInfo = await getUserInfo();

      // 스토어 업데이트 (전체 갱신)
      if (userData) {
        const updatedUserInfo: LoginResponse = {
          userId: userData.userId,
          userName: freshUserInfo.name,
          userProfileUrl: freshUserInfo.userProfileUrl,
          isFirstLogin: userData.isFirstLogin,
          accessToken: userData.accessToken,
          userRole: userData.userRole
        };

        // 전역 상태 업데이트
        setUserInfo(updatedUserInfo);
      }

      // 커스텀 이벤트를 발생시켜 헤더에 알림
      document.dispatchEvent(
        new CustomEvent("profile:update", {
          detail: { nickname: freshUserInfo.name }
        })
      );
    } catch (error) {
      console.error("사용자 정보 새로고침 실패:", error);
    }
  };

  // 닉네임 저장
  const saveNickname = async () => {
    // 유효성 검사
    if (!newNickname.trim()) {
      setNicknameError("닉네임을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    setNicknameError(null);

    try {
      const success = await changeNickname(newNickname);

      if (success) {
        // 닉네임 변경 성공
        await refreshUserInfo();

        // 모달 닫기
        setIsVisible(false);
        onClose();
      } else {
        // 닉네임 변경 실패 (에러는 커스텀 훅에서 처리됨)
        setNicknameError("닉네임 변경에 실패했습니다");
      }
    } catch (error) {
      console.error("닉네임 변경 중 오류:", error);
      setNicknameError("서버 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 닉네임 입력 필드 키 이벤트 처리
  const handleNicknameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      saveNickname();
    }
  };

  // 다음 단계로 이동 (환영 메시지 → 닉네임 설정)
  const goToNextStep = () => {
    setStep(2);
  };

  // 모달 닫기 요청 시 처리
  const handleClose = () => {
    // 닉네임 설정 단계에서는 닫기를 방지 (필수 설정)
    if (step === 2) {
      return;
    }

    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
        {/* 닫기 버튼 (닉네임 설정 단계에서는 숨김) */}
        {step === 1 && (
          <button
            onClick={handleClose}
            className="absolute p-1 text-gray-500 hover:text-gray-700 top-4 right-4"
          >
            {/* X 아이콘 (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* 모달 내용 */}
        <div className="text-center">
          {step === 1 ? (
            // 단계 1: 환영 메시지
            <>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👋</span>
                </div>
              </div>

              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                환영합니다!
              </h2>

              <p className="mb-6 text-gray-600">
                처음으로 서비스에 가입해 주셔서 감사합니다. 시작하기 전에
                닉네임을 설정하시면 더 편리하게 서비스를 이용하실 수 있습니다.
              </p>

              <div className="p-4 mb-6 text-left bg-gray-50 rounded-lg">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">•</span>
                    <span>
                      닉네임은 언제든지 마이페이지에서 변경할 수 있습니다.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">•</span>
                    <span>설정한 닉네임은 다른 사용자들에게 표시됩니다.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 font-bold">•</span>
                    <span>
                      타인에게 불쾌감을 주는 닉네임은 사용을 자제해 주세요.
                    </span>
                  </li>
                </ul>
              </div>

              <button
                onClick={goToNextStep}
                className="w-full py-3 font-medium text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600"
              >
                닉네임 설정하기
              </button>
            </>
          ) : (
            // 단계 2: 닉네임 설정
            <>
              <h2 className="mb-6 text-2xl font-bold text-gray-800">
                닉네임 설정
              </h2>

              <div className="mb-6">
                <div className="flex flex-col items-start mb-2">
                  <label
                    htmlFor="nickname"
                    className="mb-2 text-sm font-medium text-gray-700"
                  >
                    닉네임
                  </label>
                  <input
                    ref={nicknameInputRef}
                    id="nickname"
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    onKeyDown={handleNicknameKeyDown}
                    placeholder="사용하실 닉네임을 입력해주세요"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    disabled={isSubmitting}
                  />
                </div>

                {nicknameError && (
                  <p className="mt-2 text-sm text-red-600">{nicknameError}</p>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  * 닉네임은 다른 사용자에게 표시되는 이름입니다.
                </p>
              </div>

              <button
                onClick={saveNickname}
                disabled={isSubmitting}
                className="w-full py-3 font-medium text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600 disabled:bg-yellow-300"
              >
                {isSubmitting ? "저장 중..." : "저장하고 시작하기"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirstLoginModal;
