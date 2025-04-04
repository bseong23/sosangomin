// 종합분석 보고서 관련 API 요청 함수 정의

import axios from "axios";
import axiosInstance from "@/api/axios";
import {
  CreateFinalReportRequest,
  CreateFinalReportResponse,
  GetFinalReportResponse,
  GetFinalReportListResponse,
  ErrorResponse
} from "../types/finalReport";

const finalReportApi = {
  // 매장의 종합 SWOT 분석 보고서 생성
  createFinalReport: async (
    data: CreateFinalReportRequest
  ): Promise<CreateFinalReportResponse> => {
    try {
      const response = await axiosInstance.post<CreateFinalReportResponse>(
        "/api/proxy/final-reports",
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw new Error("보고서 생성 중 오류가 발생했습니다");
    }
  },

  // 특정 SWOT 분석 보고서 상세 조회
  getFinalReport: async (reportId: string): Promise<GetFinalReportResponse> => {
    try {
      const response = await axiosInstance.get<GetFinalReportResponse>(
        `/api/proxy/final-reports/${reportId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw new Error("보고서 조회 중 오류가 발생했습니다");
    }
  },

  // 매장의 모든 SWOT 분석 보고서 목록 조회
  getFinalReportList: async (
    storeId: string
  ): Promise<GetFinalReportListResponse> => {
    try {
      const response = await axiosInstance.get<GetFinalReportListResponse>(
        `/api/proxy/final-reports/list/${storeId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw new Error("보고서 목록 조회 중 오류가 발생했습니다");
    }
  }
};

export default finalReportApi;
