// src/components/common/Loading.tsx
import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  color = "#16125D"
}) => {
  // 크기에 따른 클래스 설정
  const sizeClass = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <svg
          className={`animate-spin ${sizeClass[size]}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill={color}
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-2 text-white font-medium">로딩 중...</p>
      </div>
    </div>
  );
};

export default Loading;
