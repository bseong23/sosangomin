// src/components/login/StandardLoginForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/features/auth/hooks/useLogin";

const StandardLoginForm: React.FC = () => {
  const { loginState, submitLogin, getSavedEmail } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = getSavedEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveEmail(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // useLogin 훅을 사용하여 로그인 시도
      const success = await submitLogin({ mail: email, password }, saveEmail);

      if (success) {
        // 로그인 성공 시 홈 페이지로 이동
        navigate("/");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  return (
    <form className="mt-8 space-y-4" onSubmit={handleLogin}>
      {loginState.error && (
        <div className="p-2 text-sm text-red-600 bg-red-50 rounded">
          {loginState.error}
        </div>
      )}

      <div className="space-y-5">
        {/* 아이디 입력 */}
        <div>
          <label
            htmlFor="email"
            className="block text-md font-medium text-[#333333]"
          >
            아이디
          </label>
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="아이디를 입력해 주세요."
            className="mt-1 block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <div className="flex justify-between">
            <label
              htmlFor="password"
              className="block text-md font-medium text-gray-700"
            >
              비밀번호
            </label>
            <div className="text-xs">
              <a
                href="/reset-password"
                className="text-gray-500 hover:text-gray-700"
              >
                비밀번호를 잃어버리셨나요?
              </a>
            </div>
          </div>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요."
              className="block w-full px-3 py-4 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
        </div>

        {/* 아이디 저장 체크박스 */}
        <div className="flex items-center">
          <input
            id="save-email"
            name="save-email"
            type="checkbox"
            checked={saveEmail}
            onChange={(e) => setSaveEmail(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="save-email"
            className="ml-2 block text-sm text-gray-700"
          >
            아이디 저장
          </label>
        </div>
      </div>

      {/* 회원가입 링크 */}
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-500">
          아직 계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            회원가입하기
          </a>
        </span>
      </div>

      {/* 로그인 버튼 */}
      <div>
        <button
          type="submit"
          disabled={loginState.isLoading}
          className={`w-full flex justify-center py-4 px-4 border cursor-pointer border-transparent rounded-[10px] shadow-sm text-xl font-medium text-white ${
            loginState.isLoading
              ? "bg-indigo-400"
              : "bg-[#16125D] hover:bg-indigo-800"
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {loginState.isLoading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </form>
  );
};

export default StandardLoginForm;
