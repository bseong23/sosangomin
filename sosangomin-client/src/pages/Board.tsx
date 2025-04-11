import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BoardListResponse, BoardParams } from "@/features/board/types/board";
import {
  fetchBoardList,
  fetchBoardPageCount
} from "@/features/board/api/boardApi";
import BoardList from "@/features/board/components/boards/BoardList";
import Pagination from "@/components/common/Pagination";
import WriteButton from "@/features/board/components/boards/WriteButton";
import Loading from "@/components/common/Loading";
import Banner from "@/features/board/components/boards/Banner";

const Board: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [boardData, setBoardData] = useState<BoardListResponse>({
    items: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  });

  const [params, setParams] = useState<BoardParams>({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    search: searchParams.get("search") || ""
  });

  const [loading, setLoading] = useState(false);

  // URL 파라미터가 변경될 때 params 상태 업데이트
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";

    setParams({
      page,
      limit: 10,
      search
    });
  }, [searchParams]);

  // params가 변경될 때 데이터 불러오기
  useEffect(() => {
    const getBoardList = async () => {
      setLoading(true);
      try {
        const [listResponse, totalPages] = await Promise.all([
          fetchBoardList(params.page), // search 파라미터도 전달
          fetchBoardPageCount() // search 파라미터도 전달
        ]);

        setBoardData({
          items: listResponse,
          totalCount: listResponse.length,
          currentPage: params.page,
          totalPages: totalPages
        });
      } catch (error) {
        console.error("게시판 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getBoardList();
  }, [params.page, params.search]); // search 파라미터도 의존성에 추가

  const handlePageChange = (page: number) => {
    setSearchParams({
      page: page.toString(),
      search: params.search || ""
    });
    window.scrollTo(0, 0);
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
