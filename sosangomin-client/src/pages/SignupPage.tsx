import Signup from "@/components/signup/Signup";
import Logo from "@/assets/Logo.svg";
import { Link } from "react-router-dom";

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 */}
        <div className="text-center">
          <img src={Logo} alt="소상고민" className="w-2/3 mx-auto" />
        </div>

        {/* 회원가입 폼 */}
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
