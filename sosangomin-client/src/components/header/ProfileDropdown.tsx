import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileDropdownProps } from "@/types/header";
import profileImage from "@/assets/profileImage.svg";
import useAuthStore from "@/store/useAuthStore";
import { clearAuthData } from "@/features/auth/api/userStorage";

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userName,
  userProfileUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Zustand 스토어에서 유저 정보 가져오기
  const { userInfo, clearUserInfo } = useAuthStore();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    clearAuthData();
    clearUserInfo();
    window.location.href = "/";
  };

  // userInfo가 없는 경우 대체 처리
  if (!userInfo) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center cursor-pointer"
        onClick={toggleDropdown}
      >
        <img
          src={
            userProfileUrl && userProfileUrl !== "null"
              ? userProfileUrl
              : profileImage
          }
          alt="프로필"
          className="flex h-[41px] w-[41px] rounded-full"
        />
        <div className="flex flex-col items-center pl-[12px]">
          <p className="flex text-[#4B5563]">환영합니다</p>
          <p className="flex text-comment">{userName}님</p>
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[180px] h-[120px] bg-white rounded-md shadow-lg z-10 border border-gray-200 flex items-center">
          <ul className="w-full">
            <li className="px-4 py-2 hover:bg-gray-100 text-center">
              <Link
                to="/mypage"
                className="flex items-center justify-center pb-[10px]"
              >
                마이페이지
              </Link>
            </li>
            <li className="border-t border-gray-200 px-4 py-2 hover:bg-gray-100 text-center">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full text-red-500 pt-[10px]"
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
