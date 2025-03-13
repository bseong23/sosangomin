// ResetPasswordPage.tsx
import React from "react";
import ResetPassword from "@/features/auth/components/signup/ResetPassword";
import Logo from "@/assets/Logo.svg";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mb-8 mt-6 ml-6">
        <img src={Logo} alt="소상고민" className="w-[173px] h-[56px]" />
      </div>
      <div className="w-full max-w-sm mx-auto pt-10 px-4">
        <ResetPassword />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
