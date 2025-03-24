// src/api/chatApi.ts
import { ChatRequest, ChatResponse, ErrorResponse } from "@/types/chat";
import axiosInstance from "@/api/axios";
import { AxiosError } from "axios";

export const sendChatMessage = async (
  request: ChatRequest
): Promise<ChatResponse> => {
  try {
    const response = await axiosInstance.post<ChatResponse>(
      "api/chat",
      request
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // 서버에서 반환한 에러 메시지 처리
      const serverError = error.response?.data as ErrorResponse;
      if (serverError) {
        throw new Error(serverError.message || "서버 오류가 발생했습니다");
      }
      // 네트워크 에러 처리
      throw new Error("서버 연결에 실패했습니다");
    }
    // 예상치 못한 에러 유형
    throw new Error("알 수 없는 오류가 발생했습니다");
  }
};
