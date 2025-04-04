// store/useAnalysisStore.ts
import { create } from "zustand";
import {
  performAnalysis,
  getAnalysisResult,
  getStoreAnalysisList
} from "@/features/analysis/api/analysisApi";
import { AnalysisRequest } from "@/features/analysis/types/analysis";
import { persist } from "zustand/middleware";

interface AnalysisStore {
  // 상태
  currentAnalysis: any;
  isLoading: boolean;
  error: string | null;

  // 분석 목록 관련
  analysisList: any;
  isLoadingList: boolean;
  listError: string | null;

  // 분석 작업들 캐시
  analysisCache: Record<string, any>;

  // 선택된 분석 ID
  selectedAnalysisId: string | null;

  // 액션
  requestAnalysis: (params: AnalysisRequest) => Promise<string | null>;
  fetchAnalysisResult: (analysisId: string) => Promise<boolean>;
  fetchStoreAnalysisList: (storeId: number | string) => Promise<boolean>;
  setAnalysisFromList: (analysisId: string) => Promise<boolean>;
  clearCurrentAnalysis: () => void;
  clearError: () => void;
  clearCache: () => void;
  setSelectedAnalysisId: (analysisId: string) => void;
  debugState: () => any;
}

// persist 미들웨어를 사용하여 일부 상태 유지
const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set, get) => ({
      // 초기 상태
      currentAnalysis: null,
      isLoading: false,
      error: null,
      analysisList: null,
      isLoadingList: false,
      listError: null,
      analysisCache: {},
      selectedAnalysisId: null,

      // 분석 요청 액션
      requestAnalysis: async (params: AnalysisRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await performAnalysis(params);
          console.log("API 응답 전체:", response);

          if ("error" in response && "message" in response) {
            set({
              isLoading: false,
              error: response.error
            });
            return null;
          }

          // API 응답에서 데이터 추출 (analysis_result 필드가 있을 경우 사용)
          const analysisResult = response.analysis_result || response;
          const analysisId =
            analysisResult._id ||
            analysisResult.analysis_id ||
            analysisResult.id;

          console.log("API 응답에서 찾은 분석 ID:", analysisId);

          if (!analysisId) {
            console.error("API 응답에서 분석 ID를 찾을 수 없음:", response);
            set({
              isLoading: false,
              error: "분석 ID를 받지 못했습니다"
            });
            return null;
          }

          // 응답 그대로 저장
          set((state) => ({
            currentAnalysis: response,
            isLoading: false,
            error: null,
            analysisCache: {
              ...state.analysisCache,
              [analysisId]: response
            },
            selectedAnalysisId: analysisId
          }));

          return analysisId;
        } catch (error) {
          console.error("분석 요청 중 오류:", error);
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
              cachedResult.status === "failed" ||
              (cachedResult.analysis_result &&
                (cachedResult.analysis_result.status === "completed" ||
                  cachedResult.analysis_result.status === "success" ||
                  cachedResult.analysis_result.status === "failed")))
          ) {
            set({
              currentAnalysis: cachedResult,
              isLoading: false
            });
            return true;
          }

          // 캐시에 없거나 아직 진행 중인 결과라면 API 호출
          console.log(`API 호출 시작: 분석 ID ${analysisId}의 결과 가져오기`);
          const response = await getAnalysisResult(analysisId);
          console.log(`API 호출 완료: 분석 ID ${analysisId}의 결과`, response);

          if ("error" in response && "message" in response) {
            set({
              isLoading: false,
              error: response.error
            });
            return false;
          }

          // 응답 그대로 저장
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
          console.error("분석 결과 조회 중 오류:", error);
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
          console.log(`매장 ID ${storeId}의 분석 목록 API 호출 시작`);
          const response = await getStoreAnalysisList(storeId);
          console.log(
            `매장 ID ${storeId}의 분석 목록 API 호출 완료:`,
            response
          );

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

          // 분석 목록이 로드되었고 선택된 분석이 없는 경우, 첫 번째 항목을 자동 선택
          const state = get();
          if (!state.selectedAnalysisId && response) {
            const list = response.analysisList || response.analyses || [];
            if (list.length > 0) {
              const firstAnalysisId = list[0].analysisId || list[0].analysis_id;
              console.log(`자동 선택된 첫 번째 분석 ID: ${firstAnalysisId}`);
              set({ selectedAnalysisId: firstAnalysisId });
              // 첫 번째 분석 결과도 로드
              get().fetchAnalysisResult(firstAnalysisId);
            }
          }

          return true;
        } catch (error) {
          console.error("매장 분석 목록 조회 중 오류:", error);
          set({
            isLoadingList: false,
            listError: "매장 분석 목록 조회 중 예기치 않은 오류가 발생했습니다"
          });
          return false;
        }
      },

      // 분석 목록에서 특정 분석 결과 선택
      setAnalysisFromList: async (analysisId: string) => {
        // 선택된 분석 ID 업데이트
        set({ selectedAnalysisId: analysisId });

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
      },

      // 선택된 분석 ID 직접 설정
      setSelectedAnalysisId: (analysisId: string) => {
        console.log(`선택된 분석 ID 설정: ${analysisId}`);
        set({ selectedAnalysisId: analysisId });
      },

      // 디버깅용 함수
      debugState: () => {
        const state = get();
        const debug = {
          selectedAnalysisId: state.selectedAnalysisId,
          hasCurrentAnalysis: !!state.currentAnalysis,
          currentAnalysisId:
            state.currentAnalysis?._id ||
            state.currentAnalysis?.analysis_result?._id,
          hasAnalysisList: !!state.analysisList,
          analysisListLength: state.analysisList
            ? (
                state.analysisList.analysisList ||
                state.analysisList.analyses ||
                []
              ).length
            : 0,
          isLoading: state.isLoading,
          isLoadingList: state.isLoadingList,
          error: state.error,
          listError: state.listError,
          cacheSize: Object.keys(state.analysisCache).length
        };
        console.log("분석 스토어 상태 디버깅:", debug);
        return debug;
      }
    }),
    {
      name: "analysis-storage",
      partialize: (state) => ({
        // 지속적으로 저장할 상태만 선택
        selectedAnalysisId: state.selectedAnalysisId,
        analysisCache: state.analysisCache
      })
    }
  )
);

export default useAnalysisStore;
