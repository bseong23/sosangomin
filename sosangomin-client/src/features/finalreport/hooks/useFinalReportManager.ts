// 종합분석 보고서 상태 관리를 위한 커스텀 훅 정의

import { useState, useCallback, useEffect } from "react";
import finalReportApi from "../api/finalReportApi";
import {
  FinalReportDetail,
  FinalReportListItem,
  CreateFinalReportRequest,
  ErrorResponse
} from "../types/finalReport";

// 보고서 생성 훅
export const useCreateFinalReport = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [data, setData] = useState<FinalReportDetail | null>(null);

  const createReport = useCallback(
    async (requestData: CreateFinalReportRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await finalReportApi.createFinalReport(requestData);
        // createFinalReport 응답 구조를 FinalReportDetail 형태로 변환
        const finalReportDetail: FinalReportDetail = {
          _id: response.store_id.toString(), // API 응답에 _id가 없어서 임시로 store_id를 사용
          store_id: response.store_id,
          store_name: response.store_name,
          created_at: response.created_at,
          swot_analysis: response.swot_analysis,
          full_response: response.full_response,
          related_analyses: response.related_analyses
        };
        setData(finalReportDetail);
        return finalReportDetail;
      } catch (err) {
        const errorResponse = err as ErrorResponse;
        setError(errorResponse);
        throw errorResponse;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createReport, isLoading, error, data };
};

// 보고서 상세 조회 훅
export const useFinalReport = (reportId?: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [data, setData] = useState<FinalReportDetail | null>(null);

  const fetchReport = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await finalReportApi.getFinalReport(id);
      setData(response.report);
      return response.report;
    } catch (err) {
      const errorResponse = err as ErrorResponse;
      setError(errorResponse);
      throw errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reportId) {
      fetchReport(reportId).catch(() => {
        // 에러는 이미 setError에서 처리됨
      });
    }
  }, [reportId, fetchReport]);

  return { fetchReport, isLoading, error, data };
};

// 보고서 목록 조회 훅
export const useFinalReportList = (storeId?: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [data, setData] = useState<FinalReportListItem[]>([]);

  const fetchReportList = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await finalReportApi.getFinalReportList(id);
      setData(response.reports);
      return response.reports;
    } catch (err) {
      const errorResponse = err as ErrorResponse;
      setError(errorResponse);
      throw errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      fetchReportList(storeId).catch(() => {
        // 에러는 이미 setError에서 처리됨
      });
    }
  }, [storeId, fetchReportList]);

  return { fetchReportList, isLoading, error, data };
};

// 모든 종합분석 관련 상태를 관리하는 통합 훅
export const useFinalReportManager = (initialStoreId?: string) => {
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(
    initialStoreId
  );

  // 각 기능별 훅 사용
  const {
    createReport,
    isLoading: isCreating,
    error: createError
  } = useCreateFinalReport();

  const {
    data: reportList,
    isLoading: isLoadingList,
    error: listError,
    fetchReportList
  } = useFinalReportList(currentStoreId);

  const {
    data: reportDetail,
    isLoading: isLoadingDetail,
    error: detailError,
    fetchReport
  } = useFinalReport(selectedReportId);

  // 보고서 생성 핸들러
  const handleCreateReport = useCallback(
    async (storeId: string) => {
      try {
        const response = await createReport({ store_id: storeId });
        if (response && currentStoreId === storeId) {
          fetchReportList(storeId);
        }
        return response;
      } catch (error) {
        throw error;
      }
    },
    [createReport, currentStoreId, fetchReportList]
  );

  // 매장 ID 변경 핸들러
  const handleStoreChange = useCallback((storeId: string) => {
    setCurrentStoreId(storeId);
    setSelectedReportId(undefined);
  }, []);

  // 보고서 선택 핸들러
  const handleSelectReport = useCallback((reportId: string) => {
    setSelectedReportId(reportId);
  }, []);

  return {
    // 상태
    currentStoreId,
    selectedReportId,
    reportList,
    reportDetail,

    // 로딩 상태
    isCreating,
    isLoadingList,
    isLoadingDetail,
    isLoading: isCreating || isLoadingList || isLoadingDetail,

    // 에러
    createError,
    listError,
    detailError,
    hasError: !!createError || !!listError || !!detailError,

    // 액션 핸들러
    handleCreateReport,
    handleStoreChange,
    handleSelectReport,

    // 직접 API 호출 함수
    createReport,
    fetchReportList,
    fetchReport
  };
};

export default useFinalReportManager;
