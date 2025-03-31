import React, { useRef, useEffect, useState } from "react";
import { MapSidebarProps } from "@/features/map/types/map";
import DoughnutChart from "@/components/chart/DoughnutChart";
import BarChart from "@/components/chart/BarChart";
import AnalysisModal from "@/features/map/components/maps/AnalysisModal";

const Analysismap: React.FC<MapSidebarProps> = ({ selectedAdminName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [chartData] = React.useState({
    labels: ["10대", "20대", "30대", "40대", "50대 이상"],
    datasets: [
      {
        label: "연령별 분포",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1
      }
    ]
  });

  // 상권 분포도를 위한 데이터
  const barLabels = ["한식", "일식", "중식", "양식", "기타"];
  const barDatasets = [
    {
      label: "상권 분포",
      data: [25, 18, 12, 8, 5],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1
    }
  ];

  // 모달 열기 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 컨테이너 크기 조정을 위한 useEffect
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const parentHeight =
          containerRef.current.parentElement?.clientHeight ||
          window.innerHeight;
        containerRef.current.style.maxHeight = `${parentHeight - 20}px`;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="p-5 overflow-y-auto flex flex-col max-h-[calc(100vh-73px)] min-h-0 min-w-0"
    >
      {/* 헤더 섹션 */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">내 주변 상권은?</h2>
          <button
            onClick={openModal}
            className="px-3 py-1 text-sm text-gray-600 hover:text-blue-900 cursor-pointer"
          >
            상세 보기
          </button>
        </div>
      </div>

      {/* 인구 분포도 섹션 */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">인구 분포도</h3>
        </div>
        <div className="w-full h-full">
          <DoughnutChart chartData={chartData} />
        </div>
      </div>

      {/* 상권 분포도 섹션 */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">상권 분포도</h3>
        </div>
        <BarChart
          labels={barLabels}
          datasets={barDatasets}
          height={180}
          title="업종별 분포"
          responsive={true}
          maintainAspectRatio={false}
          gridLines={true}
          beginAtZero={true}
          animation={true}
        />
      </div>

      {/* 모달 컴포넌트 */}
      <AnalysisModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedAdminName={selectedAdminName as string | undefined}
      />
    </div>
  );
};

export default Analysismap;
