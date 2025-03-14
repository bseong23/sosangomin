import React, { useState, useEffect } from "react";
import { BoardListProps } from "@/features/board/types/board";
import BoardItemComponent from "@/features/board/components/boards/BoardItemComponent";

const BoardList: React.FC<BoardListProps> = ({ items, boardType }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 화면 크기 변화 감지
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 초기 설정
    handleResize();

    // 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <table className="w-full h-65 border-collapse">
        <thead>
          <tr className="border-b border-t border-gray-300 ">
            {/* 모바일이 아닐 때만 No. 열 표시 */}
            {!isMobile && <th className="py-2 text-center">No.</th>}
            <th className="py-2 text-center">제목</th>
            <th className="py-2 text-center">글쓴이</th>
            <th className="py-2 text-center">작성시간</th>
            {/* 모바일이 아닐 때만 조회수 열 표시 */}
            {!isMobile && <th className="py-2 text-center">조회수</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <BoardItemComponent
              key={item.id}
              item={item}
              boardType={boardType}
              isMobile={isMobile} // isMobile 상태를 자식 컴포넌트로 전달
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BoardList;
