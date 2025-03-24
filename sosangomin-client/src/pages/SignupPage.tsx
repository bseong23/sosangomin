import React from "react";
import Logo from "@/assets/Logo.svg";
import Signup from "@/features/auth/components/signup/Signup";
import { Link } from "react-router-dom";

const SignupPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 mx-auto">
      <div className="w-full max-w-xl space-y-6 p-8 rounded-lg">
        {/* 로고 */}
        <Link to="/">
          <img src={Logo} alt="소상고민" className="w-2/3 mx-auto mb-10" />
        </Link>

        {/* 회원가입 폼 - 모든 로직은 컴포넌트 내부에서 처리 */}
        <Signup />

        {/* 로그인 링크 */}
        <div className="flex items-center justify-center mt-6">
          <span className="text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              로그인하기
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
