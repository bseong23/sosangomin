// features/analysis/api/analysisApi.ts
import axiosInstance from "@/api/axios";
import {
  AnalysisRequest,
  AnalysisResult,
  ErrorResponse,
  ApiResponse
} from "../types/analysis";

/**
 * 종합 데이터 분석 API 호출
 * @param params 분석 요청 매개변수
 * @returns 분석 결과 혹은 에러 응답
 */
export const performAnalysis = async (
  params: AnalysisRequest
): Promise<ApiResponse<AnalysisResult>> => {
  try {
    const response = await axiosInstance.post<AnalysisResult>(
      "/api/proxy/analysis",
      params
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorResponse;
    }
    return {
      error: "분석 요청 중 오류가 발생했습니다",
      message: "ERR_ANALYSIS_REQUEST_FAILED"
    };
  }
};

/**
 * 특정 분석 ID에 대한 결과 조회
 * @param analysisId 분석 결과 ID
 * @returns 분석 결과 혹은 에러 응답
 */
export const getAnalysisResult = async (
  analysisId: string
): Promise<ApiResponse<AnalysisResult>> => {
  try {
    const response = await axiosInstance.get<AnalysisResult>(
      `/api/proxy/analysis/${analysisId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorResponse;
    }
    return {
      error: "분석 결과 조회 중 오류가 발생했습니다",
      message: "ERR_ANALYSIS_RESULT_FETCH_FAILED"
    };
  }
};

/**
 * 최신 분석 결과 조회
 * @param sourceId 데이터소스 ID
 * @returns 분석 결과 혹은 에러 응답
 */
export const getLatestAnalysisResult = async (
  sourceId: string
): Promise<ApiResponse<AnalysisResult>> => {
  try {
    const response = await axiosInstance.get<AnalysisResult>(
      "/api/proxy/analysis/latest",
      {
        params: { sourceId }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorResponse;
    }
    return {
      error: "최신 분석 결과 조회 중 오류가 발생했습니다",
      message: "ERR_LATEST_ANALYSIS_FETCH_FAILED"
    };
  }
};
