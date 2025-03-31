// features/review/hooks/useReviewAnalysis.ts

import { useState, useEffect } from "react";
import {
  requestReviewAnalysis,
  getStoreReviewAnalyses,
  getReviewAnalysisResult,
  getLatestReviewAnalysis
} from "@/features/review/api/reviewApi";
import {
  ReviewAnalysisResult,
  ReviewAnalysisSummary,
  ErrorResponse
} from "@/features/review/types/Review";

interface UseReviewAnalysisReturn {
  loading: boolean;
  error: string | null;
  analysisResult: ReviewAnalysisResult | null;
  analysisList: ReviewAnalysisSummary[];
  requestAnalysis: (storeId: number, placeId: string) => Promise<void>;
  fetchAnalysisResult: (analysisId: string) => Promise<void>;
  fetchLatestAnalysis: (storeId: number) => Promise<void>;
}

/**
 * 리뷰 분석 관련 커스텀 훅
 * @param initialAnalysisId 초기 분석 ID (옵션)
 * @param storeId 매장 ID (옵션)
 * @returns 분석 상태, 결과, 함수 등을 포함한 객체
 */
export function useReviewAnalysis(
  initialAnalysisId?: string,
  storeId: number = 1
): UseReviewAnalysisReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<ReviewAnalysisResult | null>(null);
  const [analysisList, setAnalysisList] = useState<ReviewAnalysisSummary[]>([]);

  /**
   * API 응답이 에러인지 확인
   */
  const isErrorResponse = (data: any): data is ErrorResponse => {
    return data && "error" in data && "message" in data;
  };

  /**
   * 분석 ID로 리뷰 분석 결과 조회
   */
  const fetchAnalysisResult = async (analysisId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getReviewAnalysisResult(analysisId);

      if (isErrorResponse(result)) {
        setError(result.error);
        setAnalysisResult(null);
      } else {
        setAnalysisResult(result);
      }
    } catch (err) {
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 매장의 최신 분석 결과 조회
   */
  const fetchLatestAnalysis = async (storeId: number) => {
    try {
      setLoading(true);
      setError(null);

      // 최신 분석 결과 가져오기 시도
      const latestResult = await getLatestReviewAnalysis(storeId);

      if (isErrorResponse(latestResult)) {
        // 최신 분석 결과 조회 실패 시, 분석 목록을 가져와서 최신 항목 조회
        const analyses = await getStoreReviewAnalyses(storeId);

        if (isErrorResponse(analyses)) {
          setError(analyses.error);
          return;
        }

        setAnalysisList(analyses.reviews_analyses);

        if (analyses.reviews_analyses.length > 0) {
          // 최신 분석 결과의 ID로 상세 정보 가져오기
          const latestAnalysisId = analyses.reviews_analyses[0].analysis_id;
          const result = await getReviewAnalysisResult(latestAnalysisId);

          if (isErrorResponse(result)) {
            setError(result.error);
          } else {
            setAnalysisResult(result);
          }
        } else {
          setError("분석 결과가 없습니다.");
        }
      } else {
        // 최신 분석 결과 조회 성공
        setAnalysisResult(latestResult);

        // 분석 목록도 함께 가져오기
        const analyses = await getStoreReviewAnalyses(storeId);
        if (!isErrorResponse(analyses)) {
          setAnalysisList(analyses.reviews_analyses);
        }
      }
    } catch (err) {
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 새 분석 요청
   */
  const requestAnalysis = async (storeId: number, placeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await requestReviewAnalysis({
        store_id: storeId,
        place_id: placeId
      });

      if (isErrorResponse(result)) {
        setError(result.error);
      } else {
        setAnalysisResult(result);

        // 분석 목록 갱신
        await fetchLatestAnalysis(storeId);
      }
    } catch (err) {
      setError("분석 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 초기 로딩
    if (initialAnalysisId) {
      fetchAnalysisResult(initialAnalysisId);
    } else if (storeId) {
      fetchLatestAnalysis(storeId);
    } else {
      setLoading(false);
    }
  }, [initialAnalysisId, storeId]);

  return {
    loading,
    error,
    analysisResult,
    analysisList,
    requestAnalysis,
    fetchAnalysisResult,
    fetchLatestAnalysis
  };
}
