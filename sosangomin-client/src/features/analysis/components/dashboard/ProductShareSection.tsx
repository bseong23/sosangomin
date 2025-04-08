import React, { useMemo } from "react";
import PieChart from "@/components/chart/PieChart";
import { AnalysisResultData } from "../../types/analysis";
import Markdown from "react-markdown";

interface ProductShareSectionProps {
  data: AnalysisResultData;
}

const ProductShareSection: React.FC<ProductShareSectionProps> = ({ data }) => {
  // 제품 점유율 데이터
  const productShare = data?.result_data?.product_share?.data || {};
  const productShareSummary = data?.result_data?.product_share?.summary || "";
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
  // 상위 5개 제품만 표시하고 나머지는 기타로 처리
  const processedData = useMemo(() => {
    // 제품 점유율을 내림차순으로 정렬
    const sortedEntries = Object.entries(productShare).sort(
      (a, b) => b[1] - a[1]
    );

    // 상위 5개와 나머지 분리
    const top5 = sortedEntries.slice(0, 5);
    const others = sortedEntries.slice(5);

    // 나머지 항목들의 점유율 합계
    const othersSum = others.reduce((sum, [_, value]) => sum + value, 0);

    // 상위 5개 + 기타로 새로운 객체 생성
    const result = Object.fromEntries(top5);

    if (others.length > 0) {
      result["기타 상품"] = othersSum;
    }

    return result;
  }, [productShare]);

  // 색상 배열 (상위 5개 + 기타)
  const colors = [
    "rgba(255, 99, 132, 0.6)", // 분홍색
    "rgba(54, 162, 235, 0.6)", // 파란색
    "rgba(255, 206, 86, 0.6)", // 노란색
    "rgba(75, 192, 192, 0.6)", // 청록색
    "rgba(153, 102, 255, 0.6)", // 보라색
    "rgba(128, 128, 128, 0.6)" // 회색 (기타)
  ];

  const borderColors = colors.map((color) => color.replace("0.6", "1"));

  // 파이 차트 데이터 준비
  const productShareChartData = {
    labels: Object.keys(processedData),
    datasets: [
      {
        label: "제품 점유율",
        data: Object.values(processedData),
        backgroundColor: colors.slice(0, Object.keys(processedData).length),
        borderColor: borderColors.slice(0, Object.keys(processedData).length),
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="bg-basic-white p-6 rounded-lg shadow-[0_-5px_5px_rgba(0,0,0,0.1),0_10px_15px_rgba(0,0,0,0.1)] mb-6">
      <h2 className="text-lg font-semibold mb-6 text-comment">
        우리가게 효자 제품은?
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-2/5 mb-4 md:mb-0">
          <div className="w-full max-w-xs mx-auto">
            <PieChart chartData={productShareChartData} />
          </div>
        </div>
        <div className="w-full md:w-3/5 md:pl-6 flex items-center">
          <div className="space-y-2 w-full">
            {Object.entries(processedData).map(([product, share], idx) => (
              <div
                key={idx}
                className="grid grid-cols-2 items-center text-sm py-1"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[idx] }}
                  ></div>
                  <span>{product}</span>
                </div>
                <div className="text-right font-semibold">
                  {Number(share).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-comment">
          <Markdown components={markdownComponents}>
            {productShareSummary}
          </Markdown>
        </p>
      </div>
    </div>
  );
};

export default ProductShareSection;
