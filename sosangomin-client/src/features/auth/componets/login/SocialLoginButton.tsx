// src/components/login/SocialLoginButton.tsx
import React, { useState } from "react";
import kakao_login_button from "@/assets/kakao_login.svg"; // 카카오 로그인 이미지 경로 확인 필요
import Loading from "@/components/common/Loading"; // 로딩 컴포넌트
import { getKakaoAuthUrl } from "@/api/authApi"; // authApi 임포트

const SocialLoginButtons: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = () => {
    console.log("카카오 로그인 시도");

    setIsLoading(true);

    // 직접 URL을 만드는 대신 API 함수 사용
    const kakaoAuthUrl = getKakaoAuthUrl();
    window.location.replace(kakaoAuthUrl);
  };

  return (
    <div className="pt-4">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>

      <button
        onClick={handleKakaoLogin}
        className="w-full cursor-pointer"
        type="button"
        disabled={isLoading}
      >
        <img src={kakao_login_button} alt="카카오 로그인" className="w-full" />
      </button>
      {isLoading && <Loading />}
    </div>
  );
};

export default SocialLoginButtons;
