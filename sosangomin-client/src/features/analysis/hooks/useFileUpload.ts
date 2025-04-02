// features/files/hooks/useFileUpload.ts
import { useState, useCallback } from "react";
import { uploadFiles } from "../api/fileApi";

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  objectId?: string; // 서버에서 받은 ID
  originalFile: File; // 실제 파일 객체 저장
}

interface FileUploadState {
  files: FileInfo[];
  isUploading: boolean;
  error: string | null;
  uploadedObjectIds: string[];
}

interface FileUploadOptions {
  storeId: string;
  startMonth: string;
  endMonth: string;
}

/**
 * 파일 업로드 및 관리 기능을 제공하는 hook
 */
export const useFileUpload = () => {
  const [fileState, setFileState] = useState<FileUploadState>({
    files: [],
    isUploading: false,
    error: null,
    uploadedObjectIds: []
  });

  /**
   * 파일 목록에 추가
   * @param newFiles 추가할 파일 배열
   */
  const addFiles = useCallback((newFiles: File[]) => {
    setFileState((prev) => {
      // 이미 존재하는 파일 필터링 (중복 방지)
      const existingFileNames = new Set(prev.files.map((f) => f.name));
      const filteredNewFiles = newFiles.filter(
        (file) => !existingFileNames.has(file.name)
      );

      // FileInfo 객체로 변환 (originalFile 필드 추가)
      const newFileInfos: FileInfo[] = filteredNewFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        originalFile: file // 원본 파일 객체 저장
      }));

      return {
        ...prev,
        files: [...prev.files, ...newFileInfos],
        error: null
      };
    });
  }, []);

  /**
   * 파일 목록에서 제거 (UI에서만 제거)
   * @param index 제거할 파일의 인덱스
   */
  const removeFile = useCallback((index: number) => {
    // UI에서 파일 제거
    setFileState((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  }, []);

  /**
   * 파일 서버에 업로드
   * @param options 업로드 옵션 (storeId, 기간 등)
   * @returns {Promise<{success: boolean, objectIds: string[]}>} 성공 여부와 업로드된 파일 ID 목록
   */
  const uploadFilesToServer = useCallback(
    async (
      options: FileUploadOptions
    ): Promise<{ success: boolean; objectIds: string[] }> => {
      const { storeId, startMonth, endMonth } = options;

      // 업로드할 파일이 없는 경우
      if (fileState.files.length === 0) {
        setFileState((prev) => ({
          ...prev,
          error: "업로드할 파일이 없습니다."
        }));
        return { success: false, objectIds: [] };
      }

      setFileState((prev) => ({
        ...prev,
        isUploading: true,
        error: null
      }));

      try {
        // 저장된 원본 파일 객체 사용
        const filesToUpload: File[] = fileState.files.map(
          (fileInfo) => fileInfo.originalFile
        );

        console.log("파일 업로드 시작:", {
          storeId,
          startMonth,
          endMonth,
          fileCount: filesToUpload.length
        });

        const response = await uploadFiles(
          filesToUpload,
          storeId,
          startMonth,
          endMonth
        );

        console.log("파일 업로드 응답:", response);

        if (response.status === "error" || response.errorMessage) {
          setFileState((prev) => ({
            ...prev,
            isUploading: false,
            error: response.errorMessage || "파일 업로드에 실패했습니다."
          }));
          return { success: false, objectIds: [] };
        }

        // 업로드 성공 처리
        const uploadedIds = response.ObjectIdList || [];

        console.log("업로드된 파일 ID:", uploadedIds);

        if (uploadedIds.length === 0) {
          console.warn("업로드된 파일 ID가 없습니다.");
        }

        // 파일 정보에 objectId 추가
        const updatedFiles = fileState.files.map((file, index) => ({
          ...file,
          objectId: uploadedIds[index] || file.objectId
        }));

        setFileState({
          files: updatedFiles,
          isUploading: false,
          error: null,
          uploadedObjectIds: uploadedIds
        });

        // 성공 여부와 함께 ID 목록을 직접 반환
        return { success: true, objectIds: uploadedIds };
      } catch (error) {
        console.error("파일 업로드 중 오류 발생:", error);
        setFileState((prev) => ({
          ...prev,
          isUploading: false,
          error: "파일 업로드 중 오류가 발생했습니다."
        }));
        return { success: false, objectIds: [] };
      }
    },
    [fileState.files]
  );

  /**
   * 모든 파일 및 상태 초기화
   */
  const clearFiles = useCallback(() => {
    setFileState({
      files: [],
      isUploading: false,
      error: null,
      uploadedObjectIds: []
    });
  }, []);

  return {
    files: fileState.files,
    isUploading: fileState.isUploading,
    error: fileState.error,
    uploadedObjectIds: fileState.uploadedObjectIds,
    addFiles,
    removeFile,
    uploadFilesToServer, // 이제 {success, objectIds}를 반환
    clearFiles
  };
};

export default useFileUpload;
