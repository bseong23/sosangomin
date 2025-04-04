import React from "react";
import { Chart as ChartJS, TooltipItem } from "chart.js";
import DoughnutChart from "@/components/chart/DoughnutChart";
import { DoughnutChartProps } from "@/types/chart";

// 공통 DoughnutChart 컴포넌트를 그대로 사용하면서
// 퍼센트 표시 기능을 추가한 래퍼 컴포넌트
const PercentageDoughnutChart: React.FC<DoughnutChartProps> = ({
  chartData,
  ...props
}) => {
  React.useEffect(() => {
    // 기존 tooltip 설정을 보존하면서 새 설정 추가
    const originalTooltipCallbacks = ChartJS.defaults.plugins.tooltip.callbacks;

    // 퍼센트 표시를 위한 custom tooltip 설정
    ChartJS.defaults.plugins.tooltip.callbacks = {
      ...originalTooltipCallbacks,
      label: (tooltipItem: TooltipItem<"doughnut">) => {
        // 현재 데이터 값
        const value = tooltipItem.raw as number;

        // 해당 데이터셋의 전체 합계
        const total = (tooltipItem.dataset.data as number[]).reduce(
          (acc, curr) => acc + curr,
          0
        );

        // 퍼센트 계산 (소수점 1자리까지)
        const percentage = ((value / total) * 100).toFixed(1);

        // 라벨 형식: 카테고리명: 값 (퍼센트%)
        return `${tooltipItem.label}: ${percentage}%`;
      }
    };

    // 컴포넌트가 언마운트될 때 원래 설정으로 복원
    return () => {
      ChartJS.defaults.plugins.tooltip.callbacks = originalTooltipCallbacks;
    };
  }, []);

  return <DoughnutChart chartData={chartData} {...props} />;
};

export default PercentageDoughnutChart;
