import React from "react";
import BarChart from "@/components/chart/BarChart";
// import PieChart from "@/components/chart/PieChart";
// import LineChart from "@/components/chart/LineChart";
import DoughnutChart from "@/components/chart/DoughnutChart";
import WordCloud from "./WordCloud";

const ReviewDashBoard: React.FC = () => {
  // 감정 분석 데이터
  const sentimentData = {
    labels: ["긍정", "중립", "부정"],
    datasets: [
      {
        label: "감정 분포",
        data: [52, 8, 0],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(255, 99, 132, 0.7)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // 카테고리별 긍정 리뷰 데이터
  const categoryData = {
    labels: ["음식", "서비스", "가격", "위생", "분위기"],
    datasets: [
      {
        label: "긍정 리뷰 수",
        data: [52, 26, 17, 14, 2],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  };

  // 키워드 빈도 데이터 (상위 15개)
  const keywordData = {
    labels: [
      "명태",
      "조림",
      "양념",
      "매콤",
      "사장님",
      "점심",
      "맛집",
      "최고",
      "코다리",
      "반찬",
      "양도",
      "도둑",
      "방문",
      "콩나물",
      "직원"
    ],
    datasets: [
      {
        label: "언급 빈도",
        data: [60, 37, 27, 23, 19, 11, 11, 10, 9, 9, 9, 9, 8, 7, 7],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1
      }
    ]
  };

  // 긍정적 감정 표현 단어 데이터 (상위 10개)
  const positiveSentimentWords = {
    labels: [
      "맛있게",
      "친절하시고",
      "정말",
      "진짜",
      "좋아요",
      "완전",
      "최고",
      "맛있어요",
      "깔끔하게",
      "부드럽고"
    ],
    datasets: [
      {
        label: "사용 빈도",
        data: [20, 15, 12, 12, 10, 8, 8, 8, 7, 6],
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1
      }
    ]
  };
  const data = {
    positive_words: {
      명태: 60,
      보기: 41,
      조림: 37,
      양념: 27,
      매콤: 23,
      사장: 19,
      점심: 11,
      맛집: 11,
      최고: 10,
      코다리: 9,
      반찬: 9,
      양도: 9,
      도둑: 9,
      방문: 8,
      콩나물: 7,
      하나: 7,
      자주: 7,
      직원: 7
    },
    negative_words: {}
  };

  return (
    <div className="bg-gray-50 max-w-[1000px] mx-auto p-4 md:p-6 rounded-lg">
      {/* 헤더 섹션 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-bit-main mb-4">가게 리뷰 분석</h1>

        <WordCloud
          positive_words={data.positive_words}
          negative_words={data.negative_words}
          maxWords={10}
        />

        {/* 요약 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
            <p className="text-sm text-comment-text">긍정 리뷰 비율</p>
            <p className="text-2xl font-bold text-blue-500">86.7%</p>
          </div>
          <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
            <p className="text-sm text-comment-text">중립 리뷰 비율</p>
            <p className="text-2xl font-bold text-green-600">13.3%</p>
          </div>
          <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
            <p className="text-sm text-comment-text">부정 리뷰 비율</p>
            <p className="text-2xl font-bold text-red-600">0%</p>
          </div>
        </div>
      </div>

      {/* 차트 섹션 1: 감정 분석 & 카테고리별 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 감정 분석 분포 */}
        <div className="bg-basic-white p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4 text-bit-main">
            감정 분석 분포
          </h2>
          <div className="flex justify-center items-center">
            <div className="w-64">
              <DoughnutChart chartData={sentimentData} />
            </div>
          </div>
        </div>

        {/* 카테고리별 긍정 리뷰 수 */}
        <div className="bg-basic-white p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-4 text-bit-main">
            카테고리별 긍정 리뷰 수
          </h2>
          <BarChart
            labels={categoryData.labels}
            datasets={categoryData.datasets}
            height={300}
            title=""
            xAxisLabel="카테고리"
            yAxisLabel="리뷰 수"
          />
        </div>
      </div>

      {/* 차트 섹션 2: 키워드 빈도 */}
      <div className="bg-basic-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-bit-main">
          주요 키워드 빈도 (상위 15개)
        </h2>
        <BarChart
          labels={keywordData.labels}
          datasets={keywordData.datasets}
          height={400}
          horizontal={true}
          title=""
          xAxisLabel="언급 빈도"
          yAxisLabel="키워드"
        />
      </div>

      {/* 차트 섹션 3: 긍정적 감정 표현 & 핵심 인사이트 */}

      {/* 긍정적 감정 표현 단어 */}
      <div className="bg-basic-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-bit-main">
          긍정적 감정 표현 단어 (상위 10개)
        </h2>
        <BarChart
          labels={positiveSentimentWords.labels}
          datasets={positiveSentimentWords.datasets}
          height={350}
          horizontal={true}
          title=""
          xAxisLabel="사용 빈도"
          yAxisLabel="감정 표현"
        />
      </div>

      {/* 핵심 인사이트 */}
      <div className="bg-basic-white p-4 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-bit-main">
          핵심 인사이트
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 고객 만족 부분 */}
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              고객들이 가장 만족하는 점
            </h3>
            <ul className="list-disc pl-5 text-sm text-comment-text space-y-2">
              <li>쫄깃하고 부드러운 명태의 식감</li>
              <li>매콤한 양념의 맛</li>
              <li>푸짐한 양</li>
              <li>친절한 서비스</li>
              <li>깔끔한 매장 분위기</li>
            </ul>
          </div>

          {/* 개선 필요 부분 */}
          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-700 mb-3">
              개선이 필요한 부분
            </h3>
            <ul className="list-disc pl-5 text-sm text-comment-text space-y-2">
              <li>매운맛 조절 옵션</li>
              <li>공기밥 가격 정책</li>
            </ul>
          </div>

          {/* 추천 개선사항 */}
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              추천 운영 개선사항
            </h3>
            <ul className="list-disc pl-5 text-sm text-comment-text space-y-2">
              <li>매운맛 단계 옵션 확대 (순한맛, 보통맛, 매운맛)</li>
              <li>세트 메뉴 구성 시 공기밥 포함</li>
              <li>단골 고객 서비스 프로그램 도입</li>
              <li>주차 편의성 강조 마케팅</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDashBoard;
