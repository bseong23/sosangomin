import React from "react";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";
import Spring from "@/assets/spring.png";
import Summer from "@/assets/summer.png";
import Autumn from "@/assets/autumn.png";
import Winter from "@/assets/winter.png";

interface SeasonalSalesSectionProps {
  data: AnalysisResultData;
}

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
    <ol className="list-decimal ml-5  mb-5 pl-5 my-2" {...props} />
  ),
  li: (props: any) => {
    // 목록 항목 내부의 줄바꿈(\n) 처리
    if (props.children && typeof props.children === "string") {
      const parts = props.children.split("\n");
      if (parts.length > 1) {
        return (
          <li className="my-1 mb-5 ml-5">
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

const SeasonalSalesSection: React.FC<SeasonalSalesSectionProps> = ({
  data
}) => {
  const seasonSales = data?.result_data?.season_sales?.data || {};
  const seasonSalesSummary = data?.result_data?.season_sales?.summary || "";

  const seasonImages: { [key: string]: string } = {
    봄: Spring,
    여름: Summer,
    가을: Autumn,
    겨울: Winter
  };

  const seasonOrder = ["봄", "여름", "가을", "겨울"];
  const formattedSummary = seasonSalesSummary.replace(/\n/g, "  \n");

  // 금액을 1만 단위로 변환하고 쉼표 삽입
  const formatToTenThousandWon = (value: number): string => {
    const tenThousands = Math.floor(value / 10000);
    return `${tenThousands.toLocaleString()} 만원`;
  };

  return (
    <div className="w-full mb-6 bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)]">
      <h2 className="text-lg font-semibold mb-10 text-comment">
        시즌별 매출 분석
      </h2>

      <div className="flex justify-around items-center gap-4 h-[350px]">
        {seasonOrder.map((season, idx) => {
          const amount = seasonSales[season] || 0;

          return (
            <div key={idx} className="flex flex-col items-center">
              <img
                src={seasonImages[season]}
                alt={`${season} 아이콘`}
                className="h-[120px] mb-10"
              />
              <p className="text-sm font-semibold">{season}</p>
              <p className="text-sm">{formatToTenThousandWon(amount)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-comment">
          <Markdown components={markdownComponents}>
            {formattedSummary}
          </Markdown>
        </p>
      </div>
    </div>
  );
};

export default SeasonalSalesSection;
