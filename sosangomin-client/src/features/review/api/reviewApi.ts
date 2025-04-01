// // features/review/api/reviewApi.ts
// import axiosInstance from "@/api/axios";
// import {
//   ReviewAnalysisRequest,
//   ReviewAnalysisResult
// } from "@/features/review/types/review";

// /**
//  * 리뷰 분석 요청 (POST)
//  */
// export const requestReviewAnalysis = async (
//   params: ReviewAnalysisRequest
// ): Promise<ReviewAnalysisResult> => {
//   const { data } = await axiosInstance.post<ReviewAnalysisResult>(
//     "/api/proxy/reviews",
//     params
//   );
//   return data;
// };

// /**
//  * 리뷰 분석 결과 조회 (GET)
//  */
// export const getReviewAnalysisResult = async (
//   analysisId: string
// ): Promise<ReviewAnalysisResult> => {
//   const { data } = await axiosInstance.get<ReviewAnalysisResult>(
//     `/api/proxy/reviews/analysis/${analysisId}`
//   );
//   return data;
// };

// features/review/api/reviewApi.ts
import axiosInstance from "@/api/axios";
import { ReviewAnalysisRequest } from "@/features/review/types/review";

/**
 * 리뷰 분석 요청 (POST)
 */
export const requestReviewAnalysis = async (
  params: ReviewAnalysisRequest
): Promise<any> => {
  try {
    const { data } = await axiosInstance.post<any>(
      "/api/proxy/reviews",
      params
    );

    // API 응답 로그 기록 (디버깅용)
    console.log("API 응답 데이터:", data);

    return data;
  } catch (error) {
    console.error("리뷰 분석 요청 오류:", error);
    throw error;
  }
};

/**
 * 리뷰 분석 결과 조회 (GET)
 */
export const getReviewAnalysisResult = async (
  analysisId: string
): Promise<any> => {
  try {
    const { data } = await axiosInstance.get<any>(
      `/api/proxy/reviews/analysis/${analysisId}`
    );
    return data;
  } catch (error) {
    console.error("리뷰 분석 결과 조회 오류:", error);
    return null;
  }
};

/**
 * 매장의 모든 리뷰 분석 목록 조회 (GET)
 */
export const getStoreReviewAnalysis = async (storeId: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.get<any>(
      `/api/proxy/reviews/store/${storeId}`
    );
    return data;
  } catch (error) {
    console.error("매장 리뷰 분석 목록 조회 오류:", error);
    throw error;
  }
};
