import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveAuthData } from "@/features/auth/api/userStorage";
import Loading from "@/components/common/Loading";
import { LoginResponse } from "@/features/auth/types/auth";
import FirstLoginModal from "@/features/auth/components/login/FirstLoginModal"; // 경로는 프로젝트 구조에 맞게 조정하세요

interface KakaoCallbackProps {
  onSuccess?: (userData: LoginResponse) => void;
  onError?: (error: string) => void;
  redirectOnSuccess?: string;
  setUserInfo: (userInfo: LoginResponse) => void; // Auth 스토어의 setUserInfo 함수
}

const KakaoCallback: React.FC<KakaoCallbackProps> = ({
  onSuccess,
  onError,
  redirectOnSuccess = "/",
  setUserInfo
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginResponse | null>(null);
  const [showFirstLoginModal, setShowFirstLoginModal] =
    useState<boolean>(false);

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
        const isFirstLoginValue = searchParams.get("isFirstLogin");
        const userId = searchParams.get("userId");

        // 필수 정보 확인
        if (!accessToken || !userId) {
          throw new Error("필수 로그인 정보가 없습니다.");
        }

        // 사용자 정보 구성 (accessToken 포함)
        const userDataObj: LoginResponse = {
          userId,
          userName: userName || "",
          userProfileUrl: userProfileUrl || "",
          isFirstLogin: isFirstLoginValue || "",
          accessToken
        };

        // 사용자 정보와 토큰 저장
        saveAuthData(accessToken, userDataObj);
        setUserData(userDataObj);

        // 글로벌 상태 업데이트
        setUserInfo(userDataObj);

        console.log("로그인 성공! 액세스 토큰과 사용자 정보 저장 완료");

        // 첫 로그인인지 확인하고 모달 표시 여부 결정
        if (isFirstLoginValue === "true") {
          setShowFirstLoginModal(true);
        } else {
          completeLogin(userDataObj);
        }
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
  }, [location, navigate, onError, setUserInfo]);

  // 로그인 완료 처리 함수 (모달 닫기 후 실행됨)
  const completeLogin = (loginData: LoginResponse) => {
    // 성공 콜백 호출
    if (onSuccess) {
      onSuccess(loginData);
    }

    // 리다이렉트
    navigate(redirectOnSuccess, { replace: true });
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowFirstLoginModal(false);
    if (userData) {
      completeLogin(userData);
    }
  };

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

  return (
    <>
      {showFirstLoginModal && userData && (
        <FirstLoginModal
          isOpen={showFirstLoginModal}
          onClose={handleCloseModal}
          userData={userData}
          setUserInfo={setUserInfo}
        />
      )}
    </>
  );
};

export default KakaoCallback;
