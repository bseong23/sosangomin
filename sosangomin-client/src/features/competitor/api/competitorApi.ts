import axiosInstance from "@/api/axios";
import {
  CompetitorAnalysisRequest,
  CompetitorAnalysisResponse,
  CompetitorComparisonListResponse,
  CompetitorComparisonResultResponse
} from "../types/competitor";

/**
 * 경쟁사 분석 요청 API
 * @param data 경쟁사 분석 요청 데이터 (body)
 * @returns 경쟁사 분석 결과
 */
export const requestCompetitorAnalysis = async (
  data: CompetitorAnalysisRequest
): Promise<CompetitorAnalysisResponse> => {
  try {
    const response = await axiosInstance.post<CompetitorAnalysisResponse>(
      "/api/proxy/competitor/analysis",
      data, // params 대신 body로 직접 전달
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // API 응답 로그 기록 (디버깅용)

    return response.data;
  } catch (error) {
    console.error("경쟁사 분석 요청 오류:", error);
    throw error;
  }
};

/**
 * 매장의 경쟁사 비교 목록 조회 API
 * @param storeId 매장 ID
 * @returns 경쟁사 비교 목록
 */
export const getCompetitorComparisons = async (
  storeId: string
): Promise<CompetitorComparisonListResponse> => {
  try {
    const response = await axiosInstance.get<CompetitorComparisonListResponse>(
      `/api/proxy/competitor/${storeId}`
    );

    // API 응답 로그 기록 (디버깅용)

    return response.data;
  } catch (error) {
    console.error("경쟁사 비교 목록 조회 오류:", error);
    throw error;
  }
};

/**
 * 특정 경쟁사 비교 결과 조회 API
 * @param comparisonId 비교 ID
 * @returns 경쟁사 비교 상세 결과
 */
export const getCompetitorComparisonResult = async (
  comparisonId: string
): Promise<CompetitorComparisonResultResponse> => {
  try {
    const response =
      await axiosInstance.get<CompetitorComparisonResultResponse>(
        `/api/proxy/competitor/comparison/${comparisonId}`
      );

    // API 응답 로그 기록 (디버깅용)

    return response.data;
  } catch (error) {
    console.error("경쟁사 비교 결과 조회 오류:", error);
    throw error;
  }
};
