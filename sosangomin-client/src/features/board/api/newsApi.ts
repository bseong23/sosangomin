import axios from "axios";
import { NewsParams, NewsListResponse } from "@/features/board/types/news";

const BASE_URL = "/api";

export const fetchNewsList = async (
  params: NewsParams
): Promise<NewsListResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/community/news`, { params });
    return response.data;
  } catch (error) {
    console.error("뉴스 목록 조회 실패:", error);
    throw error;
  }
};
