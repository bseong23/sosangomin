// src/components/login/StandardLoginForm.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StandardLoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveEmail, setSaveEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 저장된 이메일 불러오기
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setSaveEmail(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 아이디 저장 처리
      if (saveEmail) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }

      // 로그인 API 호출 코드 (예시)
      // 실제 구현 시 아래 코드 주석 해제 및 수정
      /*
      const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
      const response = await fetch(`${apiServerUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('로그인에 실패했습니다');
      }
      
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('userInfo', JSON.stringify({
        userId: data.userId,
        userName: data.userName,
        // 기타 필요한 사용자 정보
      }));
      */

      // 로그인 성공 시뮬레이션 (나중에 실제 API 호출로 대체)
      console.log("일반 로그인 시도:", { email, password, saveEmail });
      setTimeout(() => {
        setIsLoading(false);
        alert("로그인에 성공했습니다.");
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("로그인 오류:", error);
      setIsLoading(false);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <form className="mt-8 space-y-4" onSubmit={handleLogin}>
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
          disabled={isLoading}
          className={`w-full flex justify-center py-4 px-4 border cursor-pointer border-transparent rounded-[10px] shadow-sm text-xl font-medium text-white ${
            isLoading ? "bg-indigo-400" : "bg-[#16125D] hover:bg-indigo-800"
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </form>
  );
};

export default StandardLoginForm;
