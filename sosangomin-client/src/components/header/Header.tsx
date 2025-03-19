import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem } from "@/types/header";
import Logo from "@/assets/Logo.svg";
import { isPathActive } from "@/utils/curlocation";
import ProfileDropdown from "@/components/header/ProfileDropdown";
import useAuthStore from "@/store/useAuthStore";
import { getAccessToken } from "@/features/auth/api/userStorage";

const Header: React.FC = () => {
  const location = useLocation();

  // Zustand 스토어에서 유저 정보 가져오기
  const { userInfo, updateUserInfo } = useAuthStore();

  // 액세스 토큰 확인
  const token = getAccessToken();

  // 프로필 업데이트 이벤트 리스너 등록
  useEffect(() => {
    // 이벤트 타입 확장 - 프로필 이미지 업데이트 처리 추가
    const handleProfileUpdate = (
      e: CustomEvent<{
        nickname?: string;
        profileImage?: string;
      }>
    ) => {
      if (userInfo) {
        // 업데이트할 정보 객체 생성
        const updateInfo: Record<string, any> = {};

        // 닉네임 업데이트 처리
        if (e.detail.nickname) {
          updateInfo.userName = e.detail.nickname;
        }

        // 프로필 이미지 업데이트 처리
        if (e.detail.profileImage) {
          updateInfo.userProfileUrl = e.detail.profileImage;
        }

        // 업데이트할 정보가 있으면 Zustand 스토어 업데이트
        if (Object.keys(updateInfo).length > 0) {
          updateUserInfo(updateInfo);
        }
      }
    };

    document.addEventListener(
      "profile:update",
      handleProfileUpdate as EventListener
    );

    return () => {
      document.removeEventListener(
        "profile:update",
        handleProfileUpdate as EventListener
      );
    };
  }, [userInfo, updateUserInfo]);

  const navItems: NavItem[] = [
    { name: "데이터 분석", path: "/data-analysis/upload" },
    { name: "리뷰 분석", path: "/review/store" },
    { name: "상권 분석", path: "/map" },
    { name: "종합 분석", path: "/result" },
    { name: "커뮤니티", path: "/community/notice" }
  ];

  return (
    <div className="flex flex-row items-center justify-between border-b border-[var(--color-border)] h-19 w-screen bg-white">
      <div className="pl-8">
        <Link to="/">
          <img src={Logo} alt="로고" className="w-30 h-10 cursor-pointer" />
        </Link>
      </div>

      <div className="flex gap-25">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`cursor-pointer hover:text-blue-800 text-[#4B5563] ${
              isPathActive(location.pathname, item.path) ? "font-extrabold" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex pr-15">
        {token && userInfo ? (
          <ProfileDropdown
            userName={userInfo.userName}
            userProfileUrl={userInfo.userProfileUrl}
          />
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center bg-[#16125D] text-white px-3 py-4 rounded-md hover:bg-blue-800 w-29 h-10"
          >
            로그인
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
