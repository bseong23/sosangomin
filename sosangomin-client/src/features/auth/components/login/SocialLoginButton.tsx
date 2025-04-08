import React, { useState } from "react";
import Loading from "@/components/common/Loading"; // 로딩 컴포넌트
import { getKakaoAuthUrl } from "@/features/auth/api/authApi"; // authApi 임포트
import KakaoButton from "./KakaoButton";

const SocialLoginButtons: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = () => {
    setIsLoading(true);

    // 직접 URL을 만드는 대신 API 함수 사용
    const kakaoAuthUrl = getKakaoAuthUrl();
    window.location.replace(kakaoAuthUrl);
  };

  return (
    <div className="pt-4">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-basic-white text-comment-text">
            카카오로 간편 로그인 / 회원가입하기
          </span>
        </div>
      </div>

      <button
        onClick={handleKakaoLogin}
        className="w-full cursor-pointer"
        type="button"
        disabled={isLoading}
      >
        <KakaoButton />
      </button>
      {isLoading && <Loading />}
    </div>
  );
};

export default SocialLoginButtons;
