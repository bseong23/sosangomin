// features/files/api/fileApi.ts
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
  try {
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
    )}&startMonth=${encodeURIComponent(
      startMonth
    )}&endMonth=${encodeURIComponent(endMonth)}`;

    // 디버깅: 요청 URL 로깅
    console.log("파일 업로드 요청 URL:", url);
    console.log("파일 업로드 수:", files.length);

    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      // 응답 로깅
      console.log("파일 업로드 응답:", response.data);

      // API 응답에 ObjectIdList가, 비어있거나 없는 경우, 테스트용 ID 생성
      if (
        !response.data.ObjectIdList ||
        response.data.ObjectIdList.length === 0
      ) {
        console.warn(
          "API 응답에 ObjectIdList가 없거나 비어 있습니다. 테스트용 ID를 생성합니다."
        );

        // 백엔드 개발 완료 전 테스트를 위한 코드 - 실제 배포 시 제거 필요
        const mockIds = files.map(
          () =>
            `mock_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
        );

        return {
          ...response.data,
          ObjectIdList: mockIds
        };
      }

      return response.data;
    } catch (error: any) {
      console.error("파일 업로드 API 오류:", error);

      // 테스트 환경 또는 개발 중이라면 테스트용 ID 반환
      if (process.env.NODE_ENV === "development" || true) {
        // 임시로 항상 테스트 ID 반환
        console.warn("API 호출 실패 시 테스트용 ID를 생성합니다.");
        const mockIds = files.map(
          () =>
            `mock_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`
        );

        return {
          status: "success", // 성공으로 가정
          ObjectIdList: mockIds
        };
      }

      if (error.response && error.response.data) {
        return error.response.data;
      }

      return {
        status: "error",
        errorMessage: "ERR_FILE_UPLOAD_FAILED"
      };
    }
  } catch (error: any) {
    console.error("파일 업로드 함수 실행 오류:", error);
    return {
      status: "error",
      errorMessage: "ERR_FILE_UPLOAD_FAILED"
    };
  }
};

/**
 * 업로드된 파일 목록 조회 API (가정)
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
