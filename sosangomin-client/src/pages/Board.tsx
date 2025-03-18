// Board.tsx
import React, { useEffect, useState } from "react";
import { BoardListResponse, BoardParams } from "@/features/board/types/board";
import {
  fetchBoardList,
  fetchBoardPageCount
} from "@/features/board/api/boardApi";
import BoardList from "@/features/board/components/boards/BoardList";
import Pagination from "@/components/common/Pagination";
import SearchBar from "@/components/common/SearchBar";
import WriteButton from "@/features/board/components/boards/WriteButton";
import Loading from "@/components/common/Loading";
import Banner from "@/features/board/components/boards/Banner";

const Board: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardListResponse>({
    items: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  });

  const [params, setParams] = useState<BoardParams>({
    page: 1,
    limit: 10,
    search: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBoardList = async () => {
      setLoading(true);
      try {
        const [listResponse, totalPages] = await Promise.all([
          fetchBoardList(params.page),
          fetchBoardPageCount()
        ]);

        setBoardData({
          items: listResponse, // listResponse 자체가 items 배열입니다.
          totalCount: listResponse.length, // 배열의 길이를 totalCount로 사용
          currentPage: params.page, // 현재 페이지는 params에서 가져옵니다.
          totalPages: totalPages
        });
      } catch (error) {
        console.error("게시판 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getBoardList();
  }, [params.page]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (keyword: string) => {
    setParams((prev) => ({ ...prev, page: 1, search: keyword }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[1000px] mx-auto py-8 px-3">
      <Banner />
      <div className="w-full">
        <div className="h-full mx-auto">
          <div className="flex justify-between pb-5">
            <div className="flex text-xl font-bold items-center">
              자유게시판
            </div>
            <div className="flex justify-end items-center">
              <SearchBar onSearch={handleSearch} placeholder="" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : (
            <>
              <BoardList items={boardData.items} boardType="board" />
              <div className="flex h-10 justify-end items-center pt-4">
                <WriteButton boardType="board" />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <div></div>
          <Pagination
            currentPage={boardData.currentPage}
            totalPages={boardData.totalPages}
            onPageChange={handlePageChange}
          />
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Board;
