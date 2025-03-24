// src/features/auth/components/mypage/NicknameSection.tsx
import React, { useState, useRef } from "react";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { getUserInfo } from "@/features/auth/api/userApi";

interface NicknameSectionProps {
  nickname: string;
  isEditable: boolean;
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
}

const NicknameSection: React.FC<NicknameSectionProps> = ({
  nickname,
  isEditable,
  userInfo,
  setUserInfo
}) => {
  const { changeNickname } = useUserProfile();

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isSubmittingNickname, setIsSubmittingNickname] = useState(false);

  const nicknameInputRef = useRef<HTMLInputElement>(null);

  // 사용자 정보 새로고침 함수
  const refreshUserInfo = async () => {
    try {
      const freshUserInfo = await getUserInfo();

      // Zustand 스토어 업데이트 (전체 갱신)
      if (userInfo) {
        setUserInfo({
          userId: userInfo.userId,
          userName: freshUserInfo.name,
          userProfileUrl: freshUserInfo.userProfileUrl,
          isFirstLogin: userInfo.isFirstLogin,
          accessToken: userInfo.accessToken
        });
      }
    } catch (error) {
      console.error("사용자 정보 새로고침 실패:", error);
    }
  };

  // 닉네임 수정 모드 시작
  const startEditingNickname = () => {
    setNewNickname(nickname);
    setNicknameError(null);
    setIsEditingNickname(true);

    // 다음 렌더링 후 인풋에 포커스
    setTimeout(() => {
      if (nicknameInputRef.current) {
        nicknameInputRef.current.focus();
      }
    }, 0);
  };

  // 닉네임 수정 취소
  const cancelEditingNickname = () => {
    setIsEditingNickname(false);
    setNicknameError(null);
  };

  // 닉네임 저장
  const saveNickname = async () => {
    // 변경사항이 없으면 그냥 수정 모드 종료
    if (newNickname === nickname) {
      setIsEditingNickname(false);
      return;
    }

    // 유효성 검사
    if (!newNickname.trim()) {
      setNicknameError("닉네임을 입력해주세요");
      return;
    }

    setIsSubmittingNickname(true);
    setNicknameError(null);

    try {
      const success = await changeNickname(newNickname);

      if (success) {
        // 닉네임 변경 성공
        setIsEditingNickname(false);

        // 전체 사용자 정보 새로고침
        await refreshUserInfo();

        // 커스텀 이벤트를 발생시켜 헤더에 알림
        document.dispatchEvent(
          new CustomEvent("profile:update", {
            detail: { nickname: newNickname }
          })
        );
      } else {
        // 닉네임 변경 실패 (에러는 커스텀 훅에서 처리됨)
        setNicknameError("닉네임 변경에 실패했습니다");
      }
    } catch (error) {
      setNicknameError("서버 오류가 발생했습니다");
    } finally {
      setIsSubmittingNickname(false);
    }
  };

  // Enter 키로 저장, Escape 키로 취소
  const handleNicknameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveNickname();
    } else if (e.key === "Escape") {
      cancelEditingNickname();
    }
  };

  return (
    <div>
      <div className="flex items-center mb-1 gap-1">
        <div className="text-lg font-bold text-comment">닉네임</div>
        {isEditable && !isEditingNickname && (
          <button
            onClick={startEditingNickname}
            className="flex items-center text-lg hover:text-bit-main ml-2 group"
            aria-label="닉네임 수정"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="gray"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 group-hover:stroke-bit-main transition-all duration-200"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-10 items-center rounded-md py-3">
        {isEditingNickname ? (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center">
              <input
                ref={nicknameInputRef}
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                onKeyDown={handleNicknameKeyDown}
                className="flex-1 border border-basic-white rounded focus:outline-none focus:border-bit-main text-base"
                disabled={isSubmittingNickname}
              />
              <div className="flex ml-2">
                <button
                  onClick={saveNickname}
                  disabled={isSubmittingNickname}
                  className="text-green-600 hover:text-green-800 mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <button
                  onClick={cancelEditingNickname}
                  disabled={isSubmittingNickname}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
              </div>
            </div>
            {nicknameError && (
              <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
            )}
          </div>
        ) : (
          <div className="text-base">{nickname}</div>
        )}
      </div>
    </div>
  );
};

export default NicknameSection;
