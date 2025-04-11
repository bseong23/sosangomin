import React, { useMemo } from "react";
import SalesRankingCard from "./SalesRankingCard";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

interface WeekdaySalesSectionProps {
  data: AnalysisResultData;
}

const WeekdaySalesSection: React.FC<WeekdaySalesSectionProps> = ({ data }) => {
  // 요일별 매출 데이터
  const weekdaySales = data?.result_data?.weekday_sales?.data || {};
  const weekdaySalesSummary = data?.result_data?.weekday_sales?.summary || "";

  // 요일 순서 정의 (월요일부터 일요일까지)
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  // 요일 이름 매핑
  const koreanDays: { [key: string]: string } = {
    Monday: "월요일",
    Tuesday: "화요일",
    Wednesday: "수요일",
    Thursday: "목요일",
    Friday: "금요일",
    Saturday: "토요일",
    Sunday: "일요일"
  };

  // 정렬된 데이터 배열 생성 - 만원 단위로 변환
  const sortedEntries = useMemo(() => {
    return dayOrder
      .filter((day) => weekdaySales[day] !== undefined)
      .map((day) => ({
        day: day,
        koreanDay: koreanDays[day] || day,
        value: Number(weekdaySales[day]) / 10000 // 만원 단위로 변환
      }));
  }, [weekdaySales]);

  // 정렬된 데이터에서 라벨과 값 추출
  const weekdaySalesLabels = sortedEntries.map((entry) => entry.koreanDay);
  const weekdaySalesValues = sortedEntries.map((entry) => entry.value);

  // 최대값과 최소값 계산 (여유 공간 5%로 조정)
  const { minValue, maxValue } = useMemo(() => {
    const min = Math.min(...weekdaySalesValues);
    const max = Math.max(...weekdaySalesValues);

    // 최소값의 약 95%로 설정 (단, 0보다 작지 않게)
    const calculatedMin = Math.max(0, Math.floor((min * 0.95) / 100) * 100);

    // 최대값의 약 5% 여유 공간을 추가
    const calculatedMax = Math.ceil((max * 1.05) / 100) * 100;

    return {
      minValue: calculatedMin,
      maxValue: calculatedMax
    };
  }, [weekdaySalesValues]);

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
          stepSize: Math.ceil((maxValue - minValue) / 5 / 100) * 100,
          callback: function (value: number) {
            // 단순히 숫자만 표시 (이미 만원 단위로 변환했으므로)
            return value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: "매출액",
          font: {
            size: 12,
            weight: "normal"
          },
          padding: { top: 0, bottom: 10 }
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
              // 이미 만원 단위이므로 적절한 포맷 적용
              label += context.raw.toLocaleString() + " 만원";
            }
            return label;
          }
        }
      }
    }
  };

  const weekdaySalesDatasets = [
    {
      label: "요일별 매출",
      data: weekdaySalesValues,
      backgroundColor: "rgba(75, 192, 192, 0.6)"
    }
  ];

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-4 text-comment">
        요일별 매출 현황
      </h2>
      <p className="text-xs text-end text-comment-text">단위 : 만원</p>
      <div className="mb-10" style={{ width: "100%", height: "350px" }}>
        <SalesRankingCard
          title=""
          labels={weekdaySalesLabels}
          datasets={weekdaySalesDatasets}
          height={350}
          unit="만원"
          customOptions={chartOptions}
        />
      </div>
      <div className="mt-2 mb-2">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-comment">
            <Markdown components={markdownComponents}>
              {weekdaySalesSummary}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeekdaySalesSection;
