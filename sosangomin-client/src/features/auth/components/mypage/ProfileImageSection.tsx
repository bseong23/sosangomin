// src/features/auth/components/mypage/ProfileImageSection.tsx
import React, { useState, useRef } from "react";
import ProfileSection from "@/features/auth/components/mypage/ProfileSection";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { getUserInfo } from "@/features/auth/api/userApi";

interface ProfileImageSectionProps {
  profileImage: string | null;
  isEditable: boolean;
  setImageError: (error: string | null) => void;
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  profileImage,
  isEditable,
  setImageError,
  userInfo,
  setUserInfo
}) => {
  const { changeProfileImg } = useUserProfile();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // 프로필 이미지 수정 핸들러
  const handleEditProfile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 선택 시 처리
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    if (!file.type.startsWith("image/")) {
      setImageError("이미지 파일만 업로드 가능합니다");
      return;
    }

    // 파일 크기 검사 (1MB 제한)
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      setImageError("이미지 용량은 1MB 이하여야 합니다");
      return;
    }

    setIsUploadingImage(true);
    setImageError(null);

    try {
      const success = await changeProfileImg(file);

      if (success) {
        // 전체 사용자 정보 새로고침 - 새로운 프로필 URL 가져오기
        await refreshUserInfo();

        // 서버에서 최신 사용자 정보 가져온 후 이벤트 발생시키기
        const freshUserInfo = await getUserInfo();

        // 새로 받은 프로필 이미지 URL로 이벤트 발생
        document.dispatchEvent(
          new CustomEvent("profile:update", {
            detail: {
              profileImage: freshUserInfo.userProfileUrl
            }
          })
        );
      } else {
        setImageError("프로필 이미지 변경에 실패했습니다");
      }
    } catch (err) {
      console.error("프로필 이미지 업로드 오류:", err);
      setImageError("이미지 업로드 중 오류가 발생했습니다");
    } finally {
      setIsUploadingImage(false);
      // 파일 인풋 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 프로필 이미지 섹션 */}
      <ProfileSection
        imageUrl={profileImage}
        isEditable={isEditable}
        onEditImage={handleEditProfile}
        isLoading={isUploadingImage}
      />
    </>
  );
};

export default ProfileImageSection;
