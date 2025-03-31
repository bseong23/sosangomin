// src/api/chatApi.ts
import { ChatRequest, ChatResponse, ErrorResponse } from "@/types/chatbot";
import axiosInstance from "@/api/axios";
import { AxiosError } from "axios";

export const sendChatMessage = async (
  request: ChatRequest
): Promise<ChatResponse> => {
  try {
    const response = await axiosInstance.post<ChatResponse>(
      "/api/proxy/chat",
      request
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const statusCode = error.response?.status;
      const serverError = error.response?.data as ErrorResponse;

      switch (statusCode) {
        case 400:
          throw new Error(serverError.message || "잘못된 채팅 요청입니다");
        case 404:
          throw new Error(
            serverError.message || "챗봇 서비스를 찾을 수 없습니다"
          );
        case 500:
          throw new Error(
            serverError.message || "챗팅 처리 중 오류가 발생했습니다"
          );
        default:
          throw new Error(serverError.message || "서버 오류가 발생했습니다");
      }
    }
    // 네트워크 에러 처리
    throw new Error("서버 연결에 실패했습니다");
  }
};
