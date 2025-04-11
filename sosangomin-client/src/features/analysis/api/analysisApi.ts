// features/analysis/api/analysisApi.ts
import axiosInstance from "@/api/axios";
import { AnalysisRequest } from "../types/analysis";

/**
 * 종합 데이터 분석 API 호출
 * @param params 분석 요청 매개변수
 * @returns 분석 결과 혹은 에러 응답
 */
export const performAnalysis = async (params: AnalysisRequest) => {
  try {
    const response = await axiosInstance.post("/api/proxy/analysis", params);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
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
export const getAnalysisResult = async (analysisId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/proxy/analysis/${analysisId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      error: "분석 결과 조회 중 오류가 발생했습니다",
      message: "ERR_ANALYSIS_RESULT_FETCH_FAILED"
    };
  }
};

/**
 * 매장 분석 목록 조회
 * @param encryptedStoreId 암호화된 매장 ID
 * @returns 분석 목록 혹은 에러 응답
 */
export const getStoreAnalysisList = async (
  encryptedStoreId: number | string
) => {
  try {
    const response = await axiosInstance.get(
      `/api/proxy/store/analysis-list/${encryptedStoreId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      error: "매장 분석 목록 조회 중 오류가 발생했습니다",
      message: "ERR_STORE_ANALYSIS_LIST_FETCH_FAILED"
    };
  }
};

/**
 * 최신 분석 결과 조회
 * 참고: 실제 API에 존재하지 않을 수 있어 getStoreAnalysisList로 분석 목록을 조회한 후
 * 최신 분석 결과를 선택하는 방식으로 구현
 * @param storeId 매장 ID
 * @returns 최신 분석 결과 혹은 에러 응답
 */
export const getLatestAnalysisResult = async (storeId: string) => {
  try {
    // 1. 매장 분석 목록 조회
    const listResponse = await getStoreAnalysisList(storeId);

    if ("error" in listResponse) {
      return listResponse;
    }

    // 2. 목록이 비어있는지 확인
    const analysisList = listResponse.analyses || listResponse.analysisList;
    if (!analysisList || analysisList.length === 0) {
      return {
        error: "분석 결과가 없습니다",
        message: "ERR_NO_ANALYSIS_RESULTS"
      };
    }

    // 3. 최신 분석 ID 가져오기 (첫 번째 항목)
    const latestAnalysisId =
      analysisList[0].analysis_id || analysisList[0].analysisId;

    // 4. 해당 분석 결과 조회
    const analysisResult = await getAnalysisResult(latestAnalysisId);
    return analysisResult;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      error: "최신 분석 결과 조회 중 오류가 발생했습니다",
      message: "ERR_LATEST_ANALYSIS_FETCH_FAILED"
    };
  }
};
