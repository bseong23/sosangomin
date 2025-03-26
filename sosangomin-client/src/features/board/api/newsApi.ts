// newsApi.ts 파일 수정
import {
  NewsParams,
  NewsListResponse,
  NewsPageCountResponse
} from "@/features/board/types/news";
import axiosInstance from "@/api/axios";
import { NewsItem } from "@/features/board/types/news";

const API_URL = import.meta.env.VITE_API_SERVER_URL || "";

export const fetchNewsList = async (
  params: NewsParams
): Promise<NewsItem[] | NewsListResponse> => {
  try {
    // 페이지 번호와 카테고리 추출
    const { page = 1, category = "all", ...otherParams } = params;

    // URL 경로에 페이지 번호 포함, 카테고리는 쿼리 파라미터로 전달
    const response = await axiosInstance.get(
      `${API_URL}/api/news/page/${page}?category=${category}`,
      { params: otherParams }
    );
    return response.data;
  } catch (error) {
    console.error("뉴스 목록 조회 실패:", error);
    throw error;
  }
};

// 뉴스 페이지 수 조회 API - URL 형식 수정
export const fetchNewsPageCount = async (
  category: string = "all"
): Promise<number> => {
  try {
    // 카테고리 정보를 쿼리 파라미터로 전달
    const response = await axiosInstance.get<NewsPageCountResponse>(
      `${API_URL}/api/news/page_count?category=${category}`
    );
    return response.data.pageCount;
  } catch (error) {
    console.error("뉴스 페이지 수 조회 실패:", error);
    throw error;
  }
};
