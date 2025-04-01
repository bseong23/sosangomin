// features/review/hooks/useReviewAnalysis.ts

import { useState, useEffect } from "react";
import {
  requestReviewAnalysis,
  getReviewAnalysisResult
} from "@/features/review/api/reviewApi";
import {
  ReviewAnalysisResult,
  ReviewAnalysisSummary,
  ErrorResponse
} from "@/features/review/types/review";

interface UseReviewAnalysisReturn {
  loading: boolean;
  error: string | null;
  analysisResult: ReviewAnalysisResult | null;
  analysisList: ReviewAnalysisSummary[];
  requestAnalysis: (storeId: string, placeId: string) => Promise<void>;
  fetchAnalysisResult: (analysisId: string) => Promise<void>;
}

/**
 * 리뷰 분석 커스텀 훅
 */
export function useReviewAnalysis(
  initialAnalysisId?: string
  // storeId: number = 1
): UseReviewAnalysisReturn {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] =
    useState<ReviewAnalysisResult | null>(null);
  const [analysisList, setAnalysisList] = useState<ReviewAnalysisSummary[]>([]);

  const isErrorResponse = (data: any): data is ErrorResponse => {
    return data && "error" in data && "message" in data;
  };

  // 분석 ID로 분석 결과 가져오기
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
      setError("분석 결과를 가져오는 중 오류가 발생했습니다.");
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  // 새 분석 요청 (POST)
  const requestAnalysis = async (storeId: string, placeId: string) => {
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
      }
    } catch (err) {
      setError("리뷰 분석 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialAnalysisId) {
      fetchAnalysisResult(initialAnalysisId);
    } else {
      setLoading(false);
    }
  }, [initialAnalysisId]);

  return {
    loading,
    error,
    analysisResult,
    analysisList,
    requestAnalysis,
    fetchAnalysisResult
  };
}
