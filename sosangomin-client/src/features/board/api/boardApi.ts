import axios from "axios";
import { BoardItem, PageCountResponse } from "@/features/board/types/board";

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export const fetchBoardList = async (pageNum: number): Promise<BoardItem[]> => {
  try {
    const response = await axios.get<BoardItem[]>(
      `${BASE_URL}/api/board/page/${pageNum}`
    );
    return response.data;
  } catch (error) {
    console.error("게시판 목록 조회 실패:", error);
    throw error;
  }
};

export const fetchBoardPageCount = async (): Promise<number> => {
  try {
    // 카테고리 정보를 쿼리 파라미터로 전달
    const response = await axios.get<PageCountResponse>(
      `${BASE_URL}/api/board/page_count`
    );
    return response.data.pageCount;
  } catch (error) {
    console.error("게시판 페이지 수 조회 실패:", error);
    throw error;
  }
};

export const createBoardPost = async (data: {
  title: string;
  content: string;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/community/board`, data);
    return response.data;
  } catch (error) {
    console.error("게시글 작성 실패:", error);
    throw error;
  }
};

// 게시글 단일 조회
export const fetchBoardPost = async (postId: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/community/board/post/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error("게시글 조회 실패:", error);
    throw error;
  }
};

// 게시글 수정
export const updateBoardPost = async (
  postId: string,
  data: {
    title: string;
    content: string;
  }
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/community/board/${postId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};

// 게시글 삭제
export const deleteBoardPost = async (postId: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/community/board/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
};
