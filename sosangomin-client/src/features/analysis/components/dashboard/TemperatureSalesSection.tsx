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
        className="text-xl font-semibold my-3 mt-10 mb-5 text-bit-main"
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3
        className="text-lg font-medium my-2 mb-2 mt-5 text-bit-main"
        {...props}
      />
    ),
    p: (props: any) => {
      // 단락 내부의 줄바꿈(\n) 처리를 위한 로직
      if (props.children && typeof props.children === "string") {
        // 줄바꿈을 <br /> 태그로 변환
        const parts = props.children.split("\n");
        if (parts.length > 1) {
          return (
            <p className="my-2 text-base text-comment">
              {parts.map((part: any, i: any) => (
                <React.Fragment key={i}>
                  {part}
                  {i < parts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        }
      }
      // 줄바꿈이 없는 일반 텍스트는 그대로 표시
      return <p className="my-2 text-base text-comment" {...props} />;
    },
    ul: (props: any) => (
      <ul className="list-disc ml-5 mb-5 pl-5 my-2" {...props} />
    ),
    ol: (props: any) => (
      <ol className="list-decimal ml-5 mb-5 pl-5 my-2" {...props} />
    ),
    li: (props: any) => {
      // 목록 항목 내부의 줄바꿈(\n) 처리
      if (props.children && typeof props.children === "string") {
        const parts = props.children.split("\n");
        if (parts.length > 1) {
          return (
            <li className="my-1 mb-5">
              {parts.map((part: any, i: any) => (
                <React.Fragment key={i}>
                  {part}
                  {i < parts.length - 1 && <br />}
                </React.Fragment>
              ))}
            </li>
          );
        }
      }
      return <li className="my-1" {...props} />;
    },
    blockquote: (props: any) => (
      <blockquote
        className="border-l-4 border-gray-300 pl-4 italic my-2"
        {...props}
      />
    ),
    // 줄바꿈 태그 처리 (마크다운에서 줄 끝에 공백 두 개로 삽입됨)
    br: (props: any) => <br className="my-1" {...props} />,
    // 코드 블록 스타일링
    code: (props: any) => (
      <code
        className="bg-gray-100 px-1 py-0.5 rounded text-red-600 text-sm"
        {...props}
      />
    ),
    // 강조 스타일링
    strong: (props: any) => (
      <strong className="font-semibold text-gray-900" {...props} />
    ),
    // 이탤릭 스타일링
    em: (props: any) => <em className="italic text-gray-800" {...props} />
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
        beginAtZero: false,
        min: minValue,
        max: maxValue,
        grid: {
          display: false // <-- 요기!
        },
        ticks: {
          stepSize: Math.ceil((maxValue - minValue) / 5 / 500) * 500,
          callback: function (value: number) {
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
        grid: {
          display: false // <-- 요기!
        },
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
            if (label) label += ": ";
            if (context.raw !== null) {
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
