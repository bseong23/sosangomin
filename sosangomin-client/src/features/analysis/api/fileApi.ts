import axiosInstance from "@/api/axios";

/**
 * 파일 업로드 API 호출
 * @param files 업로드할 파일 목록
 * @param storeId 암호화된 가게 ID
 * @param startMonth 시작 월 (YYYY-MM 형식)
 * @param endMonth 종료 월 (YYYY-MM 형식)
 * @returns 업로드된 파일의 ObjectId 목록
 */
export const uploadFiles = async (
  files: File[],
  storeId: string,
  startMonth: string,
  endMonth: string
): Promise<{
  ObjectIdList?: string[];
  status?: string;
  errorMessage?: string;
}> => {
  // storeId 유효성 검사
  if (!storeId || storeId === "undefined") {
    console.error("유효하지 않은 스토어 ID:", storeId);
    return {
      status: "error",
      errorMessage: "유효하지 않은 스토어 ID입니다."
    };
  }

  const formData = new FormData();

  // 파일들을 FormData에 추가
  files.forEach((file) => {
    formData.append("files", file);
  });

  // URL에 쿼리 파라미터 직접 추가
  const url = `/api/file?storeId=${encodeURIComponent(
    storeId
  )}&startMonth=${encodeURIComponent(startMonth)}&endMonth=${encodeURIComponent(
    endMonth
  )}`;

  try {
    const response = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    // API 성공 응답 처리
    return {
      ObjectIdList: response.data.ObjectIdList || []
    };
  } catch (error: any) {
    console.error("파일 업로드 API 오류:", error);

    // 개발 환경에서만 테스트 ID 반환
    if (process.env.NODE_ENV === "development") {
      console.warn("개발 환경: 테스트용 ID를 생성합니다.");
      const mockIds = files.map(
        () =>
          `mock_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
      );

      return {
        ObjectIdList: mockIds
      };
    }

    // API 에러 응답이 있는 경우
    if (error.response && error.response.data) {
      return error.response.data;
    }

    // 기본 에러 응답
    return {
      status: "error",
      errorMessage: "ERR_FILE_UPLOAD_FAILED"
    };
  }
};

/**
 * 업로드된 파일 목록 조회 API
 * @param storeId 암호화된 가게 ID
 * @returns 업로드된 파일 목록
 */
export const getUploadedFiles = async (
  storeId: string
): Promise<{ status?: string; errorMessage?: string }> => {
  try {
    const response = await axiosInstance.get(`/api/file/list/${storeId}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      status: "error",
      errorMessage: "ERR_FILE_LIST_FETCH_FAILED"
    };
  }
};
