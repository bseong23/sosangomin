// src/components/login/KakaoCallback.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAuthData } from "@/api/userStorage";
import Loading from "@/components/common/Loading";

interface KakaoCallbackProps {
  onSuccess?: (userData: any) => void;
  onError?: (error: string) => void;
  redirectOnSuccess?: string;
}

const KakaoCallback: React.FC<KakaoCallbackProps> = ({
  onSuccess,
  onError,
  redirectOnSuccess = "/"
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        // URL에서 파라미터 추출
        const searchParams = new URLSearchParams(location.search);

        // 에러 확인
        const errorParam = searchParams.get("error");
        if (errorParam) {
          throw new Error(errorParam);
        }

        // 토큰 및 사용자 정보 추출
        const accessToken = searchParams.get("accessToken");
        const userName = searchParams.get("userName");
        const userProfileUrl = searchParams.get("userProfileUrl");
        const isFirstLogin = searchParams.get("isFirstLogin") === "true";
        const userId = searchParams.get("userId");

        // 필수 정보 확인
        if (!accessToken || !userId) {
          throw new Error("필수 로그인 정보가 없습니다.");
        }

        // 사용자 정보 구성
        const userData = {
          userId,
          userName: userName || "",
          userProfileUrl: userProfileUrl || "",
          isFirstLogin
        };

        // 사용자 정보와 토큰 저장
        saveAuthData(accessToken, userData);

        console.log("로그인 성공! 액세스 토큰과 사용자 정보 저장 완료");

        // 성공 콜백 호출
        if (onSuccess) {
          onSuccess({ ...userData, accessToken });
        }

        // 그 외 경우 기본 페이지로 리다이렉트
        navigate(redirectOnSuccess, { replace: true });
      } catch (err: any) {
        console.error("카카오 로그인 콜백 처리 오류:", err);
        const errorMsg = err.message || "로그인 처리 중 오류가 발생했습니다.";
        setError(errorMsg);

        if (onError) {
          onError(errorMsg);
        }

        // 에러 시 로그인 페이지로 리다이렉트
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };

    handleKakaoCallback();
  }, [location, navigate, onSuccess, onError, redirectOnSuccess]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loading size="large" />
        <p className="mt-4 text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">로그인 오류</p>
          <p>{error}</p>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          잠시 후 로그인 페이지로 이동합니다...
        </p>
      </div>
    );
  }

  return null;
};

export default KakaoCallback;
