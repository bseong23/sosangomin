import React, { useState, useEffect } from "react";
import { SideItem } from "@/types/layout";
import SidebarMenuItem from "@/components/sidebar/SidebarMenuItem";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { getAccessToken, clearAuthData } from "@/features/auth/api/userStorage";
import profileImage from "@/assets/profileImage.svg";
import { SidebarProps } from "@/types/sidebar";
import useStoreStore from "@/store/storeStore";
const MobileSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  // Zustand 스토어에서 유저 정보 가져오기
  const { userInfo } = useAuthStore();

  // 액세스 토큰 확인
  const token = getAccessToken();

  // 로그아웃 처리
  const handleLogout = () => {
    const resetStore = useStoreStore.getState().resetStore;
    clearAuthData();
    resetStore();
    window.location.href = "/";
  };

  const [menuItems, setMenuItems] = useState<SideItem[]>([
    {
      title: "데이터 분석",
      isOpen: false,
      children: [
        { title: "데이터 입력하기", path: "/data-analysis/upload" },
        { title: "한눈에 보기", path: "/data-analysis/research" }
      ]
    },
    {
      title: "리뷰 분석",
      isOpen: false,
      children: [
        { title: "가게 분석", path: "/review/store" },
        { title: "비교 분석", path: "/review/compare" }
      ]
    },
    {
      title: "상권 분석",
      isOpen: false,
      children: [{ title: "상권 분석", path: "/map" }]
    },
    {
      title: "종합 분석",
      isOpen: false,
      children: [{ title: "종합 분석", path: "/result" }]
    },
    {
      title: "커뮤니티",
      isOpen: false,
      children: [
        { title: "공지사항", path: "/community/notice" },
        { title: "최신 뉴스", path: "/community/news" },
        { title: "자유 게시판", path: "/community/board" }
      ]
    }
  ]);

  // 사이드바가 닫혔다가 다시 열릴 때 모든 메뉴 항목 닫기
  useEffect(() => {
    if (!isOpen) {
      // 사이드바가 닫힐 때 모든 메뉴 항목을 닫힌 상태로 리셋
      setMenuItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          isOpen: false
        }))
      );
    }
  }, [isOpen]);

  const toggleMenu = (title: string) => {
    const menuItem = menuItems.find((item) => item.title === title);

    // 하위 메뉴가 하나만 있는 경우 직접 해당 경로로 이동
    if (menuItem && menuItem.children && menuItem.children.length === 1) {
      const path = menuItem.children[0].path;
      if (path) {
        if (toggleSidebar) toggleSidebar(); // 사이드바 닫기
        navigate(path);
      }
      return;
    }

    // 다른 열린 메뉴 닫고 현재 메뉴만 토글
    setMenuItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isOpen: item.title === title ? !item.isOpen : false
      }))
    );
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out bg-[#181E4B] w-64 z-30 overflow-y-auto flex flex-col`}
    >
      <div className="flex justify-between items-center p-4">
        <button
          onClick={toggleSidebar}
          className="text-white p-2 hover:bg-blue-900 rounded-full transition-colors"
          aria-label="닫기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* 로그인/로그아웃 버튼 */}
        {token && userInfo ? (
          <button
            onClick={handleLogout}
            className="text-white p-2 cursor-pointer rounded-full transition-colors"
            aria-label="로그아웃"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        ) : (
          <Link
            to="/login"
            className="text-white text-sm font-medium hover:text-blue-300 transition-colors"
          >
            로그인
          </Link>
        )}
      </div>

      {/* 로그인 상태에 따라 다른 UI 표시 */}
      {token && userInfo ? (
        <div className="px-4 py-3">
          <Link to="/mypage">
            <div className="flex items-center">
              <img
                src={
                  userInfo.userProfileUrl && userInfo.userProfileUrl !== "null"
                    ? userInfo.userProfileUrl
                    : profileImage
                }
                alt="프로필"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-white text-base font-medium">환영합니다</p>
                <p className="text-white text-base font-medium">
                  {userInfo.userName}님
                </p>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <div className="px-4 py-3"></div>
      )}

      <div className="px-4 py-10 flex-grow">
        {menuItems.map((item, index) => (
          <SidebarMenuItem key={index} item={item} toggleMenu={toggleMenu} />
        ))}
      </div>

      <div className="w-full p-4 text-white text-center text-sm mt-auto border-t border-gray-700">
        © 2025 소상공인. All rights reserved.
      </div>
    </div>
  );
};

export default MobileSidebar;
