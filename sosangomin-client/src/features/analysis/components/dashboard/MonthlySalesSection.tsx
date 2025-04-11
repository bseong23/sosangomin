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

  // 년도-월 포맷 변환 함수 (2024-05 -> 2024년 5월)
  const formatYearMonth = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    return `${year}년 ${parseInt(month, 10)}월`;
  };

  // 데이터 정렬 및 차트 데이터 준비
  const sortedData = useMemo(() => {
    // 키(년월)를 기준으로 정렬
    return Object.entries(monthlySales).sort(([dateA], [dateB]) => {
      // 날짜 문자열 비교로 정렬 (예: "2024-05" < "2024-06")
      return dateA.localeCompare(dateB);
    });
  }, [monthlySales]);

  // 정렬된 라벨과 값 배열
  const monthlyLabels = useMemo(() => {
    return sortedData.map(([yearMonth]) => formatYearMonth(yearMonth));
  }, [sortedData]);

  const monthlyValues = useMemo(() => {
    // 명시적으로 number 배열로 변환
    // 원본 값을 만원 단위로 변환 (10000으로 나눔)
    return sortedData.map(([_, value]) => Number(value) / 10000);
  }, [sortedData]);

  // 최대값과 최소값 계산 (Y축 스케일링을 위함)
  const { minValue, maxValue } = useMemo(() => {
    // 이미 만원 단위로 변환된 값 사용
    const min = Math.min(...monthlyValues);
    const max = Math.max(...monthlyValues);

    // 최소값의 약 90%로 설정 (단, 0보다 작지 않게)
    const calculatedMin = Math.max(0, Math.floor((min * 0.9) / 100) * 100);

    // 최대값의 약 10% 여유 공간을 추가하고 적절한 단위로 반올림
    const calculatedMax = Math.ceil((max * 1.05) / 100) * 100;

    return {
      minValue: calculatedMin,
      maxValue: calculatedMax
    };
  }, [monthlyValues]);

  // 마크다운 렌더링을 위한 스타일
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

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-6 text-comment">
        월별 매출 현황
      </h2>

      <p className="text-xs text-end text-comment-text">단위 : 만원</p>

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
      <div className="p-4 bg-blue-50 rounded-lg mt-15">
        <Markdown components={markdownComponents}>
          {monthlySalesSummary}
        </Markdown>
      </div>
    </div>
  );
};

export default MonthlySalesSection;
