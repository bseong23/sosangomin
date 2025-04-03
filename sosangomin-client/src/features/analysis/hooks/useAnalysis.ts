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

  const requestAnalysis = useCallback(
    async (params: AnalysisRequest): Promise<string | null> => {
      setAnalysisState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await performAnalysis(params);
        if ("error" in response && "message" in response) {
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error
          }));
          return null;
        }
        const analysisId = response.analysis_id;
        setAnalysisState({
          data: {
            eda_result: response.eda_results || {},
            auto_analysis: response.auto_analysis || {},
            analysis_id: analysisId,
            created_at: response.created_at,
            status: response.status
          },
          isLoading: false,
          error: null
        });
        return analysisId;
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "분석 요청 중 오류 발생"
        }));
        return null;
      }
    },
    []
  );

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
            status: analysisResult?.status
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
            status: analysisResult?.status
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
