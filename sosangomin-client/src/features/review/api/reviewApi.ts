// features/review/api/reviewApi.ts
import axiosInstance from "@/api/axios";
import {
  ReviewAnalysisRequest,
  ReviewAnalysisResult,
  StoreReviewAnalyses,
  ErrorResponse,
  ApiResponse
} from "@/features/review/types/Review";

/**
 * 새로운 리뷰 분석 요청
 * @param params 리뷰 분석 요청 파라미터
 * @returns 리뷰 분석 결과 혹은 에러 응답
 */
export const requestReviewAnalysis = async (
  params: ReviewAnalysisRequest
): Promise<ApiResponse<ReviewAnalysisResult>> => {
  try {
    const response = await axiosInstance.post<ReviewAnalysisResult>(
      "/api/proxy/reviews",
      params
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorResponse;
    }
    return {
      error: "리뷰 분석 요청 실패",
      message: "ERR_REVIEW_ANALYSIS_REQUEST_FAILED"
    };
  }
};

/**
 * 매장 ID로 리뷰 분석 목록 조회
 * @param storeId 매장 ID
 * @returns 매장 리뷰 분석 목록 혹은 에러 응답
 */
export const getStoreReviewAnalyses = async (
  storeId: number
): Promise<ApiResponse<StoreReviewAnalyses>> => {
  try {
    const response = await axiosInstance.get<StoreReviewAnalyses>(
      `/api/proxy/reviews/store/${storeId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorResponse;
    }
    return {
      error: "매장 리뷰 분석 목록 조회 실패",
      message: "ERR_STORE_REVIEWS_FETCH_FAILED"
    };
  }
};

/**
 * 분석 ID로 리뷰 분석 결과 조회
 * @param analysisId 분석 ID
 * @returns 리뷰 분석 결과 혹은 에러 응답
 */
export const getReviewAnalysisResult = async (
  analysisId: string
): Promise<ApiResponse<ReviewAnalysisResult>> => {
  try {
    const response = await axiosInstance.get<ReviewAnalysisResult>(
      `/api/proxy/reviews/analysis/${analysisId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorResponse;
    }
    return {
      error: "리뷰 분석 결과 조회 실패",
      message: "ERR_REVIEW_ANALYSIS_RESULT_FETCH_FAILED"
    };
  }
};

/**
 * 최신 리뷰 분석 결과 조회
 * @param storeId 매장 ID
 * @returns 최신 리뷰 분석 결과 혹은 에러 응답
 */
export const getLatestReviewAnalysis = async (
  storeId: number
): Promise<ApiResponse<ReviewAnalysisResult>> => {
  try {
    const response = await axiosInstance.get<ReviewAnalysisResult>(
      "/api/proxy/reviews/latest",
      {
        params: { storeId }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as ErrorResponse;
    }
    return {
      error: "최신 리뷰 분석 결과 조회 실패",
      message: "ERR_LATEST_REVIEW_ANALYSIS_FETCH_FAILED"
    };
  }
};
