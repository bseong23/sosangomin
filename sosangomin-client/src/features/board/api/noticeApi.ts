import axios from "axios";
import { BoardParams, BoardListResponse } from "@/features/board/types/board";

const BASE_URL = import.meta.env.VITE_API_SERVER_URL;

export const fetchNoticeList = async (
  params: BoardParams
): Promise<BoardListResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/community/notice`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error("공지사항 목록 조회 실패:", error);
    throw error;
  }
};
