import React, { useState, useEffect } from "react";
import { SideItem } from "@/types/layout";
import SidebarMenuItem from "@/components/sidebar/SidebarMenuItem";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;
}

const MobileSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [menuItems, setMenuItems] = useState<SideItem[]>([
    {
      title: "서비스 소개",
      isOpen: false,
      children: [
        { title: "데이터 분석", path: "/service/intro" },
        { title: "상권 분석", path: "/service/intro" }
      ]
    },
    {
      title: "데이터 분석",
      isOpen: false,
      children: [
        { title: "데이터 입력하기", path: "/data-analysis/upload" },
        { title: "한눈에 보기", path: "/data-analysis/research" },
        { title: "분석리포트 보기", path: "/data-analysis/insight" },
        { title: "리뷰 분석하기", path: "/data-analysis/review-insight" },
        { title: "고민해결", path: "/data-analysis/advise" }
      ]
    },
    {
      title: "상권 분석",
      isOpen: false,
      children: [{ title: "상권 분석", path: "/map" }]
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
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.title === title ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out bg-[#181E4B] w-64 z-30 overflow-y-auto`}
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
        <Link to="/login" className="text-white hover:underline">
          로그인
        </Link>
      </div>

      <div className="px-4 py-6">
        {menuItems.map((item, index) => (
          <SidebarMenuItem key={index} item={item} toggleMenu={toggleMenu} />
        ))}
      </div>

      <div className="absolute bottom-0 w-full p-4 text-white text-center text-sm">
        © 2025 소상공인. All rights reserved.
      </div>
    </div>
  );
};

export default MobileSidebar;
