// src/components/UserInfo.tsx
import React, { useState, useRef } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import DefaultProfileImage from "@/assets/profileImage.svg"; // 기본 프로필 이미지 import

interface UserInfoProps {
  isEditable?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ isEditable = false }) => {
  // 커스텀 훅 사용
  const { userProfile, isLoading, error, changeNickname } = useUserProfile();

  // 닉네임 수정 관련 상태
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isSubmittingNickname, setIsSubmittingNickname] = useState(false);

  const nicknameInputRef = useRef<HTMLInputElement>(null);

  // 닉네임 수정 모드 시작
  const startEditingNickname = () => {
    if (userProfile) {
      setNewNickname(userProfile.nickname);
      setNicknameError(null);
      setIsEditingNickname(true);

      // 다음 렌더링 후 인풋에 포커스
      setTimeout(() => {
        if (nicknameInputRef.current) {
          nicknameInputRef.current.focus();
        }
      }, 0);
    }
  };

  // 닉네임 수정 취소
  const cancelEditingNickname = () => {
    setIsEditingNickname(false);
    setNicknameError(null);
  };

  // 닉네임 저장
  const saveNickname = async () => {
    if (!userProfile) return;

    // 변경사항이 없으면 그냥 수정 모드 종료
    if (newNickname === userProfile.nickname) {
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

  // 프로필 이미지 수정 핸들러
  const handleEditProfile = () => {
    // 실제 구현에서는 이미지 업로드 모달 등이 열림
    alert("프로필 이미지 수정");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!userProfile) {
    return <div className="text-gray-500 p-4">사용자 정보가 없습니다.</div>;
  }

  return (
    <div className="flex gap-5 justify-center">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center justify-center">
        {/* 프로필 아이템 타이틀 */}
        <div className="text-sm font-medium text-gray-500 mb-1">
          프로필 이미지
        </div>
        <div className="relative">
          <img
            src={userProfile.profileImage || DefaultProfileImage} // null이면 기본 이미지 사용
            alt="프로필 이미지"
            className="w-12 h-12 rounded-full object-cover"
          />
          {isEditable && (
            <button
              onClick={handleEditProfile}
              className="absolute -right-1 -bottom-1 bg-white rounded-full p-1 border border-gray-300"
              aria-label="프로필 이미지 수정"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div>
        {/* 닉네임 */}
        <div className="text-sm font-medium text-gray-500 mb-1">닉네임</div>
        <div className="flex justify-between items-center mb-1 min-w-[200px]">
          {isEditingNickname ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center">
                <input
                  ref={nicknameInputRef}
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  onKeyDown={handleNicknameKeyDown}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={isSubmittingNickname}
                />
                <div className="flex ml-2">
                  <button
                    onClick={saveNickname}
                    disabled={isSubmittingNickname}
                    className="text-green-600 hover:text-green-800 mr-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
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
                      width="18"
                      height="18"
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
                <p className="text-sm text-red-500 mt-1">{nicknameError}</p>
              )}
            </div>
          ) : (
            <>
              <div className="text-base">{userProfile.nickname}</div>
              {isEditable && (
                <button
                  onClick={startEditingNickname}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="닉네임 수정"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* 이메일 */}
        <div className="text-sm font-medium text-gray-500 mb-1">이메일</div>
        <div className="flex justify-between items-center">
          <div className="text-base">{userProfile.mail}</div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
