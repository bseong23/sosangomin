// 종합분석 보고서 상태 관리를 위한 커스텀 훅 정의

import { useState, useCallback, useEffect } from "react";
import finalReportApi from "../api/finalReportApi";
import useStoreStore from "@/store/storeStore"; // 경로는 실제 위치에 맞게 수정해주세요
import {
  FinalReportDetail,
  FinalReportListItem,
  CreateFinalReportRequest,
  CreateFinalReportResponse,
  ErrorResponse
} from "../types/finalReport";

// 보고서 생성 훅
export const useCreateFinalReport = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [data, setData] = useState<CreateFinalReportResponse | null>(null);

  const createReport = useCallback(
    async (requestData: CreateFinalReportRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await finalReportApi.createFinalReport(requestData);
        setData(response);
        return response;
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
  // 매장 스토어에서 데이터 가져오기
  const { representativeStore, stores } = useStoreStore();

  // 초기 매장 ID 결정 로직
  const defaultStoreId =
    initialStoreId ||
    (representativeStore ? representativeStore.store_id.toString() : undefined);

  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(
    undefined
  );
  const [currentStoreId, setCurrentStoreId] = useState<string | undefined>(
    defaultStoreId
  );

  // 매장 등록 여부 확인
  const hasRegisteredStore = stores.length > 0;
  // 현재 선택된 매장 정보
  const currentStore = currentStoreId
    ? stores.find((store) => store.store_id.toString() === currentStoreId) ||
      null
    : representativeStore;

  // 각 기능별 훅 사용
  const {
    createReport,
    isLoading: isCreating,
    error: createError,
    data: createData
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

  // 보고서 생성 핸들러 - 생성 후 해당 보고서의 상세 정보 조회
  const handleCreateReport = useCallback(
    async (storeId: string) => {
      try {
        const response = await createReport({ store_id: storeId });

        // 보고서 목록 새로고침
        if (currentStoreId === storeId) {
          fetchReportList(storeId);
        }

        // 생성된 보고서의 ID가 있으면 해당 보고서 상세 정보 조회
        if (response && response.report_id) {
          setSelectedReportId(response.report_id);
        }

        return response;
      } catch (error) {
        throw error;
      }
    },
    [createReport, currentStoreId, fetchReportList, setSelectedReportId]
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

  // 매장이 없거나 선택된 매장이 없을 때, reportList나 reportDetail을 초기화
  useEffect(() => {
    if (!hasRegisteredStore || !currentStoreId) {
      // 필요한 경우 상태 초기화 로직 추가
    }
  }, [hasRegisteredStore, currentStoreId]);

  return {
    // 매장 관련 상태
    hasRegisteredStore,
    stores,
    representativeStore,
    currentStore,

    // 보고서 관련 상태
    currentStoreId,
    selectedReportId,
    reportList,
    reportDetail,
    createData,

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
