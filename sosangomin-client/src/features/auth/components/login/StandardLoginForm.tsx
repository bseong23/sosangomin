import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/features/auth/hooks/useLogin";
// 아이콘 import 추가 (Signup 컴포넌트와 동일하게)
import eyeIcon from "@/assets/eye.svg";
import eyeCloseIcon from "@/assets/eye_close.svg";

const StandardLoginForm: React.FC = () => {
  const { loginState, submitLogin, getSavedEmail } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시 토글 상태 추가
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
    <form className="space-y-5" onSubmit={handleLogin}>
      {" "}
      {/* space-y-4에서 space-y-5로 변경 */}
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
            className="block text-base font-medium text-comment"
          >
            이메일
          </label>
          <div className="mt-1 relative">
            {" "}
            {/* div 추가로 구조 일치시키기 */}
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="아이디를 입력해 주세요."
              className="block w-full px-3 py-4 border border-border rounded focus:outline-none focus:border-bit-main"
            />
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <div className="flex justify-between">
            <label
              htmlFor="password"
              className="block text-base font-medium text-comment"
            >
              비밀번호
            </label>
            <div className="text-xs">
              <a href="/password" className="text-bit-main">
                비밀번호를 잃어버리셨나요?
              </a>
            </div>
          </div>
          <div className="mt-1 relative">
            <input
              id="password"
              name="password"
              type={
                showPassword ? "text" : "password"
              } /* 비밀번호 표시 토글 기능 추가 */
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요."
              className="block w-full px-3 py-4 border border-border rounded focus:outline-none focus:border-bit-main"
            />
            {/* 비밀번호 표시/숨기기 버튼 추가 */}
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? eyeIcon : eyeCloseIcon}
                alt={showPassword ? "비밀번호 보이기" : "비밀번호 숨기기"}
                className="h-6 w-6"
              />
            </button>
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
            className="h-4 w-4 text-bit-main focus:ring-bit-main border-border rounded"
          />
          <label
            htmlFor="save-email"
            className="ml-2 block text-sm text-comment-text"
          >
            아이디 저장
          </label>
        </div>
      </div>
      {/* 회원가입 링크 */}
      <div className="flex items-center justify-center">
        <span className="text-sm text-comment-text">
          아직 계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="font-medium text-bit-main hover:opacity-80"
          >
            회원가입하기
          </a>
        </span>
      </div>
      {/* 로그인 버튼 */}
      <div className="pt-6">
        {" "}
        {/* div에 pt-6 추가 */}
        <button
          type="submit"
          disabled={loginState.isLoading}
          className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-base  font-medium text-basic-white ${
            loginState.isLoading ? "bg-opacity-70" : "hover:bg-blue-900"
          } bg-bit-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bit-main`}
        >
          {loginState.isLoading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </form>
  );
};

export default StandardLoginForm;
