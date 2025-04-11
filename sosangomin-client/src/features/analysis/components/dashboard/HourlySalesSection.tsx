import React from "react";
import SalesTrendCard from "./SalesTrendCard";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

interface HourlySalesSectionProps {
  data: AnalysisResultData;
}

const HourlySalesSection: React.FC<HourlySalesSectionProps> = ({ data }) => {
  // 하드코딩된 데이터 대신 props 데이터 사용
  const hourlySales = data?.result_data?.hourly_sales?.data || {};
  const hourlySalesSummary = data?.result_data?.hourly_sales?.summary || "";

  const hourlySalesLabels = Object.keys(hourlySales).map((hour) => `${hour}시`);
  const hourlySalesDatasets = [
    {
      label: "시간별 매출",
      data: Object.values(hourlySales),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.3
    }
  ];

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

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-10 text-comment">
        우리 가게 시간별 매출액
      </h2>
      <div className="mb-20" style={{ width: "100%", height: "350px" }}>
        <SalesTrendCard
          title=""
          labels={hourlySalesLabels}
          datasets={hourlySalesDatasets}
          height={350}
        />
      </div>
      <div className="mt-2 mb-2">
        {/* 요약 - 축약 없이 전체 텍스트 표시 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-base text-comment">
            <Markdown components={markdownComponents}>
              {hourlySalesSummary}
            </Markdown>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HourlySalesSection;
