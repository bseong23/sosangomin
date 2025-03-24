import React, { useEffect, useState } from "react";
import { BoardListResponse, BoardParams } from "@/features/board/types/board";
import {
  fetchNoticeList,
  fetchNoticePageCount
} from "@/features/board/api/noticeApi";
import BoardList from "@/features/board/components/boards/BoardList";
import Pagination from "@/components/common/Pagination";
import SearchBar from "@/components/common/SearchBar";
import Loading from "@/components/common/Loading";
import Banner from "@/features/board/components/boards/Banner";
import WriteButton from "@/features/board/components/boards/WriteButton";
import useAuthStore from "@/store/useAuthStore";

const Notice: React.FC = () => {
  const userInfo = useAuthStore();
  const userrole = userInfo.userInfo;
  const [noticeData, setNoticeData] = useState<BoardListResponse>({
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
    // API 연결 대신 더미 데이터를 사용
    const getNoticeList = async () => {
      setLoading(true);
      try {
        const [listResponse, totalPages] = await Promise.all([
          fetchNoticeList(params.page),
          fetchNoticePageCount()
        ]);

        setNoticeData({
          items: listResponse, // listResponse 자체가 items 배열입니다.
          totalCount: listResponse.length, // 배열의 길이를 totalCount로 사용
          currentPage: params.page, // 현재 페이지는 params에서 가져옵니다.
          totalPages: totalPages
        });
      } catch (error) {
        console.error("공지사항 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    getNoticeList();
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
            <div className="flex text-xl font-bold items-center">공지사항</div>

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
              <BoardList items={noticeData.items} boardType="notice" />
              {userrole?.userRole === "ADMIN" && (
                <div className="flex h-10 justify-end items-center pt-4">
                  <WriteButton boardType="notice" />
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <div></div>
          <Pagination
            currentPage={noticeData.currentPage}
            totalPages={noticeData.totalPages}
            onPageChange={handlePageChange}
          />
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
