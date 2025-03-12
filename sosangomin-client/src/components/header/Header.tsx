import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem, UserInfo } from "@/types/header";
import Logo from "@/assets/Logo.svg";
import { isPathActive } from "@/utils/curlocation";
import ProfileDropdown from "@/components/header/ProfileDropdown";

const Header: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  // 상태로 유저 정보 관리
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 초기 로딩 시 로컬 스토리지에서 유저 정보 가져오기
  useEffect(() => {
    const loadUserInfo = () => {
      const userInfoString = localStorage.getItem("userInfo");
      if (userInfoString) {
        try {
          const parsedUserInfo = JSON.parse(userInfoString) as UserInfo;
          setUserInfo(parsedUserInfo);
        } catch (error) {
          console.error("Failed to parse user info:", error);
        }
      }
    };

    loadUserInfo();
  }, []);

  // 프로필 업데이트 이벤트 리스너 등록
  useEffect(() => {
    const handleProfileUpdate = (e: CustomEvent<{ nickname: string }>) => {
      if (userInfo) {
        // 새 닉네임으로 상태 업데이트
        setUserInfo((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            userName: e.detail.nickname
          };
        });
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener(
      "profile:update",
      handleProfileUpdate as EventListener
    );

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener(
        "profile:update",
        handleProfileUpdate as EventListener
      );
    };
  }, [userInfo]);

  const navItems: NavItem[] = [
    { name: "서비스 소개", path: "/service" },
    { name: "데이터 분석", path: "/data-analysis/upload" },
    { name: "상권분석", path: "/map" },
    { name: "커뮤니티", path: "/community/notice" }
  ];

  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-300 h-[73px] w-screen font-inter bg-white">
      <div className="pl-[28px]">
        <Link to="/">
          <img
            src={Logo}
            alt="로고"
            className="w-[116px] h-[38px] cursor-pointer"
          />
        </Link>
      </div>

      <div className="flex gap-[100px]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`cursor-pointer hover:text-blue-500 text-gray-600 text-[16px] ${
              isPathActive(location.pathname, item.path) ? "font-extrabold" : ""
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex pr-[60px]">
        {token && userInfo ? (
          <ProfileDropdown
            userName={userInfo.userName}
            userProfileUrl={userInfo.userProfileUrl}
          />
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center bg-[#16125D] text-white px-[25px] py-[12px] rounded-md hover:bg-blue-800 w-[116px] h-[40px]"
          >
            로그인
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
