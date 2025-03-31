// src/pages/ReviewStore.tsx

import React from "react";
import { useParams } from "react-router-dom";
import ReviewDashBoard from "@/features/review/components/ReviewDashBoard";
import { useReviewAnalysis } from "@/features/review/hooks/useReviewAnalysis";
import Loading from "@/components/common/Loading";
import ErrorMessage from "@/features/review/components/ErrorMessage";

const ReviewStore: React.FC = () => {
  // URL 파라미터에서 분석 ID 가져오기 (옵션)
  const { analysisId } = useParams<{ analysisId?: string }>();

  // 기본 스토어 ID (실제 환경에서는 사용자의 매장 ID를 가져와야 함)
  const defaultStoreId = 1;

  // 리뷰 분석 훅 사용
  const { loading, error, analysisResult, requestAnalysis } = useReviewAnalysis(
    analysisId,
    defaultStoreId
  );

  // 새 분석 요청 핸들러
  const handleRequestAnalysis = () => {
    // 예시 place_id (실제로는 사용자가 선택한 장소 ID를 사용해야 함)
    requestAnalysis(defaultStoreId, "1234567890");
  };

  return (
    <div className="mt-10">
      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage
          message={error}
          actionLabel="리뷰 분석 시작하기"
          onAction={handleRequestAnalysis}
        />
      ) : analysisResult ? (
        // 분석 결과가 있는 경우 리뷰 대시보드에 데이터 전달
        <ReviewDashBoard
          analysisData={analysisResult}
          onRequestAnalysis={handleRequestAnalysis}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 mx-4">
          <p className="text-lg mb-4">아직 분석된 리뷰가 없습니다.</p>
          <button
            onClick={handleRequestAnalysis}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            리뷰 분석 시작하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewStore;
