import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import useAuthStore from "@/store/useAuthStore";
import Loading from "@/components/common/Loading";
import NicknameSection from "@/features/auth/components/mypage/NicknameSection";
import EmailSection from "@/features/auth/components/mypage/EmailSection";
import ProfileImageSection from "@/features/auth/components/mypage/ProfileImageSection";
import AccountManagementSection from "@/features/auth/components/mypage/AccountManagementSection";
import WithdrawalConfirm from "@/features/auth/components/mypage/WithdrawalConfirm"; // 회원 탈퇴 확인 모달 import
import { clearAuthData } from "@/features/auth/api/userStorage"; // 로컬 스토리지 정리 함수
import { withdrawUser } from "@/features/auth/api/authApi"; // 회원 탈퇴 API 함수

interface UserInfoProps {
  isEditable?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ isEditable = false }) => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, clearUserInfo } = useAuthStore();
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfile();

  // 이미지 업로드 에러 표시를 위한 상태
  const [imageError, setImageError] = useState<string | null>(null);

  // 회원 탈퇴 모달 제어 상태
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // 회원 탈퇴 처리 중 상태
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // 회원 탈퇴 과정 에러 상태
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);

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

  // 회원탈퇴 모달 열기 핸들러
  const handleDeleteAccount = () => {
    setIsWithdrawalModalOpen(true);
  };

  // 회원탈퇴 실행 핸들러
  const handleConfirmWithdrawal = async () => {
    setIsWithdrawing(true);
    setWithdrawalError(null);

    try {
      // 회원 탈퇴 API 호출
      await withdrawUser();

      // 로컬 스토리지 데이터 삭제
      clearAuthData();

      // Zustand 스토어 초기화
      clearUserInfo();

      // 회원 탈퇴 성공 메시지
      alert("회원 탈퇴가 완료되었습니다.");

      // 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 오류:", error);
      setWithdrawalError(
        "회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsWithdrawing(false);
      setIsWithdrawalModalOpen(false);
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

      {/* 회원 탈퇴 에러 메시지 */}
      {withdrawalError && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-md text-center">
          {withdrawalError}
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
          <EmailSection
            email={userProfile.mail}
            userType={userProfile.userType}
          />

          {/* 계정 관리 링크 섹션 */}
          {isEditable && (
            <AccountManagementSection
              onPasswordChange={handlePasswordChange}
              onDeleteAccount={handleDeleteAccount}
            />
          )}
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      {isEditable && (
        <WithdrawalConfirm
          isOpen={isWithdrawalModalOpen}
          onClose={() => setIsWithdrawalModalOpen(false)}
          onConfirm={handleConfirmWithdrawal}
          isProcessing={isWithdrawing}
        />
      )}
    </div>
  );
};

export default UserInfo;
