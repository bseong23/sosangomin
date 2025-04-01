import React from "react";
import BarChart from "@/components/chart/BarChart"; // 커스텀 BarChart 컴포넌트 임포트

interface PopulationTabProps {
  selectedAdminName?: string;
  populationData?: any; // 데이터 타입은 실제 프로젝트에서 인터페이스로 정의하는 것이 좋음
}

const PopulationTab: React.FC<PopulationTabProps> = ({
  selectedAdminName = "지역 미지정",
  populationData
}) => {
  if (!populationData) return <p>데이터를 불러오는 중...</p>;

  // ✅ 시간대별 유동인구 데이터 가공
  const timeLabels = [
    "심야",
    "이른아침",
    "오전",
    "오후",
    "퇴근시간",
    "저녁",
    "밤"
  ];
  const timeData = timeLabels.map(
    (label) => populationData.floating_pop.시간대별_유동인구[label] || 0
  );

  // ✅ 연령대별 상주인구 데이터 가공 (수정된 부분)
  const ageGroups = ["10", "20", "30", "40", "50", "60"];
  const maleResident = ageGroups.map(
    (age) =>
      populationData.resident_pop.성별_연령별_상주인구[`male_${age}`] || 0
  );
  const femaleResident = ageGroups.map(
    (age) =>
      populationData.resident_pop.성별_연령별_상주인구[`female_${age}`] || 0
  );

  // ✅ 연령대별 직장인구 데이터 가공 (수정된 부분)
  const maleWorker = ageGroups.map(
    (age) => populationData.working_pop.성별_연령별_직장인구[`male_${age}`] || 0
  );
  const femaleWorker = ageGroups.map(
    (age) =>
      populationData.working_pop.성별_연령별_직장인구[`female_${age}`] || 0
  );

  const malefloat = ageGroups.map(
    (age) =>
      populationData.floating_pop.성별_연령별_유동인구[`male_${age}`] || 0
  );
  const femalefloat = ageGroups.map(
    (age) =>
      populationData.floating_pop.성별_연령별_유동인구[`female_${age}`] || 0
  );
  // ✅ 차트 컴포넌트에서 labels는 원래대로 유지
  const residentLabels = ["10대", "20대", "30대", "40대", "50대", "60대"];

  // ✅ 요일별 유동인구 데이터 가공
  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
  const weekKeys = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];
  const weekData = weekKeys.map(
    (day) => populationData.floating_pop.요일별_유동인구[day] || 0
  );
  const avgResident =
    populationData.resident_pop.총_상주인구 -
    populationData.resident_pop.서울시_평균_상주인구;

  const resText =
    avgResident > 0
      ? `평균보다 ${Math.abs(avgResident).toLocaleString()}명 많습니다.`
      : `평균보다 ${Math.abs(avgResident).toLocaleString()}명 적습니다.`;

  const avgWorkiong =
    populationData.working_pop.총_직장인구 -
    populationData.working_pop.서울시_평균_직장인구;

  const workText =
    avgWorkiong > 0
      ? `평균보다 ${Math.abs(avgWorkiong).toLocaleString()}명 많습니다.`
      : `평균보다 ${Math.abs(avgWorkiong).toLocaleString()}명 적습니다.`;

  const avgfloating =
    populationData.floating_pop.총_유동인구 -
    populationData.floating_pop.서울시_평균_유동인구;

  const floatText =
    avgfloating > 0
      ? `평균보다 ${Math.abs(avgfloating).toLocaleString()}명 많습니다.`
      : `평균보다 ${Math.abs(avgfloating).toLocaleString()}명 적습니다.`;
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {selectedAdminName} 인구 분포
      </h3>
      {/* ✅ 상주인구 요약 정보 표시 */}
      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <div className="flex flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={residentLabels}
            datasets={[
              {
                label: "남성",
                data: maleResident,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                barPercentage: 0.5, // 개별 막대 너비 조정
                categoryPercentage: 0.8 // 그룹 내 막대 간격 조정
              },
              {
                label: "여성",
                data: femaleResident,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                barPercentage: 0.5,
                categoryPercentage: 0.8
              }
            ]}
            height={300}
            title="연령대별 상주인구 분포"
            xAxisLabel="연령대"
            yAxisLabel="인구 수"
            stacked={false} // ✅ 남녀가 나란히 표시되도록 수정
          />
          <div className="grid grid-row-3 gap-4 md:px-10 justify-center md:w-120">
            <div>
              <p className="text-sm text-gray-600">총 상주인구</p>
              <p className="text-2xl font-bold">
                {populationData.resident_pop.총_상주인구.toLocaleString()}명
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">서울시 평균 대비</p>
              <p
                className={`text-xl ${
                  avgResident > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {resText}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">최다 인구 그룹</p>
              <p className="text-lg">
                {populationData.resident_pop.가장_많은_성별_연령대.구분}
                <span className="ml-2 text-gray-500">
                  (
                  {populationData.resident_pop.가장_많은_성별_연령대.인구수.toLocaleString()}
                  명)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <div className="flex flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={residentLabels}
            datasets={[
              {
                label: "남성",
                data: maleWorker,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                barPercentage: 0.5,
                categoryPercentage: 0.8
              },
              {
                label: "여성",
                data: femaleWorker,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                barPercentage: 0.5,
                categoryPercentage: 0.8
              }
            ]}
            height={300}
            title="연령대별 직장인구 분포"
            xAxisLabel="연령대"
            yAxisLabel="인구 수"
            stacked={false} // ✅ 남녀가 나란히 표시되도록 수정
          />
          <div className="grid grid-row-3 gap-4 md:px-10 justify-center md:w-120">
            <div>
              <p className="text-sm text-gray-600">총 상주인구</p>
              <p className="text-2xl font-bold">
                {populationData.working_pop.총_직장인구.toLocaleString()}명
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">서울시 평균 대비</p>
              <p
                className={`text-xl ${
                  avgResident > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {workText}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">최다 인구 그룹</p>
              <p className="text-lg">
                {populationData.working_pop.가장_많은_성별_연령대.구분}
                <span className="ml-2 text-gray-500">
                  (
                  {populationData.working_pop.가장_많은_성별_연령대.인구수.toLocaleString()}
                  명)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <div className="flex flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={residentLabels}
            datasets={[
              {
                label: "남성",
                data: malefloat,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                barPercentage: 0.5,
                categoryPercentage: 0.8
              },
              {
                label: "여성",
                data: femalefloat,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                barPercentage: 0.5,
                categoryPercentage: 0.8
              }
            ]}
            height={300}
            title="연령대별 유동인구 분포"
            xAxisLabel="연령대"
            yAxisLabel="인구 수"
            stacked={false} // ✅ 남녀가 나란히 표시되도록 수정
          />
          <div className="grid grid-row-3 gap-4 md:px-10 md:w-120">
            <div>
              <p className="text-sm text-gray-600">총 상주인구</p>
              <p className="text-2xl font-bold">
                {populationData.floating_pop.총_유동인구.toLocaleString()}명
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">서울시 평균 대비</p>
              <p
                className={`text-xl ${
                  avgfloating > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {floatText}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">최다 인구 그룹</p>
              <p className="text-lg">
                {populationData.floating_pop.가장_많은_성별_연령대.구분}
                <span className="ml-2 text-gray-500">
                  (
                  {populationData.floating_pop.가장_많은_성별_연령대.인구수.toLocaleString()}
                  명)
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <div className="flex flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={timeLabels}
            datasets={[
              {
                label: "유동인구",
                data: timeData,
                backgroundColor: "rgba(75, 192, 192, 0.6)"
              }
            ]}
            height={300}
            title="시간대별 유동인구 변화"
            xAxisLabel="시간대"
            yAxisLabel="인구 수"
          />
          <div className="grid grid-cols-2 gap-4 md:px-10 md:w-120">
            <div>
              <p className="text-sm text-gray-600 py-2">
                유동인구가 가장 많은 시간대
              </p>
              <p className="text-2xl font-bold py-2">
                {populationData.floating_pop.가장_많은_시간대}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 py-2">
                유동인구가 가장 적은 시간대
              </p>
              <p className="text-2xl font-bold py-2">
                {populationData.floating_pop.가장_적은_시간대}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <div className="flex flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={weekDays}
            datasets={[
              {
                label: "유동인구",
                data: weekData,
                backgroundColor: "rgba(153, 102, 255, 0.6)"
              }
            ]}
            height={300}
            title="요일별 유동인구 변화"
            xAxisLabel="요일"
            yAxisLabel="인구 수"
          />
          <div className="grid grid-cols-2 gap-4 md:px-10 md:w-120">
            <div>
              <p className="text-sm text-gray-600 py-2">
                유동인구가 가장 많은 시간대
              </p>
              <p className="text-2xl font-bold py-2">
                {populationData.floating_pop.가장_많은_시간대}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 py-2">
                유동인구가 가장 적은 시간대
              </p>
              <p className="text-2xl font-bold py-2">
                {populationData.floating_pop.가장_적은_시간대}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 py-2">
                유동인구가 가장 많은 요일
              </p>
              <p className="text-xl font-bold py-2">
                {populationData.floating_pop.가장_많은_요일}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 py-2">
                유동인구가 가장 적은 요일
              </p>
              <p className="text-2xl font-bold py-2">
                {populationData.floating_pop.가장_적은_요일}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationTab;
