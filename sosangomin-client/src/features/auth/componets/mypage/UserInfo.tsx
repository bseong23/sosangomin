// src/components/UserInfo.tsx
import React, { useState, useRef } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import ProfileSection from "@/components/mypage/ProfileSection";
import { getUserInfo, saveAuthData } from "@/api/userStorage"; // 헤더 정보 업데이트를 위해 추가

interface UserInfoProps {
  isEditable?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ isEditable = false }) => {
  const navigate = useNavigate();

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

        // 헤더에 저장된 사용자 정보 업데이트
        updateStoredUserInfo(newNickname);

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

  // 로컬 스토리지에 저장된 사용자 정보 업데이트
  const updateStoredUserInfo = (newNickname: string) => {
    try {
      // 현재 저장된 사용자 정보 가져오기
      const currentUserInfo = getUserInfo();

      if (currentUserInfo && currentUserInfo.accessToken) {
        // 닉네임 업데이트된 정보 저장
        const updatedUserInfo = {
          ...currentUserInfo,
          userName: newNickname
        };

        // 업데이트된 정보 저장
        saveAuthData(currentUserInfo.accessToken, updatedUserInfo);

        console.log(
          "저장된 사용자 정보가 업데이트되었습니다:",
          updatedUserInfo
        );
      }
    } catch (error) {
      console.error("사용자 정보 업데이트 중 오류:", error);
    }
  };

  // 프로필 이미지 수정 핸들러
  const handleEditProfile = () => {
    // 실제 구현에서는 이미지 업로드 모달 등이 열림
    alert("프로필 이미지 수정");
  };

  // 비밀번호 수정 핸들러
  const handlePasswordChange = () => {
    navigate("/reset-password");
  };

  // 회원탈퇴 핸들러
  const handleDeleteAccount = () => {
    console.log("회원탈퇴!");
    if (
      window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      console.log("회원탈퇴 진행");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-8 w-full text-center">{error}</div>;
  }

  if (!userProfile) {
    return (
      <div className="text-gray-500 p-8 w-full text-center">
        사용자 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-white">
      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* 프로필 이미지 섹션 */}
        <ProfileSection
          imageUrl={userProfile.profileImage}
          isEditable={isEditable}
          onEditImage={handleEditProfile}
        />

        {/* 사용자 정보 섹션 */}
        <div className="flex-1 space-y-6">
          {/* 닉네임 */}
          <div>
            <div className="text-xl font-medium text-gray-700 mb-2">닉네임</div>
            <div className="flex justify-between items-center min-w-[300px] border border-[#BEBEBE] rounded-[10px] p-4">
              {isEditingNickname ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center">
                    <input
                      ref={nicknameInputRef}
                      type="text"
                      value={newNickname}
                      onChange={(e) => setNewNickname(e.target.value)}
                      onKeyDown={handleNicknameKeyDown}
                      className="flex-1 border border-white rounded focus:outline-none text-xl"
                      disabled={isSubmittingNickname}
                    />
                    <div className="flex ml-3">
                      <button
                        onClick={saveNickname}
                        disabled={isSubmittingNickname}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
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
                    </div>
                  </div>
                  {nicknameError && (
                    <p className="text-sm text-red-500 mt-2">{nicknameError}</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-xl">{userProfile.nickname}</div>
                  {isEditable && (
                    <button
                      onClick={startEditingNickname}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      aria-label="닉네임 수정"
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
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <div className="text-xl font-medium text-gray-700 mb-2">이메일</div>
            <div className="text-xl border border-[#BEBEBE] rounded-[10px] p-4">
              {userProfile.mail}
            </div>
          </div>

          {/* 계정 관리 링크들 */}
          {isEditable && (
            <div className="flex justify-end gap-10 mt-6 text-sm">
              <div
                onClick={handlePasswordChange}
                className="text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                비밀번호 수정하기
              </div>
              <div
                onClick={handleDeleteAccount}
                className="text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                회원탈퇴
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
