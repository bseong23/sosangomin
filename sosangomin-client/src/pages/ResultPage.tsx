import React, { useEffect, useState } from "react";
import HeaderComponent from "../features/finalreport/components/HeaderComponent";
import SwotDetailComponent from "../features/finalreport/components/SwotDetailComponent";
import RecommendationsComponent from "../features/finalreport/components/RecommendationsComponent";
import VisualizationComponent from "../features/finalreport/components/VisualizationComponent";
import FullAnalysisComponent from "../features/finalreport/components/FullAnalysisComponent";
import RelatedAnalysesComponent from "../features/finalreport/components/RelatedAnalysesComponent";
import { ReportData, mockReportData } from "../features/finalreport/types";
import Loading from "@/components/common/Loading";

const ResultPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log(setError);
  useEffect(() => {
    // 실제 API 연동 시에는 아래 주석을 해제하고 mockReportData를 제거합니다.
    /*
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/report/1'); // 실제 API 엔드포인트로 교체
        
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setReportData(data);
        setError(null);
      } catch (err) {
        setError('보고서 데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
    */

    // 개발 중에는 목업 데이터 사용
    setTimeout(() => {
      setReportData(mockReportData);
      setLoading(false);
    }, 500); // 로딩 상태를 시뮬레이션하기 위한 지연
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
            오류가 발생했습니다
          </h2>
          <p className="text-gray-600 text-center">
            {error || "알 수 없는 오류가 발생했습니다."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-12">
      <div className="max-w-6xl mx-auto px-4">
        <HeaderComponent data={reportData} />
        <SwotDetailComponent data={reportData} />

        {/* 두 섹션의 높이를 맞추기 위해 flex 사용 */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="lg:w-2/3">
            <VisualizationComponent data={reportData} />
          </div>
          <div className="lg:w-1/3">
            <RecommendationsComponent data={reportData} />
          </div>
        </div>
        <FullAnalysisComponent data={reportData} />
        <RelatedAnalysesComponent data={reportData} />
      </div>
    </div>
  );
};

export default ResultPage;
