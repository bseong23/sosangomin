import React from "react";
import { Link } from "react-router-dom";
import { SideItem } from "@/types/layout";

interface SidebarMenuItemProps {
  item: SideItem;
  toggleMenu: (title: string) => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  toggleMenu
}) => {
  // 하위 메뉴가 하나만 있는지 확인
  const hasSingleChild = item.children && item.children.length === 1;

  return (
    <div className="mb-4">
      <button
        onClick={() => toggleMenu(item.title)}
        className="w-full flex justify-between items-center text-white py-2"
      >
        <span>{item.title}</span>
        {/* 하위 메뉴가 여러 개일 때만 화살표 표시 */}
        {!hasSingleChild && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform ${
              item.isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {/* 하위 메뉴가 여러 개이고 열려 있을 때만 표시 */}
      {item.isOpen && item.children && item.children.length > 1 && (
        <div className="mt-2 pl-4 space-y-2">
          {item.children.map((child, index) => (
            <Link
              key={index}
              to={child.path || "#"}
              className="block text-white py-1"
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;
