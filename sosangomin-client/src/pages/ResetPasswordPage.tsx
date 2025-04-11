// ResetPasswordPage.tsx
import React from "react";
import ResetPassword from "@/features/auth/components/signup/ResetPassword";
import Logo from "@/assets/Logo.svg";
import { Link } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mb-6 md:mb-8 mt-3 ml-3 md:ml-4 lg:ml-6">
        {/* 로고 */}
        <Link to="/">
          <img
            src={Logo}
            alt="소상고민"
            className="w-[140px] h-[48px] md:w-[173px] md:h-[56px]"
          />
        </Link>
      </div>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col items-center justify-center">
          <ResetPassword />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
