import React from "react";
import BarChart from "@/components/chart/BarChart";

interface SalesRankingCardProps {
  title: string;
  labels: string[];
  datasets: any[];
  height?: number;
  horizontal?: boolean;
  comment?: string;
  unit?: string;
  customOptions?: any; // 새로 추가한 props
}

const SalesRankingCard: React.FC<SalesRankingCardProps> = ({
  title,
  labels,
  datasets,
  height = 250,
  horizontal = false,
  comment,
  unit = "원",
  customOptions // 외부에서 전달된 customOptions
}) => {
  // 기본 차트 옵션
  const defaultOptions = {
    scales: {
      x: {
        // 수직 막대 차트에서 x축 라벨 처리
        ticks: !horizontal
          ? {
              callback: function (index: any) {
                // 인덱스를 이용해 실제 라벨 배열에서 값을 가져옴
                return labels[index];
              }
            }
          : {
              // 수평 막대 차트에서 x축(값 축) 처리
              callback: function (value: any) {
                return (
                  new Intl.NumberFormat("ko-KR").format(value) + ` ${unit}`
                );
              }
            }
      },
      y: {
        // 수평 막대 차트에서 y축 라벨 처리
        gird: {
          display: false // 그리드 표시 안 함
        },
        ticks: horizontal
          ? {
              callback: function (index: any) {
                // 인덱스를 이용해 실제 라벨 배열에서 값을 가져옴
                return labels[index];
              }
            }
          : {
              // 수직 막대 차트에서 y축(값 축) 처리
              callback: function (value: any) {
                return (
                  new Intl.NumberFormat("ko-KR").format(value) + ` ${unit}`
                );
              }
            }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            return (
              label +
              new Intl.NumberFormat("ko-KR").format(context.raw) +
              ` ${unit}`
            );
          }
        }
      }
    }
  };

  // 외부에서 받은 customOptions가 있으면 사용하고, 없으면 defaultOptions 사용
  const finalOptions = customOptions || defaultOptions;

  // BarChart에 필요한 모든 props 전달
  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div style={{ height: `${height}px` }}>
        <BarChart
          labels={labels}
          datasets={datasets}
          height={height}
          horizontal={horizontal}
          legend={false}
          unit={unit}
          customOptions={finalOptions}
        />
        {comment && <p className="text-sm text-gray-600 mt-2">{comment}</p>}
      </div>
    </div>
  );
};

export default SalesRankingCard;
