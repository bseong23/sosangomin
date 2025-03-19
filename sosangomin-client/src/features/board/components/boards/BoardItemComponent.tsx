// BoardItemComponent.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BoardItemProps } from "@/features/board/types/board";

const BoardItemComponent: React.FC<BoardItemProps> = ({ item, boardType }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayTitle =
    isMobile && item.title.length > 10
      ? `${item.title.substring(0, 10)}...`
      : item.title;

  // 시간 계산 함수
  const getTimeDisplay = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffMs = now.getTime() - createdDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    // 1시간 이내
    if (diffHours < 1) {
      return `${diffMinutes}분 전`;
    }
    // 24시간 이내
    else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    }
    // 24시간 이상
    else {
      return createdAt.split("T")[0].replace(/-/g, ".");
    }
  };

  // 24시간 이내인지 확인하여 NEW 표시 여부 결정
  const isNew = () => {
    const now = new Date();
    const createdDate = new Date(item.createdAt);

    // 날짜만 비교 (시간 제외)
    return (
      now.getFullYear() === createdDate.getFullYear() &&
      now.getMonth() === createdDate.getMonth() &&
      now.getDate() === createdDate.getDate()
    );
  };

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-100">
      <td className="py-2 px-2">
        <Link
          to={`/community/${boardType}/post/${item.boardId}`}
          className="flex items-center pl-1"
          title={item.title}
        >
          {displayTitle}
          {isNew() && (
            <span className=" ml-2 bg-red-500 text-white px-1 rounded text-[10px]">
              N
            </span>
          )}
        </Link>
      </td>
      <td className="py-2 px-2 text-center">{item.name}</td>
      <td className="py-2 px-2 text-center">
        {getTimeDisplay(item.createdAt)}
      </td>
      {!isMobile && <td className="py-2 px-2 text-center">{item.views}</td>}
    </tr>
  );
};

export default BoardItemComponent;
