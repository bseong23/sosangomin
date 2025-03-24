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
    console.error("공지사항 페이지 수 조회 실패:", error);
    throw error;
  }
};

// 공지사항 등록
export const createNoticePost = async (data: {
  title: string;
  content: string;
}) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/api/notice`, data);
    return response.data;
  } catch (error) {
    console.error("게시글 작성 실패:", error);
    throw error;
  }
};

// 게시글 단일 조회
export const fetchNoticePost = async (noticeId: string) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/notice/${noticeId}`
    );
    return response.data;
  } catch (error) {
    console.error("게시글 조회 실패:", error);
    throw error;
  }
};

// 게시글 자격 확인
export const verifyNoticePost = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/api/notice/verify`);
    return response.data;
  } catch (error) {
    console.error("게시글 자격 확인 실패:", error);
    throw error;
  }
};

// 게시글 수정
export const updateNoticePost = async (
  noticeId: string,
  data: {
    title: string;
    content: string;
  }
) => {
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/api/notice/${noticeId}`,
      data,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};

// 게시글 삭제
export const deleteNoticePost = async (noticeId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${BASE_URL}/api/notice/${noticeId}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
};
