import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFileModalStore from "@/store/modalStore";

// 이 컴포넌트는 URL 변경을 감지하고 상태를 초기화합니다
const RouterChangeDetector: React.FC = () => {
  const location = useLocation();
  const { resetAfterAnalysis } = useFileModalStore();

  useEffect(() => {
    // URL이 변경될 때마다 초기화 함수 호출
    // 메인 페이지에서도 컴포넌트는 마운트될 수 있으므로,
    // 첫 렌더링 시에는 초기화하지 않도록 deps에 location.pathname을 포함
    return () => {
      // URL 변경으로 컴포넌트가 언마운트될 때 초기화
      resetAfterAnalysis();
    };
  }, [location.pathname, resetAfterAnalysis]);

  return null; // UI는 렌더링하지 않음
};

export default RouterChangeDetector;
