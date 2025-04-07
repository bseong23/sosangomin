import React, { useState, useEffect } from "react";
import BarChart from "@/components/chart/BarChart"; // 커스텀 BarChart 컴포넌트 임포트
import { getPopulation } from "@/features/map/api/analiysisApi"; // API 함수 경로는 실제 경로에 맞게 수정해주세요

interface PopulationTabProps {
  selectedAdminName?: string;
  selectedCategory?: string;
}

const PopulationTab: React.FC<PopulationTabProps> = ({
  selectedAdminName = "지역 미지정"
}) => {
  const [populationData, setPopulationData] = useState<any>(null);

  useEffect(() => {
    const fetchPopulationData = async () => {
      if (selectedAdminName && selectedAdminName !== "지역 미지정") {
        try {
          const data = await getPopulation(selectedAdminName);
          setPopulationData(data);
        } catch (error) {
          console.error("인구 데이터 로딩 실패:", error);
        } finally {
        }
      }
    };
    fetchPopulationData();
  }, [selectedAdminName]);
  if (!populationData) return <p>데이터를 불러오는 중...</p>;
  // ✅ 시간대별 유동인구 데이터 가공
  const timelabel = [
    "00시 ~ 05시",
    "06시 ~ 08시",
    "09시 ~ 11시",
    "12시 ~ 4시",
    '"15시 ~ 17시',
    "18시 ~ 20시",
    "21시 ~ 23시"
  ];
  const timeLabels = [
    "심야",
    "이른 아침",
    "오전",
    "점심",
    "오후",
    "퇴근 시간",
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
        <h3 className="text-lg font-semibold mb-4">상주인구 구성</h3>
        <div className="flex items-center flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={residentLabels}
            datasets={[
              {
                label: "남성",
                data: maleResident,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                barPercentage: 1, // 개별 막대 너비 조정
                categoryPercentage: 0.8 // 그룹 내 막대 간격 조정
              },
              {
                label: "여성",
                data: femaleResident,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                barPercentage: 1,
                categoryPercentage: 0.8
              }
            ]}
            customOptions={{
              scales: {
                y: {
                  min: 0 // Y축 최소값을 20,000으로 설정
                }
              }
            }}
            height={300}
            unit="명"
            xAxisLabel="연령대"
            yAxisLabel="인구 수"
            stacked={false} // ✅ 남녀가 나란히 표시되도록 수정
          />
          <div className="grid grid-rows-3 gap-4 md:px-4 md:w-120">
            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">총 상주인구</p>
                <p className="text-lg font-bold text-gray-900">
                  {(
                    populationData.resident_pop.총_상주인구 || 0
                  ).toLocaleString()}
                  <span className="text-base ml-1 font-normal">명</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">서울시 평균 대비</p>
                <p
                  className={`text-lg font-bold ${
                    avgResident > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {resText}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-green-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">최다 인구 그룹</p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.resident_pop.가장_많은_성별_연령대?.구분 ||
                    "데이터 없음"}
                  <span className="ml-1 text-base font-normal text-gray-500">
                    (
                    {(
                      populationData.resident_pop.가장_많은_성별_연령대
                        ?.인구수 || 0
                    ).toLocaleString()}
                    명)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">직장인구 구성</h3>
        <div className="flex items-center flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={residentLabels}
            datasets={[
              {
                label: "남성",
                data: maleWorker,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                barPercentage: 1,
                categoryPercentage: 0.8
              },
              {
                label: "여성",
                data: femaleWorker,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                barPercentage: 1,
                categoryPercentage: 0.8
              }
            ]}
            customOptions={{
              scales: {
                y: {
                  min: 0 // Y축 최소값을 20,000으로 설정
                }
              }
            }}
            height={300}
            xAxisLabel="연령대"
            unit="명"
            yAxisLabel="인구 수"
            stacked={false} // ✅ 남녀가 나란히 표시되도록 수정
          />
          <div className="grid grid-rows-3 gap-4 md:px-4 md:w-120">
            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">총 직장인구</p>
                <p className="text-lg font-bold text-gray-900">
                  {(
                    populationData.working_pop.총_직장인구 || 0
                  ).toLocaleString()}
                  <span className="text-base ml-1 font-normal">명</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">서울시 평균 대비</p>
                <p
                  className={`text-lg font-bold ${
                    avgWorkiong > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {workText}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-green-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">최다 인구 그룹</p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.working_pop.가장_많은_성별_연령대?.구분 ||
                    "데이터 없음"}
                  <span className="ml-1 text-base font-normal text-gray-500">
                    (
                    {(
                      populationData.working_pop.가장_많은_성별_연령대
                        ?.인구수 || 0
                    ).toLocaleString()}
                    명)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">유동인구 구성</h3>
        <div className="flex items-center flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={residentLabels}
            datasets={[
              {
                label: "남성",
                data: malefloat,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                barPercentage: 1,
                categoryPercentage: 0.8
              },
              {
                label: "여성",
                data: femalefloat,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                barPercentage: 1,
                categoryPercentage: 0.8
              }
            ]}
            customOptions={{
              scales: {
                y: {
                  min: 0 // Y축 최소값을 20,000으로 설정
                }
              }
            }}
            height={300}
            unit="명"
            xAxisLabel="연령대"
            yAxisLabel="인구 수"
            stacked={false} // ✅ 남녀가 나란히 표시되도록 수정
          />
          <div className="grid grid-rows-3 gap-4 md:px-4 md:w-120">
            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">총 유동인구</p>
                <p className="text-lg font-bold text-gray-900">
                  {(
                    populationData.floating_pop.총_유동인구 || 0
                  ).toLocaleString()}
                  <span className="text-base ml-1 font-normal">명</span>
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">서울시 평균 대비</p>
                <p
                  className={`text-lg font-bold ${
                    avgfloating > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {floatText}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-green-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">최다 인구 그룹</p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.floating_pop.가장_많은_성별_연령대?.구분 ||
                    "데이터 없음"}
                  <span className="ml-1 text-base font-normal text-gray-500">
                    (
                    {(
                      populationData.floating_pop.가장_많은_성별_연령대
                        ?.인구수 || 0
                    ).toLocaleString()}
                    명)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">시간대별 유동인구</h3>
        <div className="flex items-center flex-col px-2 py-4 md:flex-row">
          <BarChart
            labels={timelabel}
            datasets={[
              {
                label: "", // 레이블을 빈 문자열로 설정
                data: timeData,
                backgroundColor: "rgba(75, 192, 192, 0.6)"
              }
            ]}
            customOptions={{
              scales: {
                y: {
                  min: 0 // Y축 최소값을 20,000으로 설정
                }
              }
            }}
            height={300}
            unit="명"
            xAxisLabel="시간대"
            yAxisLabel="인구 수"
            legend={false} // 범례 표시 끄기
            title="" // 제목 비우기
          />
          <div className="flex justify-center flex-col gap-10 md:px-4 md:w-120">
            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  유동인구가 가장 많은 시간대
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.floating_pop.가장_많은_시간대 ||
                    "데이터 없음"}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-red-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  유동인구가 가장 적은 시간대
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.floating_pop.가장_적은_시간대 ||
                    "데이터 없음"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg shadow-md inset-shadow-xs">
        <h3 className="text-lg font-semibold mb-4">요일별 유동인구</h3>
        <div className="flex items-center flex-col px-2 py-4 md:flex-row">
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
            legend={false}
            unit="명"
            xAxisLabel="요일"
            yAxisLabel="인구 수"
            customOptions={{
              scales: {
                y: {
                  min: 20000 // Y축 최소값을 20,000으로 설정
                }
              }
            }}
          />
          <div className="flex flex-col gap-4 md:px-4 md:w-120">
            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  유동인구가 가장 많은 요일
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.floating_pop.가장_많은_요일}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-red-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">
                  유동인구가 가장 적은 요일
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.floating_pop.가장_적은_요일}
                </p>
              </div>
            </div>

            <div className="p-3 bg-white shadow-md rounded-lg border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">평균 유동인구 비교</p>
                <p className="text-lg font-bold text-gray-900">
                  {populationData.floating_pop.주말_평균_유동인구 >
                  populationData.floating_pop.평일_평균_유동인구 ? (
                    <span className="text-blue-600">
                      주말이{" "}
                      {Math.abs(
                        populationData.floating_pop.주말_평균_유동인구 -
                          populationData.floating_pop.평일_평균_유동인구
                      ).toLocaleString()}
                      명 더 많습니다.
                    </span>
                  ) : (
                    <span className="text-green-600">
                      평일이{" "}
                      {Math.abs(
                        populationData.floating_pop.평일_평균_유동인구 -
                          populationData.floating_pop.주말_평균_유동인구
                      ).toLocaleString()}
                      명 더 많습니다.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationTab;
