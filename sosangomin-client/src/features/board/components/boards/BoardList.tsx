import React from "react";
import { BoardListProps } from "@/features/board/types/board";
import BoardItemComponent from "@/features/board/components/boards/BoardItemComponent";

const BoardList: React.FC<BoardListProps> = ({ items, boardType }) => {
  return (
    <div className="w-full">
      <table className="w-full h-65 border-collapse">
        <thead>
          <tr className="border-b border-t border-gray-300 ">
            <th className="py-2 text-center">No.</th>
            <th className="py-2 text-center">제목</th>
            <th className="py-2 text-center">글쓴이</th>
            <th className="py-2 text-center">작성시간</th>
            <th className="py-2 text-center">조회수</th>
            <th className="py-2 text-center">좋아요</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <BoardItemComponent
              key={item.id}
              item={item}
              boardType={boardType}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardList;
