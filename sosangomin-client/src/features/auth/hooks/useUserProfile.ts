// src/hooks/useUserProfile.ts
import { useState, useEffect } from "react";
import {
  getUserInfo,
  changeName,
  changePassword,
  changeProfileImage,
  isApiError
} from "@/features/auth/api/userApi";
import {
  UserProfileData,
  UseUserProfileReturn,
  ErrorMessages
} from "@/features/auth/types/user";

export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자 정보 가져오기
  const fetchUserProfile = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const userInfo = await getUserInfo();

      // API 응답을 컴포넌트에서 사용할 형태로 변환
      setUserProfile({
        profileImage: userInfo.userProfileUrl,
        nickname: userInfo.name,
        mail: userInfo.mail,
        userType: userInfo.userType
      });
    } catch (err) {
      console.error("사용자 정보 조회 실패:", err);
      setError("사용자 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 닉네임 변경 함수
  const changeNickname = async (newName: string): Promise<boolean> => {
    if (!newName.trim()) {
      setError("닉네임을 입력해주세요.");
      return false;
    }

    try {
      const response = await changeName(newName);

      if (isApiError(response)) {
        // 닉네임 중복 에러 처리
        if (response.errorMessage === ErrorMessages.NAME_DUPLICATE) {
          setError("이미 사용 중인 닉네임입니다.");
          return false;
        }

        setError("닉네임 변경에 실패했습니다.");
        return false;
      }

      // 성공 시 프로필 정보 업데이트
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          nickname: newName
        });
      }

      return true;
    } catch (err) {
      console.error("닉네임 변경 실패:", err);
      setError("닉네임 변경 중 오류가 발생했습니다.");
      return false;
    }
  };

  // 비밀번호 변경 함수
  const changeUserPassword = async (newPassword: string): Promise<boolean> => {
    if (!newPassword.trim() || newPassword.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return false;
    }

    try {
      const response = await changePassword(newPassword);

      if (isApiError(response)) {
        setError("비밀번호 변경에 실패했습니다.");
        return false;
      }

      return true;
    } catch (err) {
      console.error("비밀번호 변경 실패:", err);
      setError("비밀번호 변경 중 오류가 발생했습니다.");
      return false;
    }
  };

  // 프로필 이미지 변경 함수
  const changeProfileImg = async (imageFile: File): Promise<boolean> => {
    if (!imageFile) {
      setError("이미지 파일이 필요합니다.");
      return false;
    }

    // 이미지 타입 체크
    if (!imageFile.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return false;
    }

    // 파일 크기 체크 (5MB 제한)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB
    if (imageFile.size > MAX_FILE_SIZE) {
      setError("이미지 크기는 10MB 이하여야 합니다.");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await changeProfileImage(imageFile);

      if (isApiError(response)) {
        setError(response.errorMessage || "프로필 이미지 변경에 실패했습니다.");
        return false;
      }

      // 정확히 'profileImgUrl' 키 사용
      if (userProfile && response.profileImgUrl) {
        setUserProfile({
          ...userProfile,
          profileImage: response.profileImgUrl
        });
      }

      return true;
    } catch (err) {
      console.error("프로필 이미지 변경 실패:", err);
      setError("프로필 이미지 변경 중 오류가 발생했습니다.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    changeNickname,
    changePassword: changeUserPassword,
    changeProfileImg,
    fetchUserProfile
  };
};

export default useUserProfile;
