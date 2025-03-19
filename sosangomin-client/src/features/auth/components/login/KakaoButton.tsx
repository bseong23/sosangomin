import React from "react";
import KakaoLogo from "@/assets/Kakao.png";

interface KakaoLoginButtonProps {
  onClick?: () => void;
}

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ onClick }) => {
  return (
    <div
      className="w-full relative flex items-center justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-[#FEE500] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 hover:bg-yellow-400"
      onClick={onClick}
    >
      {/* 카카오 아이콘 - 왼쪽에 고정 */}
      <div className="absolute left-4">
        <img src={KakaoLogo} alt="카카오 로고" className="h-6 w-6" />
      </div>

      {/* 카카오 로그인 텍스트 - 중앙 정렬 */}
      <span className="text-base">카카오 로그인</span>
    </div>
  );
};

export default KakaoLoginButton;
