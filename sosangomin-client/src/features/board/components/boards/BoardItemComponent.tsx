import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BoardItemProps } from "@/features/board/types/board";

const BoardItemComponent: React.FC<BoardItemProps> = ({ item, boardType }) => {
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

  // 모바일 환경에서 제목 길이 제한
  const displayTitle =
    isMobile && item.title.length > 10
      ? `${item.title.substring(0, 10)}...`
      : item.title;

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-100">
      {/* 모바일이 아닐 때만 ID 열 표시 */}
      {!isMobile && <td className="py-2 text-center px-2">{item.id}</td>}
      <td className="py-2 px-2">
        <Link
          to={`/community/${boardType}/post/${item.id}`}
          className="flex items-center"
          title={item.title} // 전체 제목을 툴팁으로 표시
        >
          {displayTitle}
          {item.isNew && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1 rounded">
              N
            </span>
          )}
        </Link>
      </td>
      <td className="py-2 px-2 text-center">{item.author}</td>
      <td className="py-2 px-2 text-center">{item.createdAt}</td>
      {/* 모바일이 아닐 때만 조회수 열 표시 */}
      {!isMobile && <td className="py-2 px-2 text-center">{item.viewCount}</td>}
    </tr>
  );
};

export default BoardItemComponent;
