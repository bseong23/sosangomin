// src/pages/LoginPage.tsx
import React from "react";
import Logo from "@/assets/Logo.svg";
import StandardLoginForm from "@/features/auth/components/login/StandardLoginForm";
import SocialLoginButtons from "@/features/auth/components/login/SocialLoginButton";

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-[90%] space-y-6 p-8 rounded-lg">
        {/* 로고 */}
        <img src={Logo} alt="소상고민" className="w-2/3 mx-auto" />

        {/* 일반 로그인 폼 - 모든 로직은 컴포넌트 내부에서 처리 */}
        <StandardLoginForm />

        {/* 소셜 로그인 버튼 - 모든 로직은 컴포넌트 내부에서 처리 */}
        <SocialLoginButtons />
      </div>
    </div>
  );
};

export default LoginPage;
