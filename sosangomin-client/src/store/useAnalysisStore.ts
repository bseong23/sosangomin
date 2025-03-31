// store/useAnalysisStore.ts
import { create } from "zustand";
import {
  performAnalysis,
  getAnalysisResult,
  getLatestAnalysisResult
} from "@/features/analysis/api/analysisApi";
import {
  AnalysisRequest,
  AnalysisResult
} from "@/features/analysis/types/analysis";

interface AnalysisStore {
  // 상태
  currentAnalysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;

  // 분석 작업들 캐시
  analysisCache: Record<string, AnalysisResult>;

  // 액션
  requestAnalysis: (params: AnalysisRequest) => Promise<string | null>;
  fetchAnalysisResult: (analysisId: string) => Promise<boolean>;
  fetchLatestAnalysisResult: (sourceId: string) => Promise<boolean>;
  clearCurrentAnalysis: () => void;
  clearError: () => void;
  clearCache: () => void;
}

const useAnalysisStore = create<AnalysisStore>((set, get) => ({
  // 초기 상태
  currentAnalysis: null,
  isLoading: false,
  error: null,
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

      // 캐시와 현재 분석 상태 업데이트
      set((state) => ({
        currentAnalysis: response,
        isLoading: false,
        error: null,
        analysisCache: {
          ...state.analysisCache,
          [response.analysis_id]: response
        }
      }));

      return response.analysis_id;
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
        (cachedResult.status === "success" || cachedResult.status === "failed")
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

      // 캐시와 현재 분석 상태 업데이트
      set((state) => ({
        currentAnalysis: response,
        isLoading: false,
        error: null,
        analysisCache: {
          ...state.analysisCache,
          [analysisId]: response
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

  // 최신 분석 결과 조회 액션
  fetchLatestAnalysisResult: async (sourceId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await getLatestAnalysisResult(sourceId);

      if ("error" in response && "message" in response) {
        set({
          isLoading: false,
          error: response.error
        });
        return false;
      }

      // 캐시와 현재 분석 상태 업데이트
      set((state) => ({
        currentAnalysis: response,
        isLoading: false,
        error: null,
        analysisCache: {
          ...state.analysisCache,
          [response.analysis_id]: response
        }
      }));

      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: "최신 분석 결과 조회 중 예기치 않은 오류가 발생했습니다"
      });
      return false;
    }
  },

  // 현재 분석 지우기
  clearCurrentAnalysis: () => {
    set({ currentAnalysis: null });
  },

  // 에러 지우기
  clearError: () => {
    set({ error: null });
  },

  // 캐시 지우기
  clearCache: () => {
    set({ analysisCache: {} });
  }
}));

export default useAnalysisStore;
