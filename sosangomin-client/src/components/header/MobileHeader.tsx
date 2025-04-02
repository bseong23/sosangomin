import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/assets/Logo.svg";

interface HeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="flex bg-white shadow-sm py-4 px-6 justify-between items-center z-4 relative">
      <Link to="/" className="text-indigo-900 font-bold text-xl">
        <img src={Logo} alt="로고" className="w-30 h-10 cursor-pointer" />
      </Link>
      <button
        onClick={toggleSidebar}
        className="text-gray-700 focus:outline-none"
        aria-label="메뉴 열기"
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </header>
  );
};

export default MobileHeader;
