import React from "react";
import LineChart from "@/components/chart/LineChart";
import { AnalysisResultData } from "../../types/analysis";

interface PredictedSalesSectionProps {
  data: AnalysisResultData;
}

const PredictedSalesSection: React.FC<PredictedSalesSectionProps> = ({
  data
}) => {
  // 예측 매출 데이터
  const predictions =
    data?.auto_analysis_results?.predict?.predictions_30 || {};
  const predictSummary =
    data?.auto_analysis_results?.summaries?.predict_summary || {};

  // 날짜와 매출 데이터 추출
  const labels = Object.keys(predictions).map((date) => {
    // YYYYMMDD 형식의 날짜를 MM/DD 형식으로 변환
    return `${date.slice(4, 6)}/${date.slice(6, 8)}`;
  });

  const salesData = Object.values(predictions);

  const datasets = [
    {
      label: "예측 매출",
      data: salesData,
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.3
    }
  ];

  // 전구 아이콘 SVG
  const LightBulbIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="inline-block mr-2"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 0.55 0.45 1 1 1h6c0.55 0 1-0.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
        fill="#FFD700"
        stroke="#E6B800"
        strokeWidth="0.5"
      />
      <path
        d="M9 20h6v1c0 0.55-0.45 1-1 1h-4c-0.55 0-1-0.45-1-1v-1z"
        fill="#FFD700"
        stroke="#E6B800"
        strokeWidth="0.5"
      />
      <ellipse cx="9" cy="8" rx="1.5" ry="2" fill="#FFFACD" opacity="0.7" />
      <g opacity="0.5">
        <path
          d="M12 0V2"
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M18.364 2.636L16.95 4.05"
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M21 7L19 7"
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M5.636 4.05L7.05 2.636"
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M5 7L3 7"
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  // 예측 데이터가 없으면 디버깅 정보 출력 후 빈 컴포넌트 반환
  if (!predictions || Object.keys(predictions).length === 0) {
    console.log("예측 데이터가 없습니다:", {
      predictions,
      autoAnalysisResults: data?.auto_analysis_results
    });

    return (
      <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          30일 매출 예측
        </h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-500">매출 예측 데이터가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-10 text-comment">
        30일 매출 예측
      </h2>
      <p className="text-base text-comment mb-10">
        이전 매출 흐름을 바탕으로, 다음 30일 동안의 매출을 보여드려요.
      </p>
      <div className="mb-10" style={{ width: "100%", height: "350px" }}>
        <LineChart labels={labels} datasets={datasets} legend={false} />
      </div>
      <div className="mt-2 mb-2">
        <div className="grid grid-cols-3 mb-10 gap-10 bg-white rounded-lg">
          <div className="flex flex-col">
            <h4 className="text-sm text-center px-6 font-medium mb-1">
              예측 분석
            </h4>
            <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
              {predictSummary?.summary}
            </p>
          </div>

          {predictSummary?.sales_pattern && (
            <div className="flex flex-col">
              <h4 className="text-sm text-center px-6 font-medium mb-1">
                매출 패턴
              </h4>
              <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
                {predictSummary.sales_pattern}
              </p>
            </div>
          )}

          {predictSummary?.weekend_effect && (
            <div className="flex flex-col">
              <h4 className="text-sm text-center px-6 font-medium mb-1">
                주말 효과
              </h4>
              <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
                {predictSummary.weekend_effect}
              </p>
            </div>
          )}
        </div>
        {predictSummary?.recommendation && (
          <div className="flex flex-col">
            <h4 className="text-sm text-center px-6 font-medium mb-2">
              <div className="flex items-center justify-center">
                <LightBulbIcon />
                추천 사항
              </div>
            </h4>
            <p className="text-xs text-comment bg-blue-50 p-6 rounded-lg flex-grow h-full">
              {predictSummary.recommendation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictedSalesSection;
