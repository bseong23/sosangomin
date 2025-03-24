import axiosInstance from "@/api/axios";
import { BoardItem, PageCountResponse } from "@/features/board/types/board";

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export const fetchNoticeList = async (
  pageNum: number
): Promise<BoardItem[]> => {
  try {
    const response = await axiosInstance.get<BoardItem[]>(
      `${BASE_URL}/api/notice/page/${pageNum}`
    );
    return response.data;
  } catch (error) {
    console.error("공지사항 목록 조회 실패:", error);
    throw error;
  }
};

export const fetchNoticePageCount = async (): Promise<number> => {
  try {
    // 카테고리 정보를 쿼리 파라미터로 전달
    const response = await axiosInstance.get<PageCountResponse>(
      `${BASE_URL}/api/notice/page_count`
    );
    return response.data.pageCount;
  } catch (error) {
    console.error("공지사항항 페이지 수 조회 실패:", error);
    throw error;
  }
};
