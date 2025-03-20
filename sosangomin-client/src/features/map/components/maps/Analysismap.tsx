import React, { useRef, useEffect } from "react";
import { MapSidebarProps } from "@/features/map/types/map";
import DoughnutChart from "@/components/chart/DoughnutChart";
import BarChart from "@/components/chart/BarChart";

const Analysismap: React.FC<MapSidebarProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  // 컨테이너 크기 조정을 위한 useEffect
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        // 필요한 경우 컨테이너 크기 조정 로직
        const parentHeight =
          containerRef.current.parentElement?.clientHeight || 0;
        containerRef.current.style.maxHeight = `${parentHeight - 20}px`; // 여백 고려
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
      className="p-6 overflow-y-auto"
      style={{
        maxHeight: "calc(100vh - 73px)", // 헤더 높이(73px) 고려
        display: "flex",
        flexDirection: "column",
        minHeight: 0, // flex 컨테이너 내에서 스크롤 가능하게 함
        minWidth: 0
      }}
    >
      {/* 헤더 섹션 */}
      <div className="mb-6 relative flex-shrink-0">
        <h2 className="text-xl font-bold">내 주변 상권은?</h2>
      </div>

      {/* 인구 분포도 섹션 */}
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-2">인구 분포도</h3>
        <div className="w-full h-full">
          <DoughnutChart chartData={chartData} />
        </div>
      </div>

      {/* 상권 분포도 섹션 */}
      <div className="mb-6 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-2">상권 분포도</h3>
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
    </div>
  );
};

export default Analysismap;
