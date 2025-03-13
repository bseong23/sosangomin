import React from "react";
import { BoardListProps } from "@/types/board";
import BoardItemComponent from "@/components/boards/BoardItemComponent";

const BoardList: React.FC<BoardListProps> = ({ items, boardType }) => {
  return (
    <div className="w-full">
      <table className="w-full h-[250px] border-collapse pt-[20px]">
        <thead>
          <tr className="border-b border-t border-gray-300 ">
            <th className="py-[6px]text-center">No.</th>
            <th className="py-[6px] text-center">제목</th>
            <th className="py-[6px] text-center">글쓴이</th>
            <th className="py-[6px] text-center">작성시간</th>
            <th className="py-[6px] text-center">조회수</th>
            <th className="py-[6px] text-center">좋아요</th>
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
