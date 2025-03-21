import axiosInstance from "@/api/axios";
import axios from "axios";
import { BoardItem, PageCountResponse } from "@/features/board/types/board";
import { getAccessToken } from "@/features/auth/api/userStorage";

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

// 게시글 등록
export const createBoardPost = async (data: {
  title: string;
  content: string;
}) => {
  try {
    // const token = getAccessToken();
    const response = await axiosInstance.post(`${BASE_URL}/api/board`, data);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("게시글 작성 실패:", error);
    throw error;
  }
};

// 게시글 단일 조회
export const fetchBoardPost = async (boardId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error("게시글 조회 실패:", error);
    throw error;
  }
};

// 게시글 자격 확인
export const verifyBoardPost = async (boardId: string) => {
  try {
    const token = getAccessToken();
    const response = await axios.get(
      `${BASE_URL}/api/board/${boardId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("게시글 자격 확인 실패:", error);
    throw error;
  }
};

// 게시글 수정
export const updateBoardPost = async (
  boardId: string,
  data: {
    title: string;
    content: string;
  }
) => {
  try {
    const token = getAccessToken();
    const response = await axios.put(`${BASE_URL}/api/board/${boardId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};

// 게시글 삭제
export const deleteBoardPost = async (boardId: string) => {
  try {
    const token = getAccessToken();
    const response = await axios.delete(`${BASE_URL}/api/board/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
};
