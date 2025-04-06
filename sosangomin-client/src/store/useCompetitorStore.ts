// features/competitor/store/useCompetitorStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  requestCompetitorAnalysis,
  getCompetitorComparisons,
  getCompetitorComparisonResult
} from "@/features/competitor/api/competitorApi";
import {
  CompetitorComparisonSummary,
  CompetitorComparisonResult
} from "@/features/competitor/types/competitor";

export interface CompetitorState {
  // 상태
  loading: boolean;
  error: string | null;
  comparisonListCache: Record<string, CompetitorComparisonSummary[]>; // storeId를 키로 캐싱
  comparisonDetailCache: Record<string, CompetitorComparisonResult>; // comparisonId를 키로 캐싱
  selectedComparisonId: string | null;

  // 액션
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedComparisonId: (id: string | null) => void;

  // API 액션
  requestAnalysis: (
    storeId: string,
    competitorName: string
  ) => Promise<string | null | undefined>;
  getComparisonList: (storeId: string) => Promise<void>;
  getComparisonDetail: (comparisonId: string) => Promise<void>;
  clearCache: () => void;
}

export const useCompetitorStore = create<CompetitorState>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        loading: false,
        error: null,
        comparisonListCache: {},
        comparisonDetailCache: {},
        selectedComparisonId: null,

        // 액션
        setLoading: (loading: boolean) => set({ loading }),
        setError: (error: string | null) => set({ error }),
        setSelectedComparisonId: (id: string | null) =>
          set({ selectedComparisonId: id }),

        // 새 경쟁사 분석 요청
        //

        requestAnalysis: async (storeId: string, competitorName: string) => {
          console.log("🐛 분석 요청 받은 storeId:", storeId); // ✅ 이거 먼저 확인
          console.log("🐛 competitorName:", competitorName);

          try {
            set({ loading: true, error: null });

            const response = await requestCompetitorAnalysis({
              store_id: storeId,
              competitor_name: competitorName
            });

            const { comparison_result } = response;

            console.log("📦 올바른 comparison_result:", comparison_result);

            if (response.status === "success" && comparison_result) {
              const comparisonId =
                comparison_result._id || comparison_result.comparison_id;

              console.log("✅ 최종 comparisonId:", comparisonId);

              // 캐시에 상세 정보 저장
              set((state) => ({
                comparisonDetailCache: {
                  ...state.comparisonDetailCache,
                  [comparisonId]: comparison_result
                }
              }));

              // 캐시에 목록 정보 업데이트
              set((state) => {
                const currentList = state.comparisonListCache[storeId] || [];

                console.log("✅ storeId:", storeId);
                console.log("✅ currentList:", currentList);

                // 새 요약 정보 생성
                const summary: CompetitorComparisonSummary = {
                  comparison_id: comparisonId,
                  competitor_name: comparison_result.competitor_name,
                  competitor_place_id:
                    comparison_result.competitor_place_id || "",
                  created_at: comparison_result.created_at,
                  summary: comparison_result.comparison_insight
                    ? comparison_result.comparison_insight.substring(0, 100) +
                      "..."
                    : "요약 정보 없음",
                  comparison_insight: comparison_result.comparison_insight || ""
                };

                const newCache = {
                  ...state.comparisonListCache,
                  [storeId]: [summary, ...currentList]
                };

                // ✅ 이거도 추가!
                console.log("🧩 업데이트 될 comparisonListCache:", newCache);

                return {
                  comparisonListCache: {
                    ...state.comparisonListCache,
                    [storeId]: [summary, ...currentList]
                  },
                  // 새 분석 결과를 자동으로 선택 상태로 설정
                  selectedComparisonId: comparisonId
                };
              });
              await get().getComparisonDetail(comparisonId);
              set({ selectedComparisonId: comparisonId });

              return comparisonId;
            } else {
              set({ error: "경쟁사 분석 요청이 실패했습니다." });
              return null;
            }
          } catch (err) {
            console.error("경쟁사 분석 요청 실패:", err);
            set({ error: "경쟁사 분석 중 오류가 발생했습니다." });
          } finally {
            set({ loading: false });
          }
        },

        // 매장의 경쟁사 비교 목록 조회
        getComparisonList: async (storeId: string) => {
          // 이미 캐시에 있다면 API 호출 스킵
          if (get().comparisonListCache[storeId]?.length > 0) {
            return;
          }

          try {
            set({ loading: true, error: null });

            const response = await getCompetitorComparisons(storeId);

            if (response.status === "success" && response.comparisons) {
              set((state) => ({
                comparisonListCache: {
                  ...state.comparisonListCache,
                  [storeId]: response.comparisons
                }
              }));
            }
          } catch (err) {
            console.error("경쟁사 비교 목록 조회 오류:", err);
            set({ error: "경쟁사 분석 목록을 불러오는데 실패했습니다." });
          } finally {
            set({ loading: false });
          }
        },

        // 특정 비교 분석 결과 조회
        getComparisonDetail: async (comparisonId: string) => {
          // 이미 캐시에 있다면 API 호출 스킵
          if (get().comparisonDetailCache[comparisonId]) {
            set({ selectedComparisonId: comparisonId });
            return;
          }

          try {
            set({ loading: true, error: null });

            const response = await getCompetitorComparisonResult(comparisonId);

            if (response.status === "success" && response.comparison_result) {
              const fullData = {
                ...response.comparison_result,
                comparison_data: {
                  ...response.comparison_result.comparison_data,
                  comparison_insight:
                    response.comparison_result.comparison_insight || ""
                }
              };

              set((state) => ({
                comparisonDetailCache: {
                  ...state.comparisonDetailCache,
                  [comparisonId]: fullData
                },
                selectedComparisonId: comparisonId
              }));
            } else {
              set({ error: "경쟁사 분석 결과를 불러오는데 실패했습니다." });
            }
          } catch (err) {
            console.error("경쟁사 분석 결과 조회 오류:", err);
            set({ error: "경쟁사 분석 결과를 불러오는데 실패했습니다." });
          } finally {
            set({ loading: false });
          }
        },
        // 캐시 초기화
        clearCache: () =>
          set({
            comparisonListCache: {},
            comparisonDetailCache: {},
            selectedComparisonId: null
          })
      }),
      {
        name: "competitor-store",
        partialize: (state) => ({
          // 클라이언트 스토리지에 유지할 데이터만 선택
          comparisonListCache: state.comparisonListCache,
          comparisonDetailCache: state.comparisonDetailCache,
          selectedComparisonId: state.selectedComparisonId
        })
      }
    )
  )
);
