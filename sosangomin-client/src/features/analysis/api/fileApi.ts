import axiosInstance from "@/api/axios";

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

    // 개발 환경 모의 데이터 부분 제거 - 이 부분을 삭제

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
