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
  return (
    <div className="mb-4">
      <button
        onClick={() => toggleMenu(item.title)}
        className="w-full flex justify-between items-center text-white py-2"
      >
        <span>{item.title}</span>
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
      </button>

      {item.isOpen && item.children && (
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
