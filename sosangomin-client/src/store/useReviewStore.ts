// features/review/store/reviewStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  requestReviewAnalysis,
  getStoreReviewAnalysis,
  getReviewAnalysisResult
} from "@/features/review/api/reviewApi";

// 감정 분석 분포 인터페이스
interface SentimentDistribution {
  positive: number;
  neutral: number;
  negative: number;
}

// 분석 목록 항목 인터페이스
interface AnalysisSummary {
  analysis_id: string;
  place_id: string;
  review_count: number;
  average_rating: number;
  sentiment_distribution: SentimentDistribution;
  created_at: string;
}

// 상세 분석 결과 인터페이스
interface AnalysisDetail {
  _id: string;
  store_id: number;
  place_id: string;
  reviews: any[];
  review_count: number;
  average_rating: number;
  sentiment_distribution: SentimentDistribution;
  word_cloud_data: {
    positive_words: Record<string, number>;
    negative_words: Record<string, number>;
  };
  category_insights: {
    음식?: {
      positive: number;
      negative: number;
      keywords: Record<string, number>;
    };
    서비스?: {
      positive: number;
      negative: number;
      keywords: Record<string, number>;
    };
    가격?: {
      positive: number;
      negative: number;
      keywords: Record<string, number>;
    };
    분위기?: {
      positive: number;
      negative: number;
      keywords: Record<string, number>;
    };
    위생?: {
      positive: number;
      negative: number;
      keywords: Record<string, number>;
    };
  };
  insights: string;
  insights_source?: string;
  last_crawled_at?: string;
  created_at: string;
}

interface ReviewState {
  // 매장별 분석 목록 캐시
  analysisListCache: Record<string, AnalysisSummary[]>;
  // 분석 ID별 상세 정보 캐시
  analysisDetailCache: Record<string, AnalysisDetail>;
  // 매장별 최신 분석 ID 캐시
  latestAnalysisIdByStore: Record<string, string>;

  // 현재 상태
  loading: boolean;
  error: string | null;

  // 현재 선택된 분석
  selectedAnalysisId: string | null;

  // 액션
  getAnalysisList: (storeId: string) => Promise<AnalysisSummary[]>;
  getAnalysisDetail: (analysisId: string) => Promise<AnalysisDetail | null>;
  requestNewAnalysis: (storeId: string, placeId: string) => Promise<boolean>;
  setSelectedAnalysisId: (analysisId: string | null) => void;
  clearError: () => void;
  resetStore: () => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      analysisListCache: {},
      analysisDetailCache: {},
      latestAnalysisIdByStore: {},
      loading: false,
      error: null,
      selectedAnalysisId: null,

      // 분석 목록 가져오기
      getAnalysisList: async (storeId: string) => {
        try {
          set({ loading: true, error: null });

          // API 호출
          const response = await getStoreReviewAnalysis(storeId);

          if (response && response.status === "success" && response.analyses) {
            // 캐시에 저장
            set((state) => ({
              analysisListCache: {
                ...state.analysisListCache,
                [storeId]: response.analyses
              }
            }));

            // 최신 분석 ID 저장
            if (response.analyses.length > 0) {
              set((state) => ({
                latestAnalysisIdByStore: {
                  ...state.latestAnalysisIdByStore,
                  [storeId]: response.analyses[0].analysis_id
                }
              }));
            }

            set({ loading: false });
            return response.analyses;
          }

          set({
            loading: false,
            error: "분석 목록을 불러오는데 실패했습니다."
          });
          return [];
        } catch (error) {
          console.error("분석 목록 불러오기 실패:", error);
          set({
            loading: false,
            error: "분석 목록을 불러오는 중 오류가 발생했습니다."
          });
          return [];
        }
      },

      // 분석 상세 정보 가져오기
      getAnalysisDetail: async (analysisId: string) => {
        const { analysisDetailCache } = get();

        // 캐시에 있는 경우 캐시된 정보 반환
        if (analysisDetailCache[analysisId]) {
          return analysisDetailCache[analysisId];
        }

        try {
          set({ loading: true, error: null });

          // API 호출
          const response = await getReviewAnalysisResult(analysisId);

          if (response && response.status === "success" && response.data) {
            // 캐시에 저장
            set((state) => ({
              analysisDetailCache: {
                ...state.analysisDetailCache,
                [analysisId]: response.data
              }
            }));

            set({ loading: false });
            return response.data;
          }

          set({
            loading: false,
            error: "분석 상세 정보를 불러오는데 실패했습니다."
          });
          return null;
        } catch (error) {
          console.error("분석 상세 정보 불러오기 실패:", error);
          set({
            loading: false,
            error: "분석 상세 정보를 불러오는 중 오류가 발생했습니다."
          });
          return null;
        }
      },

      // 새 분석 요청
      requestNewAnalysis: async (storeId: string, placeId: string) => {
        try {
          set({ loading: true, error: null });

          // 분석 요청 API 호출
          const response = await requestReviewAnalysis({
            store_id: storeId,
            place_id: placeId
          });

          if (response && response.status === "success") {
            // 분석 목록 갱신
            const refreshedResponse = await getStoreReviewAnalysis(storeId);

            if (
              refreshedResponse &&
              refreshedResponse.status === "success" &&
              refreshedResponse.analyses
            ) {
              // 캐시 갱신
              set((state) => ({
                analysisListCache: {
                  ...state.analysisListCache,
                  [storeId]: refreshedResponse.analyses
                }
              }));

              // 최신 분석 ID 갱신
              if (refreshedResponse.analyses.length > 0) {
                const newAnalysisId = refreshedResponse.analyses[0].analysis_id;

                set((state) => ({
                  latestAnalysisIdByStore: {
                    ...state.latestAnalysisIdByStore,
                    [storeId]: newAnalysisId
                  },
                  selectedAnalysisId: newAnalysisId
                }));

                // 새 분석의 상세 정보 요청
                await get().getAnalysisDetail(newAnalysisId);
              }
            }

            set({ loading: false });
            return true;
          }

          set({
            loading: false,
            error: response?.message || "분석 요청이 실패했습니다."
          });
          return false;
        } catch (error) {
          console.error("분석 요청 오류:", error);
          set({
            loading: false,
            error: "분석 요청 중 오류가 발생했습니다."
          });
          return false;
        }
      },

      // 선택된 분석 ID 설정
      setSelectedAnalysisId: (analysisId: string | null) => {
        set({ selectedAnalysisId: analysisId });
      },

      // 오류 메시지 초기화
      clearError: () => {
        set({ error: null });
      },
      resetStore: () => {
        set({
          analysisListCache: {},
          analysisDetailCache: {},
          latestAnalysisIdByStore: {},
          loading: false,
          error: null,
          selectedAnalysisId: null
        });
      }
    }),
    {
      name: "review-store",
      skipHydration: true,
      partialize: (state) => ({
        // 필요한 상태만 로컬 스토리지에 저장
        analysisListCache: state.analysisListCache,
        analysisDetailCache: state.analysisDetailCache,
        latestAnalysisIdByStore: state.latestAnalysisIdByStore
      })
    }
  )
);
