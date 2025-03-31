// features/analysis/hooks/useAnalysis.ts
import { useState, useCallback } from "react";
import {
  performAnalysis,
  getAnalysisResult,
  getLatestAnalysisResult
} from "../api/analysisApi";
import { AnalysisRequest, AnalysisState } from "../types/analysis";

/**
 * 종합 데이터 분석 기능을 제공하는 hook
 */
export const useAnalysis = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    data: null,
    isLoading: false,
    error: null
  });

  /**
   * 분석 요청 함수
   */
  const requestAnalysis = useCallback(
    async (params: AnalysisRequest): Promise<boolean> => {
      setAnalysisState((prev) => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      try {
        const response = await performAnalysis(params);

        if ("error" in response && "message" in response) {
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error
          }));
          return false;
        }

        setAnalysisState({
          data: response,
          isLoading: false,
          error: null
        });
        return true;
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "분석 요청 중 예기치 않은 오류가 발생했습니다"
        }));
        return false;
      }
    },
    []
  );

  /**
   * 특정 분석 ID에 대한 결과 조회 함수
   */
  const fetchAnalysisResult = useCallback(
    async (analysisId: string): Promise<boolean> => {
      setAnalysisState((prev) => ({
        ...prev,
        isLoading: true,
        error: null
      }));

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

        setAnalysisState({
          data: response,
          isLoading: false,
          error: null
        });
        return true;
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "분석 결과 조회 중 예기치 않은 오류가 발생했습니다"
        }));
        return false;
      }
    },
    []
  );

  /**
   * 최신 분석 결과 조회 함수
   */
  const fetchLatestAnalysisResult = useCallback(
    async (sourceId: string): Promise<boolean> => {
      setAnalysisState((prev) => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      try {
        const response = await getLatestAnalysisResult(sourceId);

        if ("error" in response && "message" in response) {
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error
          }));
          return false;
        }

        setAnalysisState({
          data: response,
          isLoading: false,
          error: null
        });
        return true;
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "최신 분석 결과 조회 중 예기치 않은 오류가 발생했습니다"
        }));
        return false;
      }
    },
    []
  );

  /**
   * 분석 상태 초기화 함수
   */
  const resetAnalysisState = useCallback(() => {
    setAnalysisState({
      data: null,
      isLoading: false,
      error: null
    });
  }, []);

  return {
    analysisState,
    requestAnalysis,
    fetchAnalysisResult,
    fetchLatestAnalysisResult,
    resetAnalysisState
  };
};

export default useAnalysis;
