// src/components/UserInfo.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import useAuthStore from "@/store/useAuthStore";
import Loading from "@/components/common/Loading";
import NicknameSection from "@/features/auth/components/mypage/NicknameSection";
import EmailSection from "@/features/auth/components/mypage/EmailSection";
import ProfileImageSection from "@/features/auth/components/mypage/ProfileImageSection";
import AccountManagementSection from "@/features/auth/components/mypage/AccountManagementSection";

interface UserInfoProps {
  isEditable?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ isEditable = false }) => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuthStore();
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfile();

  // 이미지 업로드 에러 표시를 위한 상태
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    const handleProfileUpdate = () => {
      // 프로필 정보 새로고침
      fetchUserProfile();
    };

    // 이벤트 리스너 등록
    document.addEventListener("profile:update", handleProfileUpdate);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("profile:update", handleProfileUpdate);
    };
  }, [fetchUserProfile]);

  // 비밀번호 수정 핸들러
  const handlePasswordChange = () => {
    navigate("/reset-password");
  };

  // 회원탈퇴 핸들러
  const handleDeleteAccount = () => {
    if (
      window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      console.log("회원탈퇴 진행");
      // 회원탈퇴 로직 구현
    }
  };

  if (isLoading) {
    return <Loading />;
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
      {/* 이미지 업로드 에러 메시지 */}
      {imageError && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md text-center">
          {imageError}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-10 items-center">
        {/* 프로필 이미지 섹션 */}
        <ProfileImageSection
          profileImage={userProfile.profileImage}
          isEditable={isEditable}
          setImageError={setImageError}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />

        {/* 사용자 정보 섹션 */}
        <div className="flex-1 space-y-6">
          {/* 닉네임 섹션 */}
          <NicknameSection
            nickname={userProfile.nickname}
            isEditable={isEditable}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />

          {/* 이메일 섹션 */}
          <EmailSection email={userProfile.mail} />

          {/* 계정 관리 링크 섹션 */}
          {isEditable && (
            <AccountManagementSection
              onPasswordChange={handlePasswordChange}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
