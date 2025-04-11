import React from "react";
import KakaoCallback from "@/features/auth/components/login/KakaoCallback";

const KakaoCallbackPage: React.FC = () => {
  // 로그인 오류 처리 함수
  const handleLoginError = (error: string) => {
    console.error("카카오 로그인 실패:", error);
    // 필요한 오류 처리 구현
  };

  return <KakaoCallback onError={handleLoginError} redirectOnSuccess="/" />;
};

export default KakaoCallbackPage;
