import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuGroup } from "@/types/sidebar";
import { isSidebarItemActive } from "@/utils/curlocation";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isCommunityPath = currentPath.startsWith("/community");
  const isDataAnalysisPath = currentPath.startsWith("/data-analysis");
  const isReviewPath = currentPath.startsWith("/review");

  const communityMenu: MenuGroup = {
    label: "커뮤니티",
    items: [
      { label: "공지사항", path: "/community/notice" },
      { label: "최신 뉴스", path: "/community/news" },
      { label: "자유게시판", path: "/community/board" }
    ]
  };

  const reviewMenu: MenuGroup = {
    label: "리뷰",
    items: [
      { label: "가게 분석", path: "/review/store" },
      { label: "비교 분석", path: "/review/compare" }
    ]
  };
  const dataAnalysisMenu: MenuGroup = {
    label: "데이터 분석",
    items: [
      { label: "데이터 입력하기", path: "/data-analysis/upload" },
      { label: "한눈에 보기", path: "/data-analysis/research" }
    ]
  };

  // 현재 경로에 따라 표시할 메뉴 결정
  const menuToShow = isCommunityPath
    ? communityMenu
    : isDataAnalysisPath
    ? dataAnalysisMenu
    : isReviewPath
    ? reviewMenu
    : null;

  if (!menuToShow) return null;

  return (
    <div className="border-r border-gray-300 w-[200px] bg-white">
      <div className="pt-[100px] pl-[44px] fixed">
        <ul>
          {menuToShow.items.map((item, index) => (
            <li key={index} className="py-[10px]">
              <Link
                to={item.path}
                className={`text-comment hover:text-blue-900 ${
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
