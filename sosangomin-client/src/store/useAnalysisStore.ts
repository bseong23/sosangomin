// store/useAnalysisStore.ts
import { create } from "zustand";
import {
  performAnalysis,
  getAnalysisResult,
  getStoreAnalysisList
} from "@/features/analysis/api/analysisApi";
import { AnalysisRequest } from "@/features/analysis/types/analysis";

interface AnalysisStore {
  // 상태
  currentAnalysis: any; // API 응답 그대로 사용
  isLoading: boolean;
  error: string | null;

  // 분석 목록 관련
  analysisList: any; // API 응답 그대로 사용
  isLoadingList: boolean;
  listError: string | null;

  // 분석 작업들 캐시
  analysisCache: Record<string, any>;

  // 액션
  requestAnalysis: (params: AnalysisRequest) => Promise<string | null>;
  fetchAnalysisResult: (analysisId: string) => Promise<boolean>;
  fetchStoreAnalysisList: (storeId: number | string) => Promise<boolean>;
  setAnalysisFromList: (analysisId: string) => Promise<boolean>;
  clearCurrentAnalysis: () => void;
  clearError: () => void;
  clearCache: () => void;
}

const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  // 초기 상태
  currentAnalysis: null,
  isLoading: false,
  error: null,
  analysisList: null,
  isLoadingList: false,
  listError: null,
  analysisCache: {},

  // 분석 요청 액션
  requestAnalysis: async (params: AnalysisRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await performAnalysis(params);

      if ("error" in response && "message" in response) {
        set({
          isLoading: false,
          error: response.error
        });
        return null;
      }

      // API 응답에서 데이터 추출 및 형식 변환
      const analysisId = response.analysis_id;
      const analysisResult = response.analysis_result;

      // 컴포넌트가 기대하는 형식으로 데이터 구조화
      const formattedData = {
        result_data: analysisResult?.eda_result?.result_data || {},
        summary: analysisResult?.eda_result?.summary || "",
        _id: analysisResult?._id,
        created_at: analysisResult?.created_at,
        status: analysisResult?.status
      };

      // 캐시와 현재 분석 상태 업데이트
      set((state) => ({
        currentAnalysis: formattedData,
        isLoading: false,
        error: null,
        analysisCache: {
          ...state.analysisCache,
          [analysisId]: formattedData
        }
      }));

      return analysisId;
    } catch (error) {
      set({
        isLoading: false,
        error: "분석 요청 중 예기치 않은 오류가 발생했습니다"
      });
      return null;
    }
  },

  // 분석 결과 조회 액션
  fetchAnalysisResult: async (analysisId: string) => {
    set({ isLoading: true, error: null });

    try {
      // 캐시 먼저 확인
      const cachedResult = get().analysisCache[analysisId];

      // 완료된 결과가 캐시에 있으면 바로 사용
      if (
        cachedResult &&
        (cachedResult.status === "completed" ||
          cachedResult.status === "success" ||
          cachedResult.status === "failed")
      ) {
        set({
          currentAnalysis: cachedResult,
          isLoading: false
        });
        return true;
      }

      // 캐시에 없거나 아직 진행 중인 결과라면 API 호출
      const response = await getAnalysisResult(analysisId);

      if ("error" in response && "message" in response) {
        set({
          isLoading: false,
          error: response.error
        });
        return false;
      }

      // API 응답에서 분석 결과 추출
      const analysisResult = response.analysis_result;

      // 컴포넌트가 기대하는 형식으로 데이터 구조화
      const formattedData = {
        result_data: analysisResult?.eda_result?.result_data || {},
        summary: analysisResult?.eda_result?.summary || "",
        _id: analysisResult?._id,
        created_at: analysisResult?.created_at,
        status: analysisResult?.status
      };

      // 캐시와 현재 분석 상태 업데이트
      set((state) => ({
        currentAnalysis: formattedData,
        isLoading: false,
        error: null,
        analysisCache: {
          ...state.analysisCache,
          [analysisId]: formattedData
        }
      }));

      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: "분석 결과 조회 중 예기치 않은 오류가 발생했습니다"
      });
      return false;
    }
  },

  // 매장 분석 목록 조회 액션
  fetchStoreAnalysisList: async (storeId: number | string) => {
    set({ isLoadingList: true, listError: null });

    try {
      const response = await getStoreAnalysisList(storeId);

      if ("error" in response && "message" in response) {
        set({
          isLoadingList: false,
          listError: response.error
        });
        return false;
      }

      set({
        analysisList: response,
        isLoadingList: false,
        listError: null
      });

      return true;
    } catch (error) {
      set({
        isLoadingList: false,
        listError: "매장 분석 목록 조회 중 예기치 않은 오류가 발생했습니다"
      });
      return false;
    }
  },

  // 분석 목록에서 특정 분석 결과 선택
  setAnalysisFromList: async (analysisId: string) => {
    // 이미 해당 분석 결과가 캐시에 있는지 확인
    const cachedResult = get().analysisCache[analysisId];

    if (cachedResult) {
      set({ currentAnalysis: cachedResult });
      return true;
    }

    // 캐시에 없으면 분석 결과 조회
    return await get().fetchAnalysisResult(analysisId);
  },

  // 현재 분석 지우기
  clearCurrentAnalysis: () => {
    set({ currentAnalysis: null });
  },

  // 에러 지우기
  clearError: () => {
    set({ error: null, listError: null });
  },

  // 캐시 지우기
  clearCache: () => {
    set({ analysisCache: {} });
  }
}));

export default useAnalysisStore;
