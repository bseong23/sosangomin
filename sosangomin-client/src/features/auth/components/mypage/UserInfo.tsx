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
    navigate("/password");
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
      <div className="text-comment-text p-8 w-full text-center">
        사용자 정보가 없습니다.
      </div>
    );
  }

  // UserInfo.tsx의 렌더링 부분 수정
  return (
    <>
      <div className="w-full mx-auto p-3 sm:p-4 md:p-5 bg-basic-white border border-border rounded-md md:rounded-lg">
        {/* 이미지 업로드 에러 메시지 */}
        {imageError && (
          <div className="mb-3 sm:mb-4 p-2 bg-red-100 text-red-600 rounded text-center text-xs sm:text-sm">
            {imageError}
          </div>
        )}

        {/* 회원 탈퇴 에러 메시지 */}
        {withdrawalError && (
          <div className="mb-3 sm:mb-4 p-2 bg-red-100 text-red-600 rounded text-center text-xs sm:text-sm">
            {withdrawalError}
          </div>
        )}

        {/* 모바일에서는 세로 레이아웃, 태블릿 이상에서는 가로 레이아웃 */}
        <div className="px-2 sm:px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center w-full">
            {/* 프로필 이미지 섹션 - 모바일에서는 전체 너비, 태블릿 이상에서는 1/3 */}
            <div className="w-full sm:w-1/3 flex justify-center mb-4 sm:mb-0">
              <ProfileImageSection
                profileImage={userProfile.profileImage}
                isEditable={isEditable}
                setImageError={setImageError}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
              />
            </div>

            {/* 사용자 정보 섹션 - 모바일에서는 전체 너비, 태블릿 이상에서는 2/3 */}
            <div className="w-full sm:w-2/3">
              {/* 닉네임 섹션 */}
              <div className="mb-3 sm:mb-4">
                <NicknameSection
                  nickname={userProfile.nickname}
                  isEditable={isEditable}
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                />
              </div>

              {/* 이메일 섹션 */}
              <div>
                <EmailSection
                  email={userProfile.mail}
                  userType={userProfile.userType}
                />
              </div>
            </div>
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

      {/* 계정 관리 링크 섹션 - 네모칸 바깥으로 이동 */}
      {isEditable && (
        <div className="mt-2 sm:mt-3 flex justify-end">
          <AccountManagementSection
            onPasswordChange={handlePasswordChange}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      )}
    </>
  );
};

export default UserInfo;
