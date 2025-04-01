// features/analysis/hooks/useAnalysisPolling.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { getAnalysisResult } from "../api/analysisApi";
import { AnalysisState, AnalysisResult } from "../types/analysis";

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
    // 폴링 중이 아니거나, analysisId가 없으면 실행하지 않음
    if (!polling || !analysisId) return;

    const fetchAnalysisStatus = async () => {
      try {
        // 최대 시도 횟수 초과 체크
        if (attemptCountRef.current >= maxAttempts) {
          stopPolling();
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: "분석 결과 확인 시간이 초과되었습니다"
          }));
          return;
        }

        attemptCountRef.current += 1;

        const response = await getAnalysisResult(analysisId);

        if ("error" in response && "message" in response) {
          // 에러 발생 시 폴링 중지
          stopPolling();
          setAnalysisState((prev) => ({
            ...prev,
            isLoading: false,
            error: response.error
          }));
          return;
        }

        // 데이터 업데이트
        setAnalysisState({
          data: response as AnalysisResult, // 타입 단언 추가
          isLoading: polling,
          error: null
        });

        // 분석이 완료되었는지 확인
        if (response.status === "success" || response.status === "failed") {
          stopPolling();
          return;
        }

        // 계속 폴링
        timeoutRef.current = setTimeout(fetchAnalysisStatus, pollingInterval);
      } catch (error) {
        // 예기치 않은 오류 발생 시
        stopPolling();
        setAnalysisState((prev) => ({
          ...prev,
          isLoading: false,
          error: "분석 상태 확인 중 오류가 발생했습니다"
        }));
      }
    };

    // 폴링 시작
    fetchAnalysisStatus();

    // 클린업 함수
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [analysisId, polling, pollingInterval, maxAttempts, stopPolling]);

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
