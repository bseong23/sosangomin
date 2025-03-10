// import React, { useEffect, useState } from "react";
// import { BoardListResponse, BoardParams } from "@/types/board";
// import { fetchBoardList } from "@/api/boardApi";
// import BoardList from "@/components/boards/BoardList";
// import Pagination from "@/components/common/Pagination";
// import SearchBar from "@/components/common/SearchBar";
// import WriteButton from "@/components/boards/WriteButton";
// import Loading from "@/components/common/Loading";
// const Board: React.FC = () => {
//   const [boardData, setBoardData] = useState<BoardListResponse>({
//     items: [],
//     totalCount: 0,
//     currentPage: 1,
//     totalPages: 1
//   });
//   const [params, setParams] = useState<BoardParams>({
//     page: 1,
//     limit: 10
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getBoardList = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchBoardList(params);
//         setBoardData(data);
//       } catch (error) {
//         console.error("게시판 로딩 실패:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getBoardList();
//   }, [params]);

//   const handlePageChange = (page: number) => {
//     setParams((prev) => ({ ...prev, page }));
//   };

//   const handleSearch = (keyword: string) => {
//     setParams((prev) => ({ ...prev, page: 1, search: keyword }));
//   };

//   return (
// <div className="flex flex-col items-center justify-center w-full max-w-[1000px] mx-auto py-8">
//       <div className="w-full">
//         <h1 className="text-2xl font-bold mb-6">자유게시판</h1>

//         <div className="flex justify-end mb-4">
//           <SearchBar
//             onSearch={handleSearch}
//             placeholder="검색어를 입력하세요"
//           />
//         </div>

//         {loading ? (
//           <div className="flex justify-center">
//             <Loading />
//           </div>
//         ) : (
//           <>
//             <BoardList items={boardData.items} boardType="board" />
//             <div className="flex justify-between mt-4">
//               <div></div>
//               <Pagination
//                 currentPage={boardData.currentPage}
//                 totalPages={boardData.totalPages}
//                 onPageChange={handlePageChange}
//               />
//               <WriteButton boardType="board" />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Board;

import React, { useEffect, useState } from "react";
import { BoardItem, BoardListResponse, BoardParams } from "@/types/board";
// import { fetchBoardList } from "@/api/boardApi";
import BoardList from "@/components/boards/BoardList";
import Pagination from "@/components/common/Pagination";
import SearchBar from "@/components/common/SearchBar";
import WriteButton from "@/components/boards/WriteButton";
import Loading from "@/components/common/Loading";
import Banner from "@/components/boards/Banner";

const Board: React.FC = () => {
  // 더미 데이터 생성
  const dummyData: BoardItem[] = [
    {
      id: 1,
      title: "게시판 사용 수칙",
      author: "관리자",
      createdAt: "57분전",
      viewCount: 78,
      likeCount: 0,
      isNew: true
    },
    {
      id: 10,
      title: "진심희서 물 픈다",
      author: "관리자",
      createdAt: "57분전",
      viewCount: 17,
      likeCount: 0
    },
    {
      id: 9,
      title: "네이버 댓글 관리하세요~",
      author: "관리자",
      createdAt: "57분전",
      viewCount: 3,
      likeCount: 0
    },
    {
      id: 8,
      title: "더운에 좋은 위치 알려줍니다",
      author: "관리자",
      createdAt: "57분전",
      viewCount: 3,
      likeCount: 0
    },
    {
      id: 7,
      title: "2월 26일 공지사항",
      author: "관리자",
      createdAt: "57분전",
      viewCount: 3,
      likeCount: 0
    }
  ];

  const [boardData, setBoardData] = useState<BoardListResponse>({
    items: dummyData,
    totalCount: dummyData.length,
    currentPage: 1,
    totalPages: 10
  });
  const [params, setParams] = useState<BoardParams>({
    page: 1,
    limit: 10
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // API 연결 대신 더미 데이터를 사용
    const getBoardList = async () => {
      setLoading(true);
      try {
        // API 호출 대신 더미 데이터 설정
        // 검색 기능 시뮬레이션
        let filteredData = [...dummyData];
        if (params.search) {
          filteredData = dummyData.filter((item) =>
            item.title.toLowerCase().includes(params.search!.toLowerCase())
          );
        }

        setTimeout(() => {
          setBoardData({
            items: filteredData,
            totalCount: filteredData.length,
            currentPage: params.page,
            totalPages: 10
          });
          setLoading(false);
        }); // 로딩 효과를 위한 지연
      } catch (error) {
        console.error("게시판 로딩 실패:", error);
        setLoading(false);
      }
    };

    getBoardList();
  }, [params]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSearch = (keyword: string) => {
    setParams((prev) => ({ ...prev, page: 1, search: keyword }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[1000px] mx-auto py-8 font-inter">
      <Banner />
      <div className="w-full">
        <div className="h-[700px] mx-auto">
          <div className="flex justify-between pb-[20px]">
            <div className="flex text-2xl font-bold items-center">
              자유게시판
            </div>

            <div className="flex justify-end items-center">
              <SearchBar onSearch={handleSearch} placeholder="" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center pb-[445px]">
              <Loading />
            </div>
          ) : (
            <>
              <BoardList items={boardData.items} boardType="board" />
              <div className="flex h-[37.5px] justify-end items-center pt-[15px]">
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
