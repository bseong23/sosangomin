// ResetPasswordPage.tsx
import React from "react";
import ResetPassword from "@/components/signup/ResetPassword";
import Logo from "@/assets/Logo.svg";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mb-8 mt-3 ml-3">
        <img src={Logo} alt="소상고민" className="w-[173px] h-[56px]" />
      </div>
      <div className="w-full max-w-lg mx-auto pt-12 px-4">
        <ResetPassword />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
