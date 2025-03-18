import React from "react";
import KakaoCallback from "@/features/auth/components/login/KakaoCallback";
import useAuthStore from "@/store/useAuthStore"; // 실제 스토어 경로를 확인하세요

const KakaoCallbackPage: React.FC = () => {
  // Auth 스토어에서 setUserInfo 함수 가져오기
  const { setUserInfo } = useAuthStore();

  // 로그인 성공 처리 함수
  const handleLoginSuccess = (userData: any) => {
    console.log("카카오 로그인 성공:", userData);
    // 필요한 추가 처리 구현
  };

  // 로그인 오류 처리 함수
  const handleLoginError = (error: string) => {
    console.error("카카오 로그인 실패:", error);
    // 필요한 오류 처리 구현
  };

  return (
    <KakaoCallback
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
      redirectOnSuccess="/"
      setUserInfo={setUserInfo} // Auth 스토어의 setUserInfo 함수 전달
    />
  );
};

export default KakaoCallbackPage;
