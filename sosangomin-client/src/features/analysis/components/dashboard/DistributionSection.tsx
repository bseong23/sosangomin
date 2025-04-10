import React, { useMemo } from "react";
import BarChart from "@/components/chart/BarChart";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

interface DistributionSectionProps {
  data: AnalysisResultData;
}

const DistributionSection: React.FC<DistributionSectionProps> = ({ data }) => {
  // 평일/휴일 매출 데이터
  const holidaySales = data?.result_data?.holiday_sales?.data || {};
  const holidaySalesSummary = data?.result_data?.holiday_sales?.summary || "";

  // 시간대별 매출 데이터
  const timePeriodSales = data?.result_data?.time_period_sales?.data || {};
  const timePeriodSalesSummary =
    data?.result_data?.time_period_sales?.summary || "";

  // 시간대별 매출 데이터 (막대 그래프용)
  const timePeriodLabels = Object.keys(timePeriodSales);
  const timePeriodValues = Object.values(timePeriodSales).map(
    (value) =>
      // 만원 단위로 변환 (10000으로 나눔)
      Number(value) / 10000
  );
  const holidaySalesValues = Object.values(holidaySales).map(
    (value) =>
      // 만원 단위로 변환 (10000으로 나눔)
      Number(value) / 10000
  );

  // 두 차트의 Y축 최소값과 최대값을 계산 (이미 만원 단위로 변환된 값 사용)
  const { minValue, maxValue } = useMemo(() => {
    // 시간대별 매출의 최소/최대값
    const timeMin = Math.min(...timePeriodValues);
    const timeMax = Math.max(...timePeriodValues);

    // 평일/휴일 매출의 최소/최대값
    const holidayMin = Math.min(...holidaySalesValues);
    const holidayMax = Math.max(...holidaySalesValues);

    // 두 데이터셋 중 더 작은 최소값과 더 큰 최대값 선택
    const overallMin = Math.min(timeMin, holidayMin);
    const overallMax = Math.max(timeMax, holidayMax);

    // 최소값은 가장 작은 값의 약 90%로 설정 (단, 0보다 작지 않게)
    const calculatedMin = Math.max(
      0,
      Math.floor((overallMin * 0.9) / 100) * 100
    );

    // 최대값은 가장 큰 값의 약 10% 여유 공간을 추가
    const calculatedMax = Math.ceil((overallMax * 1.1) / 100) * 100;

    return {
      minValue: calculatedMin,
      maxValue: calculatedMax
    };
  }, [timePeriodValues, holidaySalesValues]);

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

  // 두 차트에 공통으로 적용할 옵션
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        beginAtZero: false, // 0부터 시작하지 않음
        min: minValue, // 계산된 최소값 사용
        max: maxValue, // 계산된 최대값 사용
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* 두 카드 모두 동일한 구조와 크기를 갖도록 함 */}
      <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
        {/* 제목 */}
        <h2 className="text-lg font-semibold mb-2 text-comment h-6">
          식사 시간대별 매출
        </h2>
        <p className="text-sm text-comment-text mb-8">
          점심(11:00-15:00) | 저녁(17:00-21:00) | 기타(그 외 시간대)
        </p>
        <p className="text-xs text-end text-comment-text">단위 : 만원</p>

        {/* 차트 컨테이너 - 고정 높이 */}
        <div className="h-70">
          <BarChart
            labels={timePeriodLabels}
            datasets={[
              {
                label: "시간대별 매출",
                data: timePeriodValues,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)"
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)"
                ],
                barPercentage: 0.5,
                borderWidth: 1
              }
            ]}
            customOptions={chartOptions}
            height={260}
            legend={false}
          />
        </div>

        {/* 요약 섹션 - 고정 위치와 최소 높이 */}
        <div className="p-4 bg-blue-50 rounded-lg mt-6 min-h-[180px]">
          <Markdown components={markdownComponents}>
            {timePeriodSalesSummary}
          </Markdown>
        </div>
      </div>

      {/* 평일/휴일 매출 비율 - 완전히 동일한 레이아웃 구조 */}
      <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
        {/* 제목 */}
        <h2 className="text-lg font-semibold mb-2 text-comment h-6">
          평일/휴일 매출 비율
        </h2>
        <p className="text-sm text-comment-text mb-8">
          평일(월~금) | 휴일(토,일,공휴일)
        </p>
        <p className="text-xs text-end text-comment-text">단위 : 만원</p>

        {/* 차트 컨테이너 - 고정 높이, 첫 번째와 동일 */}
        <div className="h-70">
          <BarChart
            labels={["평일", "휴일"]}
            datasets={[
              {
                label: "평일/휴일 매출",
                data: holidaySalesValues,
                backgroundColor: [
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)"
                ],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
                barPercentage: 0.5,
                borderWidth: 1
              }
            ]}
            customOptions={chartOptions}
            height={260}
            legend={false}
          />
        </div>

        {/* 요약 섹션 - 고정 위치와 최소 높이, 첫 번째와 동일 */}
        <div className="p-4 bg-blue-50 rounded-lg mt-6 min-h-[180px]">
          <Markdown components={markdownComponents}>
            {holidaySalesSummary}
          </Markdown>
        </div>
      </div>
    </div>
  );
};

export default DistributionSection;
