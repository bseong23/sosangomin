// src/features/analysis/components/dashboard/ForecastSection.tsx
import React from "react";

interface ForecastSectionProps {
  basicStats: {
    total_sales: number;
    avg_transaction?: number;
    total_transactions?: number;
    unique_products?: number;
    customer_avg?: number;
  };
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ basicStats }) => {
  // 성장률 (고정값 예시: 실제로는 API에서 받거나 계산해야 함)
  const growthRate = 12.1;

  // 다음달 예상 매출 계산
  const nextMonthForecast = Math.round(
    basicStats.total_sales * (1 + growthRate / 100)
  );

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        다음달 예상 매출액
      </h2>
      <div className="p-8 bg-blue-50 rounded-lg flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-comment">이번달 매출</span>
            <span className="font-medium text-comment">
              ₩{basicStats.total_sales.toLocaleString("ko-KR")}
            </span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <span className="text-comment">예상 성장률</span>
            <span className="text-green-600 font-medium">+{growthRate}%</span>
          </div>
          <div className="bg-basic-white p-6 rounded-lg shadow text-center mb-4">
            <p className="text-comment-text mb-2">다음달 예상 매출액</p>
            <p className="text-bit-main text-3xl font-bold">
              ₩{nextMonthForecast.toLocaleString("ko-KR")}
            </p>
          </div>
          <p className="text-center text-sm text-comment-text">
            이상적인 성장 그래프를 그리고 있으니 현재 전략을 유지하는 것을
            목표로 해보세요!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForecastSection;
