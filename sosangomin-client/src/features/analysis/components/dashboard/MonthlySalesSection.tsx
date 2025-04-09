import React, { useMemo } from "react";
import BarChart from "@/components/chart/BarChart";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

interface MonthlySalesSectionProps {
  data: AnalysisResultData;
}

const MonthlySalesSection: React.FC<MonthlySalesSectionProps> = ({ data }) => {
  // 월별 매출 데이터
  const monthlySales = data?.result_data?.monthly_sales?.data || {};
  const monthlySalesSummary = data?.result_data?.monthly_sales?.summary || "";

  // 월 이름 변환 함수
  const getMonthName = (month: string) => {
    const monthNames = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return monthNames[monthIndex];
  };

  // 차트 데이터 준비
  const monthlyLabels = useMemo(() => {
    return Object.keys(monthlySales).map((month) => getMonthName(month));
  }, [monthlySales]);

  const monthlyValues = useMemo(() => {
    // 명시적으로 number 배열로 변환
    return Object.values(monthlySales).map((value) => Number(value));
  }, [monthlySales]);

  // 최대값 계산 (Y축 스케일링을 위함)
  const maxValue = useMemo(() => {
    const max = Math.max(...Object.values(monthlySales).map(Number));
    // 최대값의 약 20% 여유 공간을 추가하고 적절한 단위로 반올림
    return Math.ceil((max * 1.2) / 1000000) * 1000000;
  }, [monthlySales]);

  // 마크다운 렌더링을 위한 스타일
  const markdownComponents = {
    h1: (props: any) => (
      <h1 className="text-2xl font-bold my-4 text-bit-main" {...props} />
    ),
    h2: (props: any) => (
      <h2
        className="text-xl font-semibold my-3 mb-5 text-bit-main"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3 className="text-lg font-medium my-2 text-bit-main" {...props} />
    ),
    p: (props: any) => <p className="my-2 text-base text-comment" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-5 my-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
    li: (props: any) => <li className="my-1" {...props} />,
    blockquote: (props: any) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic my-2"
        {...props}
      />
    )
  };

  // 차트 옵션 설정
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: maxValue,
        ticks: {
          stepSize: 1000000,
          callback: function (value: number) {
            return (value / 1000000).toLocaleString() + ",000,000";
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.raw !== null) {
              label += new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
                maximumFractionDigits: 0
              }).format(context.raw);
            }
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-6 text-comment">
        월별 매출 현황
      </h2>

      {/* 차트 컨테이너 - 고정 높이 */}
      <div className="h-70">
        <BarChart
          labels={monthlyLabels}
          datasets={[
            {
              label: "월별 매출",
              data: monthlyValues,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              barPercentage: 0.5,
              borderWidth: 1
            }
          ]}
          customOptions={chartOptions}
          height={300}
          legend={false}
        />
      </div>

      {/* 요약 섹션 */}
      <div className="p-4 bg-blue-50 rounded-lg mt-6">
        <Markdown components={markdownComponents}>
          {monthlySalesSummary}
        </Markdown>
      </div>
    </div>
  );
};

export default MonthlySalesSection;
