// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import {
  getUserInfo,
  getAccessToken,
  clearAuthData,
  isUserLoggedIn
} from "@/api/userStorage";
import { logout as apiLogout } from "@/api/authApi";

interface UseAuthReturn {
  user: any | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

/**
 * 인증 상태를 관리하는 커스텀 훅
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<any | null>(getUserInfo());
  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessToken()
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isUserLoggedIn());

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = getAccessToken();
      const userInfo = getUserInfo();

      setAccessToken(token);
      setUser(userInfo);
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // 다른 탭/창에서의 로그인/로그아웃 감지를 위한 이벤트 리스너 (선택 사항)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 로그아웃 함수
  const logout = async () => {
    try {
      // API 로그아웃 호출 (백엔드와 동기화)
      await apiLogout();
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
      // API 호출 실패해도 로컬에서는 로그아웃 진행
    } finally {
      // 로컬 스토리지 데이터 삭제
      clearAuthData();

      // 상태 업데이트
      setUser(null);
      setAccessToken(null);
      setIsLoggedIn(false);
    }
  };

  return {
    user,
    accessToken,
    isLoggedIn,
    logout
  };
};

export default useAuth;
