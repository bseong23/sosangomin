import React, { useState } from "react";
import {
  getTopRecommendedLocations,
  getTopRecommendedMap
} from "@/features/map/api/recommendApi"; // API 호출 함수 가져오기
import RecommendModal from "./RecommendModal";
interface RecommendmapProps {
  onMapData?: (data: any) => void; // 콜백을 선택적 props로 추가
}
const Recommendmap: React.FC<RecommendmapProps> = ({ onMapData }) => {
  // 업종 선택 상태 (하나만 선택 가능)
  const [selectedBusinessType, setSelectedBusinessType] = useState<
    string | null
  >(null);
  const [, setMapRecommendationData] = useState<any>(null);

  // 타겟 연령대 선택 상태 (하나만 선택 가능)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  // priority 상태 (최대 3개 선택 가능)
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  // 모달 상태 및 API 결과 데이터
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [recommendationData, setRecommendationData] = useState<any>(null);

  // 모달 열기/닫기
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setRecommendationData(null);
  };

  // 순위별 우선순위 변경 핸들러
  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...selectedPriorities];

    // 이미 다른 순위에서 선택된 값이면 해당 값 제거
    if (value && newPriorities.includes(value)) {
      const existingIndex = newPriorities.indexOf(value);
      newPriorities[existingIndex] = "";
    }

    // 새 값 설정 또는 해제
    newPriorities[index] = value;

    // 만약 선택 해제한 경우, 해당 인덱스만 비움 (이후 순위는 그대로 유지)
    setSelectedPriorities(newPriorities);
  };

  // 지도에서 보기 버튼 클릭 핸들러
  const handleShowOnMap = async () => {
    if (
      !selectedBusinessType ||
      !selectedAgeGroup ||
      selectedPriorities.filter((p) => p).length === 0
    ) {
      alert("업종, 연령대, 우선 순위를 선택해주세요.");
      return;
    }

    try {
      const filteredPriorities = selectedPriorities.filter((p) => p); // 빈 문자열 제거

      // 연령대에서 숫자만 추출
      const ageValue =
        selectedAgeGroup === "60대 이상"
          ? "60"
          : selectedAgeGroup.replace(/[^0-9]/g, "");

      const response = await getTopRecommendedMap(
        selectedBusinessType,
        ageValue,
        filteredPriorities,
        3
      );

      setMapRecommendationData(response);
      if (onMapData) {
        onMapData(response);
      }
    } catch (error) {
      console.error("지도 추천 조회 실패:", error);
      alert("지도로 추천 지역을 불러오는데 실패했습니다.");
    }
  };

  // 분석 요청
  const handleAnalyze = async () => {
    if (
      !selectedBusinessType ||
      !selectedAgeGroup ||
      selectedPriorities.filter((p) => p).length === 0
    ) {
      alert("업종, 연령대, 우선 순위를 선택해주세요.");
      return;
    }

    try {
      const filteredPriorities = selectedPriorities.filter((p) => p); // 빈 문자열 제거

      // 연령대에서 숫자만 추출
      const ageValue =
        selectedAgeGroup === "60대 이상"
          ? "60"
          : selectedAgeGroup.replace(/[^0-9]/g, "");

      const response = await getTopRecommendedLocations(
        selectedBusinessType,
        ageValue,
        filteredPriorities,
        3
      );

      setRecommendationData(response);
      openModal();
    } catch (error) {
      console.error("추천 지역 조회 실패:", error);
      alert("추천 지역 조회에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">내 가게는 어디로 가야할까?</h2>
      </div>

      {/* 업종 선택 */}
      <div className="mb-6">
        <p className="mb-2 font-medium">업종</p>
        <div className="relative">
          <select
            className="w-full px-4 py-2 border border-[#BCBCBC] rounded-md bg-[#FFFFFF] text-[#000000] focus:outline-none focus:border-bit-main appearance-none pr-10"
            value={selectedBusinessType || ""}
            onChange={(e) => setSelectedBusinessType(e.target.value)}
          >
            <option value="">업종 선택</option>
            {[
              "한식음식점",
              "중식음식점",
              "일식음식점",
              "양식음식점",
              "제과점",
              "패스트푸드점",
              "치킨전문점",
              "분식전문점",
              "호프-간이주점",
              "커피-음료",
              "반찬가게"
            ].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 타겟 연령 선택 */}
      <div className="mb-6">
        <p className="mb-2 font-medium">타겟 연령</p>
        <div className="relative">
          <select
            className="w-full px-4 py-2 border border-[#BCBCBC] rounded-md bg-[#FFFFFF] text-[#000000] focus:outline-none focus:border-bit-main appearance-none pr-10"
            value={selectedAgeGroup || ""}
            onChange={(e) => {
              // 선택된 값을 상태로 저장
              setSelectedAgeGroup(e.target.value);
            }}
          >
            <option value="">타겟 연령대 선택</option>
            {["10대", "20대", "30대", "40대", "50대", "60대 이상"].map(
              (age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              )
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 우선 순위 선택 */}
      <div className="mb-6">
        <p className="mb-2 font-medium">우선 순위</p>

        {/* 1순위 선택 */}
        <div className="mb-3">
          <p className="text-sm mb-1 text-gray-600">1순위</p>
          <div className="relative">
            <select
              className="w-full px-4 py-2 border border-[#BCBCBC] rounded-md bg-[#FFFFFF] text-[#000000] focus:outline-none focus:border-bit-main appearance-none pr-10"
              value={selectedPriorities[0] || ""}
              onChange={(e) => handlePriorityChange(0, e.target.value)}
            >
              <option value="">1순위 선택</option>
              {[
                "타겟연령",
                "유동인구",
                "직장인구",
                "거주인구",
                "동일 업종 수",
                "업종 매출",
                "임대료",
                "집객시설 수",
                "접근성"
              ]
                .filter(
                  (priority) =>
                    !selectedPriorities.includes(priority) ||
                    selectedPriorities[0] === priority
                )
                .map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2순위 선택 */}
        <div className="mb-3">
          <p className="text-sm mb-1 text-gray-600">2순위 (선택사항)</p>
          <div className="relative">
            <select
              className="w-full px-4 py-2 border border-[#BCBCBC] rounded-md bg-[#FFFFFF] text-[#000000] focus:outline-none focus:border-bit-main appearance-none pr-10"
              value={selectedPriorities[1] || ""}
              onChange={(e) => handlePriorityChange(1, e.target.value)}
              disabled={!selectedPriorities[0]} // 1순위가 선택되지 않으면 비활성화
            >
              <option value="">2순위 선택 (선택사항)</option>
              {[
                "타겟연령",
                "유동인구",
                "직장인구",
                "거주인구",
                "동일 업종 수",
                "업종 매출",
                "임대료",
                "집객시설 수",
                "접근성"
              ]
                .filter(
                  (priority) =>
                    !selectedPriorities.includes(priority) ||
                    selectedPriorities[1] === priority
                )
                .map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3순위 선택 */}
        <div className="mb-3">
          <p className="text-sm mb-1 text-gray-600">3순위 (선택사항)</p>
          <div className="relative">
            <select
              className="w-full px-4 py-2 border border-[#BCBCBC] rounded-md bg-[#FFFFFF] text-[#000000] focus:outline-none focus:border-bit-main appearance-none pr-10"
              value={selectedPriorities[2] || ""}
              onChange={(e) => handlePriorityChange(2, e.target.value)}
              disabled={!selectedPriorities[1]} // 2순위가 선택되지 않으면 비활성화
            >
              <option value="">3순위 선택 (선택사항)</option>
              {[
                "타겟연령",
                "유동인구",
                "직장인구",
                "거주인구",
                "동일 업종 수",
                "업종 매출",
                "임대료",
                "집객시설 수",
                "접근성"
              ]
                .filter(
                  (priority) =>
                    !selectedPriorities.includes(priority) ||
                    selectedPriorities[2] === priority
                )
                .map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          최소 1개 이상, 최대 3개까지 선택할 수 있습니다.
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {/* 분석하기 버튼 */}
        <button
          onClick={handleAnalyze}
          className="w-full bg-bit-main hover:bg-blue-800 text-white py-3.5 rounded-md font-medium transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
          TOP3 추천받기
        </button>

        {/* 지도에서 보기 버튼 */}
        <button
          onClick={handleShowOnMap}
          className="w-full bg-white border-2 border-bit-main text-bit-main hover:bg-gray-50 py-3.5 rounded-md font-medium transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          지도에서 보기
        </button>
      </div>

      {/* RecommendModal */}
      <RecommendModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={recommendationData}
      />
    </div>
  );
};

export default Recommendmap;
