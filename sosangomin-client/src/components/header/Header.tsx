import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavItem, UserInfo } from "@/types/header";
import Logo from "@/assets/Logo.svg";
import { isPathActive } from "@/utils/curlocation";
import ProfileDropdown from "@/components/header/ProfileDropdown";

const Header: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  // userInfo를 JSON으로 파싱
  const userInfoString = localStorage.getItem("userInfo");
  let userInfo: UserInfo | null = null;

  try {
    if (userInfoString) {
      userInfo = JSON.parse(userInfoString) as UserInfo;
    }
  } catch (error) {
    console.error("Failed to parse user info:", error);
  }

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
