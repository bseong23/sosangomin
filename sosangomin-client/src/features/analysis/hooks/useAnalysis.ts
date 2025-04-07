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

  const requestAnalysis = async (params: AnalysisRequest) => {
    setAnalysisState({
      data: null,
      isLoading: true, // 요청 시작
      error: null
    });

    try {
      const response = await performAnalysis(params);

      // 성공 시 즉시 로딩 상태 변경
      setAnalysisState({
        data: response,
        isLoading: false, // 요청 완료
        error: null
      });

      return response.analysis_id;
    } catch (error) {
      // 에러 시에도 로딩 상태 변경
      setAnalysisState({
        data: null,
        isLoading: false, // 요청 종료
        error: "분석 요청 중 오류 발생"
      });
      return null;
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
