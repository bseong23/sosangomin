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

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-100">
      {!isMobile && <td className="py-2 text-center px-2">{item.boardId}</td>}
      <td className="py-2 px-2">
        <Link
          to={`/community/${boardType}/post/${item.boardId}`}
          className="flex items-center pl-1"
          title={item.title}
        >
          {displayTitle}
          {item.isNew && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1 rounded">
              N
            </span>
          )}
        </Link>
      </td>
      <td className="py-2 px-2 text-center">{item.name}</td>
      <td className="py-2 px-2 text-center">{item.createdAt}</td>
      {!isMobile && <td className="py-2 px-2 text-center">{item.views}</td>}
    </tr>
  );
};

export default BoardItemComponent;
