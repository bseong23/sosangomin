import React from "react";
import { Link } from "react-router-dom";
import { BoardItemProps } from "@/features/board/types/board";

const BoardItemComponent: React.FC<BoardItemProps> = ({ item, boardType }) => {
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-100">
      <td className="py-2 text-center">{item.id}</td>
      <td className="py-2">
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
      <td className="py-2 text-center">{item.author}</td>
      <td className="py-2 text-center">{item.createdAt}</td>
      <td className="py-2 text-center">{item.viewCount}</td>
      <td className="py-2 text-center">{item.likeCount}</td>
    </tr>
  );
};

export default BoardItemComponent;
