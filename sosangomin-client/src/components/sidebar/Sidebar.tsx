import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuGroup } from "@/types/sidebar";
import { isSidebarItemActive } from "@/utils/curlocation";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isCommunityPath = currentPath.startsWith("/community");
  const isDataAnalysisPath = currentPath.startsWith("/data-analysis");

  const communityMenu: MenuGroup = {
    label: "커뮤니티",
    items: [
      { label: "공지사항", path: "/community/notice" },
      { label: "최신 뉴스", path: "/community/news" },
      { label: "자유게시판", path: "/community/board" }
    ]
  };

  const dataAnalysisMenu: MenuGroup = {
    label: "데이터 분석",
    items: [
      { label: "데이터 입력하기", path: "/data-analysis/upload" },
      { label: "한눈에 보기", path: "/data-analysis/research" },
      { label: "분석리포트 보기", path: "/data-analysis/insight" },
      { label: "리뷰 분석하기", path: "/data-analysis/review-insight" },
      { label: "고민해결", path: "/data-analysis/advise" }
    ]
  };

  // 현재 경로에 따라 표시할 메뉴 결정
  const menuToShow = isCommunityPath
    ? communityMenu
    : isDataAnalysisPath
    ? dataAnalysisMenu
    : null;

  if (!menuToShow) return null;

  return (
    <div className="sidebar border-r border-gray-300 w-[200px] bg-white">
      <div className="menu-group pt-[100px] pl-[44px] font-inter fixed">
        <ul>
          {menuToShow.items.map((item, index) => (
            <li key={index} className="py-[10px]">
              <Link
                to={item.path}
                className={`text-[#333333] ${
                  isSidebarItemActive(currentPath, item.path)
                    ? "font-extrabold"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
