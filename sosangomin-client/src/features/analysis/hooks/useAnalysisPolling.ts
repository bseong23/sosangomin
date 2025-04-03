// features/analysis/hooks/useAnalysisPolling.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { getAnalysisResult } from "../api/analysisApi";
import { AnalysisState } from "../types/analysis";

interface UseAnalysisPollingOptions {
  pollingInterval?: number; // 폴링 간격 (ms)
  maxAttempts?: number; // 최대 시도 횟수
}

/**
 * 분석 결과를 주기적으로 폴링하는 hook
 * - 분석이 완료될 때까지 주기적으로 상태를 확인합니다
 */
export const useAnalysisPolling = (
  analysisId: string | null,
  options: UseAnalysisPollingOptions = {}
) => {
  const {
    pollingInterval = 3000, // 기본 3초
    maxAttempts = 100 // 기본 최대 100회 시도 (약 5분)
  } = options;

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    data: null,
    isLoading: false,
    error: null
  });

  const [polling, setPolling] = useState<boolean>(false);
  const attemptCountRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 폴링 중지 함수
  const stopPolling = useCallback(() => {
    setPolling(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 폴링 시작 함수
  const startPolling = useCallback(() => {
    if (!analysisId) return;

    setPolling(true);
    attemptCountRef.current = 0;

    // 초기 상태 설정
    setAnalysisState((prev) => ({
      ...prev,
      isLoading: true,
      error: null
    }));
  }, [analysisId]);

  // 폴링 로직
  useEffect(() => {
    if (!polling || !analysisId) return;

    const fetchAnalysisStatus = async () => {
      try {
        const response = await getAnalysisResult(analysisId);

        if (response.status === "success" || response.status === "failed") {
          // 즉시 로딩 상태 false로 변경
          setAnalysisState({
            data: response,
            isLoading: false,
            error: null
          });

          // 폴링 즉시 중지
          stopPolling();
          return;
        }
      } catch (error) {
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "분석 상태 확인 중 오류가 발생했습니다"
        }));
        stopPolling();
      }
    };

    fetchAnalysisStatus();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [analysisId, polling, pollingInterval, maxAttempts]);

  // 컴포넌트 언마운트 시 폴링 중지
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    analysisState,
    polling,
    startPolling,
    stopPolling
  };
};

export default useAnalysisPolling;
