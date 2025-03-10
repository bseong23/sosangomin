import React from "react";
import { Link } from "react-router-dom";
import { BoardItemProps } from "@/types/board";

const BoardItemComponent: React.FC<BoardItemProps> = ({ item, boardType }) => {
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-100">
      <td className="py-[6px] text-center">{item.id}</td>
      <td className="py-[6px]">
        <Link
          to={`/community/${boardType}/post/${item.id}`}
          className="flex items-center"
        >
          {item.title}
          {item.isNew && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1 rounded">
              N
            </span>
          )}
        </Link>
      </td>
      <td className="py-[6px] text-center text-[15px]">{item.author}</td>
      <td className="py-[6px] text-center text-[15px]">{item.createdAt}</td>
      <td className="py-[6px] text-center text-[15px]">{item.viewCount}</td>
      <td className="py-[6px] text-center text-[15px]">{item.likeCount}</td>
    </tr>
  );
};

export default BoardItemComponent;
