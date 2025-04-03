import React, { useRef, useEffect, useState } from "react";
import { MapSidebarProps } from "@/features/map/types/map";
import BarChart from "@/components/chart/BarChart";
import AnalysisModal from "@/features/map/components/maps/AnalysisModal";
import { getAreaAnalysisSummary } from "@/features/map/api/analiysisApi"; // API 함수 import
import Loading from "@/components/common/Loading";
import donglist from "@/assets/dong_list.json";

const Analysismap: React.FC<MapSidebarProps> = ({
  selectedAdminName,
  selectedCategory
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      if (
        !selectedAdminName ||
        !selectedCategory ||
        !donglist.includes(selectedAdminName!)
      ) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getAreaAnalysisSummary(
          selectedAdminName,
          selectedCategory
        );
        setAnalysisData(data);
      } catch (error) {
        console.error("분석 데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  }, [selectedAdminName, selectedCategory]);

  // 동을 선택하지 않은 경우
  if (!donglist.includes(selectedAdminName!)) {
    return (
      <div className="px-5 py-10 mb-6 bg-white rounded-lg flex flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          동을 클릭해주세요
        </h2>
        <p className="text-gray-500 text-sm">
          지도에서 분석하고 싶은 행정동을 선택하면 상세 정보를 확인할 수
          있습니다
        </p>
      </div>
    );
  }

  // 가게 카테고리가 없는 경우
  if (!selectedCategory) {
    return (
      <div className="px-5 py-10 mb-6 bg-white rounded-lg flex flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          가게 등록이 필요합니다
        </h2>
        <p className="text-gray-500 text-sm">
          마이페이지에서 가게를 등록하고 업종을 선택하면 상권 분석 정보를 확인할
          수 있습니다
        </p>
      </div>
    );
  }

  // 업종 분포 바 차트 데이터
  const businessChartData = analysisData
    ? {
        labels: Object.keys(
          analysisData.업종분석.요식업_도넛_및_순위.도넛
        ).slice(0, 5),
        datasets: [
          {
            label: "업종별 점포 수",
            data: Object.values(
              analysisData.업종분석.요식업_도넛_및_순위.도넛
            ).slice(0, 5) as number[],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          }
        ]
      }
    : null;

  // 모달 열기/닫기 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 컨테이너 크기 조정 (기존 코드 유지)

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!analysisData) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }
  return (
    <div
      ref={containerRef}
      className="px-5 pt-5 flex flex-col min-h-0 min-w-0 bg-white"
    >
      {/* 헤더 섹션 */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-gray-800">
            {selectedAdminName} 상권 분석
          </h2>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-bit-main text-white rounded-md hover:bg-blue-900 transition duration-300"
          >
            상세 보기
          </button>
        </div>
      </div>

      {/* 인구 분포도 섹션 */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">인구 분포</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              <p className="text-base text-gray-600">가장 많은 거주 연령대</p>
              <p className="text-base">
                {analysisData.인구분석.가장_많은_거주_연령대.구분}
                <span className="ml-2 text-gray-500">
                  ({analysisData.인구분석.가장_많은_거주_연령대.인구수}명)
                </span>
              </p>
            </div>

            <div className="mb-2">
              <p className="text-base text-gray-600">가장 많은 직장 연령대</p>
              <p className="text-base">
                {analysisData.인구분석.가장_많은_직장_연령대.구분}
                <span className="ml-2 text-gray-500">
                  ({analysisData.인구분석.가장_많은_직장_연령대.인구수}명)
                </span>
              </p>
            </div>
            <div className="mb-2">
              <p className="text-base text-gray-600">가장 많은 유동 연령대</p>
              <p className="text-base">
                {analysisData.인구분석.가장_많은_유동_연령대.구분}
                <span className="ml-2 text-gray-500">
                  ({analysisData.인구분석.가장_많은_직장_연령대.인구수}명)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 상권 분포도 섹션 */}
      {businessChartData && (
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            상권 분포 (상위 5개 업종)
          </h3>
          <BarChart
            labels={businessChartData.labels}
            datasets={businessChartData.datasets}
            height={200}
            responsive={true}
            maintainAspectRatio={false}
            gridLines={true}
            beginAtZero={true}
            animation={true}
          />
          <div className="mt-4">
            <p className="text-base text-gray-600"> {selectedCategory} 순위</p>
            <p className="text-base font-bold text-blue-600">
              {analysisData.업종분석.요식업_도넛_및_순위.내_업종_순위}위
            </p>
          </div>
        </div>
      )}

      {/* 매출 분석 요약 */}
      <div className="mb-6 bg-white rounded-lg shadow p-4 z-50">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          매출 분석 요약
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-base text-gray-600">매출 많은 요일</p>
            <p className="text-base font-semibold">
              {analysisData.매출분석.매출_금액_많은_요일}
            </p>
          </div>
          <div>
            <p className="text-base text-gray-600">매출 많은 시간대</p>
            <p className="text-base font-semibold">
              {analysisData.매출분석.매출_금액_많은_시간대}
            </p>
          </div>
          <div>
            <p className="text-base text-gray-600">매출 많은 연령대</p>
            <p className="text-base font-semibold">
              {analysisData.매출분석.매출_금액_많은_연령대}
            </p>
          </div>
        </div>
      </div>

      {/* 모달 컴포넌트 */}
      <AnalysisModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedAdminName={selectedAdminName as string | undefined}
        selectedCategory={selectedCategory as string | undefined}
      />
    </div>
  );
};

export default Analysismap;
