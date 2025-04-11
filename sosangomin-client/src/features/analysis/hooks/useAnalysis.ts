import { useState, useCallback } from "react";
import {
  performAnalysis,
  getAnalysisResult,
  getLatestAnalysisResult,
  getStoreAnalysisList
} from "../api/analysisApi";
import {
  AnalysisRequest,
  AnalysisState,
  AnalysisListResponse
} from "../types/analysis";

export const useAnalysis = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    data: null,
    isLoading: false,
    error: null
  });

  const [analysisListState, setAnalysisListState] = useState<{
    data: AnalysisListResponse | null;
    isLoading: boolean;
    error: string | null;
  }>({
    data: null,
    isLoading: false,
    error: null
  });

  // useAnalysis 훅 내부의 requestAnalysis 함수
  const requestAnalysis = async (params: AnalysisRequest) => {
    setAnalysisState({
      data: null,
      isLoading: true,
      error: null
    });

    try {
      const response = await performAnalysis(params);

      // 다양한 에러 패턴 확인
      if (
        response.error ||
        response.errorMessage ||
        response.status >= 400 ||
        (response.status && response.status !== "success")
      ) {
        const errorMsg =
          response.error ||
          response.errorMessage ||
          (response.status >= 400
            ? `HTTP 오류(${response.status})`
            : "분석 요청 실패");

        setAnalysisState({
          data: null,
          isLoading: false,
          error: errorMsg
        });
        return response; // 에러 객체를 그대로 반환
      }

      // 성공 시 상태 업데이트
      setAnalysisState({
        data: response,
        isLoading: false,
        error: null
      });

      return response;
    } catch (error) {
      console.error("분석 요청 오류:", error);
      setAnalysisState({
        data: null,
        isLoading: false,
        error: "분석 요청 중 오류 발생"
      });
      return {
        error: "분석 요청 오류",
        errorMessage: "ERR_ANALYSIS_EXCEPTION"
      };
    }
  };

  const fetchAnalysisResult = useCallback(
    async (analysisId: string): Promise<boolean> => {
      setAnalysisState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await getAnalysisResult(analysisId);
        if ("error" in response && "message" in response) {
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error
          }));
          return false;
        }
        const analysisResult = response.analysis_result;
        setAnalysisState({
          data: {
            eda_result: analysisResult?.eda_result || {},
            auto_analysis: analysisResult?.auto_analysis || {},
            analysis_id: analysisResult?._id,
            created_at: analysisResult?.created_at,
            status: analysisResult?.status,
            data_range: analysisResult?.data_range || undefined // 새 필드 추가
          },
          isLoading: false,
          error: null
        });
        return true;
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "분석 결과 조회 중 오류 발생"
        }));
        return false;
      }
    },
    []
  );

  const fetchLatestAnalysisResult = useCallback(
    async (storeId: string): Promise<boolean> => {
      setAnalysisState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await getLatestAnalysisResult(storeId);
        if ("error" in response && "message" in response) {
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error
          }));
          return false;
        }
        const analysisResult = response.analysis_result;
        setAnalysisState({
          data: {
            eda_result: analysisResult?.eda_result || {},
            auto_analysis: analysisResult?.auto_analysis || {},
            analysis_id: analysisResult?._id,
            created_at: analysisResult?.created_at,
            status: analysisResult?.status,
            data_range: analysisResult?.data_range || undefined // 새 필드 추가
          },
          isLoading: false,
          error: null
        });
        return true;
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "최신 분석 결과 조회 중 오류 발생"
        }));
        return false;
      }
    },
    []
  );

  const fetchStoreAnalysisList = useCallback(
    async (storeId: number | string): Promise<boolean> => {
      setAnalysisListState({ data: null, isLoading: true, error: null });
      try {
        const response = await getStoreAnalysisList(storeId);
        if ("error" in response && "message" in response) {
          setAnalysisListState({
            data: null,
            isLoading: false,
            error: response.error
          });
          return false;
        }
        setAnalysisListState({ data: response, isLoading: false, error: null });
        return true;
      } catch (error) {
        setAnalysisListState({
          data: null,
          isLoading: false,
          error: "매장 분석 목록 조회 중 오류 발생"
        });
        return false;
      }
    },
    []
  );

  const resetAnalysisState = useCallback(() => {
    setAnalysisState({ data: null, isLoading: false, error: null });
  }, []);

  const resetAnalysisListState = useCallback(() => {
    setAnalysisListState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    analysisState,
    analysisListState,
    requestAnalysis,
    fetchAnalysisResult,
    fetchStoreAnalysisList,
    fetchLatestAnalysisResult,
    resetAnalysisState,
    resetAnalysisListState
  };
};

export default useAnalysis;
