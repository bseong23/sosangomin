import { useNavigate } from "react-router-dom";
import useFileModalStore from "@/store/modalStore";

// 페이지 이동시 데이터 입력 상태 초기화
export const useNavigateWithReset = () => {
  const navigate = useNavigate();
  const { resetAfterAnalysis } = useFileModalStore();

  const navigateWithReset = (path: string, options?: any) => {
    // 상태 초기화
    resetAfterAnalysis();

    // 지정된 경로로 이동
    navigate(path, options);
  };

  return navigateWithReset;
};

export default useNavigateWithReset;
