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
    negative_words: {
      속쓰려: 60,
      화장실: 30,
      커피: 10,
      복통: 50
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 rounded-lg">
      {/* 헤더 섹션 */}
      <div className="mb-6">
        <div className="flex justify-between mb-6">
          <h3 className="text-lg font-bold p-1">
            네이버 리뷰를 통한{" "}
            <span className="text-xl text-blue-400">손님들이 생각</span>
            하는 우리 가게는?
          </h3>
          <button className="btn bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs">
            리뷰 분석하기
          </button>
        </div>

        {/* 두 개의 워드클라우드를 그리드로 배치 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 긍정 워드클라우드 */}
          <WordCloud
            words={data.positive_words}
            title="긍정적 키워드"
            colors={{ primary: "#1E40AF", secondary: "#3056D3" }}
            maxWords={15}
          />

          {/* 부정 워드클라우드 */}
          <WordCloud
            words={data.negative_words}
            title="부정적 키워드"
            colors={{ primary: "#B91C1C", secondary: "#EF4444" }}
            maxWords={15}
          />
        </div>

        {/* 요약 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
            <p className="text-sm text-comment-text">긍정 리뷰 비율</p>
            <p className="text-2xl font-bold text-blue-500">86.7%</p>
          </div>
          <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
            <p className="text-sm text-comment-text">중립 리뷰 비율</p>
            <p className="text-2xl font-bold text-green-600">3.3%</p>
          </div>
          <div className="flex flex-col gap-3 bg-basic-white p-11 rounded-md shadow">
            <p className="text-sm text-comment-text">부정 리뷰 비율</p>
            <p className="text-2xl font-bold text-red-600">10.0%</p>
          </div>
        </div>
      </div>

      {/* 차트 섹션 1: 감정 분석 & 카테고리별 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 감정 분석 분포 */}
        <div className="bg-basic-white p-4 rounded-md shadow">
          <h2 className="text-lg font-bold mb-4 text-comment">
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
          <h2 className="text-lg font-semibold mb-4 text-comment">
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
        <h2 className="text-lg font-semibold mb-4 text-comment">
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
        <h2 className="text-lg font-semibold mb-4 text-comment">
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
      <div className="bg-basic-white p-6 rounded-md shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 text-comment">
          핵심 인사이트
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 고객 만족 부분 */}
          <div className="bg-blue-50 p-6 rounded-md">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              고객들이 가장 만족하는 점
            </h3>
            <ul className="list-disc pl-5 text-sm text-comment space-y-2">
              <li>
                명태 조림의 맛: 리뷰에서 많은 고객들이 명태 조림의 맛에 대해
                매우 긍정적으로 평가했습니다. 쫄깃하고 부드러운 식감, 매콤한
                양념 등이 호평받고 있습니다.
              </li>
              <li>
                푸짐한 양: 소자 메뉴로도 많은 양의 명태 조림을 제공하고 있어
                고객들의 만족도가 높습니다.
              </li>
              <li>
                친절한 서비스: 매장 직원들의 친절한 서비스가 고객 만족도를
                높이는 요인으로 나타났습니다.
              </li>
              <li>
                깔끔한 분위기: 깨끗하고 새로운 매장 분위기 역시 고객들의 만족을
                이끌어내고 있습니다.
              </li>
            </ul>
          </div>

          {/* 개선 필요 부분 */}
          <div className="bg-yellow-50 p-6 rounded-md">
            <h3 className="text-lg font-semibold text-yellow-700 mb-3">
              개선이 필요한 부분
            </h3>
            <ul className="list-disc pl-5 text-sm text-comment space-y-2">
              <li>
                매운맛 조절: 일부 고객들이 매운맛이 너무 강하다고 지적했습니다.
                선호도에 따른 매운맛 조절이 필요할 것으로 보입니다.
              </li>
              <li>
                공기밥 가격: 공기밥이 별도 요금으로 책정되어 있어 일부 고객들의
                불만을 사고 있습니다.
              </li>
            </ul>
          </div>

          {/* 추천 개선사항 */}
          <div className="bg-green-50 p-6 rounded-md">
            <h3 className="text-lg font-semibold text-green-700 mb-3">
              추천 운영 개선사항
            </h3>
            <ul className="list-disc pl-5 text-sm text-comment space-y-2">
              <li>
                {" "}
                매운맛 옵션 제공: 매운맛을 선호하는 고객과 그렇지 않은 고객들의
                needs를 충족시키기 위해 매운맛 옵션을 제공하는 것이 좋겠습니다.
              </li>
              <li>
                공기밥 무료 제공: 고객 만족도 제고를 위해 공기밥 무료 제공을
                고려해볼 수 있습니다.
              </li>
              <li>
                신메뉴 개발: 고객들의 다양한 입맛을 충족시키기 위해 새로운 메뉴
                개발도 검토해볼 필요가 있습니다.
              </li>
              <li>
                친절 서비스 교육: 직원들의 친절 서비스 교육을 통해 고객 만족도를
                지속적으로 높일 수 있습니다.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDashBoard;
