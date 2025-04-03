// features/analysis/hooks/useAnalysis.ts
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

/**
 * 종합 데이터 분석 기능을 제공하는 hook
 */
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

  /**
   * 분석 요청 함수
   */
  const requestAnalysis = useCallback(
    async (params: AnalysisRequest): Promise<string | null> => {
      // 반환 타입 변경
      setAnalysisState((prev) => ({
        ...prev,
        isLoading: true,
        error: null
      }));

      try {
        const response = await performAnalysis(params);
        console.log("API 응답 전체:", response);

        if ("error" in response && "message" in response) {
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error
          }));
          return null;
        }

        // 루트 레벨에서 analysis_id 직접 추출
        const analysisId = response.analysis_id;
        console.log("응답에서 추출한 분석 ID:", analysisId);

        // 응답 구조 확인용 로깅
        console.log("응답 구조:", {
          hasAnalysisId: !!response.analysis_id,
          hasAnalysisResult: !!response.analysis_result,
          analysisId: response.analysis_id
        });

        // 컴포넌트가 기대하는 형식으로 데이터 구조화
        const formattedData = {
          result_data: response.eda_results?.result_data || {},
          summary: response.eda_results?.summary || "",
          analysis_id: analysisId,
          _id: analysisId,
          id: analysisId,
          created_at: response.created_at,
          status: response.status
        };

        setAnalysisState({
          data: formattedData,
          isLoading: false,
          error: null
        });

        // 분석 ID 반환
        return analysisId;
      } catch (error) {
        console.error("분석 요청 중 오류:", error);
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "분석 요청 중 예기치 않은 오류가 발생했습니다"
        }));
        return null;
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

        // API 응답에서 분석 결과 추출
        const analysisResult = response.analysis_result;

        // 컴포넌트가 기대하는 형식으로 데이터 구조화
        const formattedData = {
          result_data: analysisResult?.eda_result?.result_data || {},
          summary: analysisResult?.eda_result?.summary || "",
          analysis_id: analysisResult?._id,
          created_at: analysisResult?.created_at,
          status: analysisResult?.status
        };

        setAnalysisState({
          data: formattedData,
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
   * 매장 분석 목록 조회 함수
   */
  const fetchStoreAnalysisList = useCallback(
    async (storeId: number | string): Promise<boolean> => {
      setAnalysisListState({
        data: null,
        isLoading: true,
        error: null
      });

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

        setAnalysisListState({
          data: response,
          isLoading: false,
          error: null
        });
        return true;
      } catch (error) {
        setAnalysisListState({
          data: null,
          isLoading: false,
          error: "매장 분석 목록 조회 중 예기치 않은 오류가 발생했습니다"
        });
        return false;
      }
    },
    []
  );

  /**
   * 최신 분석 결과 조회 함수
   */
  const fetchLatestAnalysisResult = useCallback(
    async (storeId: string): Promise<boolean> => {
      setAnalysisState((prev) => ({
        ...prev,
        isLoading: true,
        error: null
      }));

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

        // API 응답에서 분석 결과 추출
        const analysisResult = response.analysis_result;

        // 컴포넌트가 기대하는 형식으로 데이터 구조화
        const formattedData = {
          result_data: analysisResult?.eda_result?.result_data || {},
          summary: analysisResult?.eda_result?.summary || "",
          analysis_id: analysisResult?._id,
          created_at: analysisResult?.created_at,
          status: analysisResult?.status
        };

        setAnalysisState({
          data: formattedData,
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

  /**
   * 분석 목록 상태 초기화 함수
   */
  const resetAnalysisListState = useCallback(() => {
    setAnalysisListState({
      data: null,
      isLoading: false,
      error: null
    });
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
