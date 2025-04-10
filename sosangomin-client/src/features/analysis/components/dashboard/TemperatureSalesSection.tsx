import React, { useMemo } from "react";
import BarChart from "@/components/chart/BarChart";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

interface TemperatureSalesSectionProps {
  data: AnalysisResultData;
}

const TemperatureSalesSection: React.FC<TemperatureSalesSectionProps> = ({
  data
}) => {
  // 기온별 매출 데이터
  const temperatureSales = data?.result_data?.temperature_sales?.data || {};
  const temperatureSalesSummary =
    data?.result_data?.temperature_sales?.summary || "";

  const temperatureSalesLabels = Object.keys(temperatureSales);

  // 값을 정수로 변환 (소수점 제거)
  const temperatureSalesValues = useMemo(() => {
    return Object.values(temperatureSales).map((value) =>
      Math.round(Number(value))
    );
  }, [temperatureSales]);

  // 최대값과 최소값 계산 (Y축 스케일링을 위함)
  const { minValue, maxValue } = useMemo(() => {
    const min = Math.min(...temperatureSalesValues);
    const max = Math.max(...temperatureSalesValues);

    // 최소값의 약 95%로 설정 (단, 0보다 작지 않게)
    const calculatedMin = Math.max(0, Math.floor(min * 0.95));

    // 최대값의 약 5% 여유 공간을 추가
    const calculatedMax = Math.ceil(max * 1.05);

    return {
      minValue: calculatedMin,
      maxValue: calculatedMax
    };
  }, [temperatureSalesValues]);

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
    p: (props: any) => (
      <p className="my-2 text-base  text-comment" {...props} />
    ),
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

  const temperatureSalesDatasets = [
    {
      label: "기온별 평균액",
      data: temperatureSalesValues,
      backgroundColor: [
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
        "rgba(255, 159, 64, 0.6)",
        "rgba(199, 199, 199, 0.6)"
      ],
      borderWidth: 1
    }
  ];

  // 차트 옵션 설정
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: false, // 0부터 시작하지 않음
        min: minValue, // 계산된 최소값 적용
        max: maxValue, // 계산된 최대값 적용
        ticks: {
          // 스텝 사이즈 계산 (범위에 따라 적절히 조정)
          stepSize: Math.ceil((maxValue - minValue) / 5 / 500) * 500, // 500원 단위로 눈금 조정
          callback: function (value: number) {
            // 원 단위로 표시 (정수로 변환)
            return Math.round(value).toLocaleString() + "원";
          }
        },
        title: {
          display: true,
          text: "평균 금액",
          font: {
            size: 12,
            weight: "normal"
          },
          padding: { top: 0, bottom: 10 }
        }
      },
      x: {
        title: {
          display: true,
          font: {
            size: 12,
            weight: "normal"
          },
          padding: { top: 10, bottom: 0 }
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
              // 원 단위로 표시 (정수로 변환)
              label += Math.round(context.raw).toLocaleString() + "원";
            }
            return label;
          }
        }
      }
    }
  };

  // 요약 텍스트에서 소수점 제거 (선택적)
  const formattedSummary = useMemo(() => {
    if (!temperatureSalesSummary) return "";

    // 정규식을 사용하여 숫자.소수점 형식을 찾아 반올림
    return temperatureSalesSummary.replace(
      /(\d+,\d+\.\d+|\d+\.\d+)원/g,
      (match) => {
        const numStr = match.replace(/[^\d.]/g, ""); // 숫자와 소수점만 추출
        const roundedNum = Math.round(parseFloat(numStr));
        return roundedNum.toLocaleString() + "원";
      }
    );
  }, [temperatureSalesSummary]);

  return (
    <div className="bg-basic-white p-6 mb-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        기온별 일 평균 매출액
      </h2>
      <p className="text-xs text-end text-comment-text mb-6">단위 : 원</p>
      <div
        className="mb-10"
        style={{ width: "100%", height: "350px", overflow: "hidden" }}
      >
        <BarChart
          labels={temperatureSalesLabels}
          datasets={temperatureSalesDatasets}
          height={350}
          legend={false}
          unit=""
          customOptions={chartOptions}
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-comment">
            <Markdown components={markdownComponents}>
              {formattedSummary}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TemperatureSalesSection;
