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

  // 우선 순위 선택
  const handlePriorityClick = (priority: string) => {
    setSelectedPriorities((prev) => {
      if (prev.includes(priority)) {
        // 이미 선택된 경우 제거
        return prev.filter((p) => p !== priority);
      } else if (prev.length < 3) {
        // 선택 개수가 3개 미만인 경우 추가
        return [...prev, priority];
      } else {
        // 선택 개수가 3개를 초과하면 변경하지 않음
        return prev;
      }
    });
  };
  // 지도에서 보기 버튼 클릭 핸들러
  const handleShowOnMap = async () => {
    if (
      !selectedBusinessType ||
      !selectedAgeGroup ||
      selectedPriorities.length === 0
    ) {
      alert("업종, 연령대, 우선 순위를 선택해주세요.");
      return;
    }

    try {
      const response = await getTopRecommendedMap(
        selectedBusinessType,
        selectedAgeGroup.replace("대", ""),
        selectedPriorities,
        3
      );

      setMapRecommendationData(response); // 자기 내부 상태로 저장
      if (onMapData) {
        onMapData(response); // ✅ 부모에 데이터 전달
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
      selectedPriorities.length === 0
    ) {
      alert("업종, 연령대, 우선 순위를 선택해주세요.");
      return;
    }

    try {
      // API 호출
      const response = await getTopRecommendedLocations(
        selectedBusinessType, // 업종 이름
        selectedAgeGroup.replace("대", ""), // 연령대 ("20대" → "20"으로 변환)
        selectedPriorities, // 우선 순위 배열
        3 // TOP N 값
      );

      // API 결과 저장 및 모달 열기
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
        <select
          className="w-full px-4 py-2 border border-[#BCBCBC] rounded-md bg-[#FFFFFF] text-[#000000] focus:outline-none focus:border-bit-main"
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
      </div>

      {/* 타겟 연령 선택 */}
      <div className="mb-6">
        <p className="mb-2 font-medium">타겟 연령</p>
        <select
          className="w-full px-4 py-2 border border-[#BCBCBC] rounded-md bg-[#FFFFFF] text-[#000000] focus:outline-none focus:border-bit-main"
          value={selectedAgeGroup || ""}
          onChange={(e) => setSelectedAgeGroup(e.target.value)}
        >
          <option value="">타겟 연령대 선택</option>
          {["10대", "20대", "30대", "40대", "50대", "60대 이상"].map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      {/* 우선 순위 선택 */}
      <div className="mb-6">
        <p className="mb-2 font-medium">우선 순위</p>
        <div className="grid grid-cols-3 gap-2">
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
          ].map((priority) => (
            <button
              key={priority}
              className={`p-auto rounded-full text-sm border w-28 h-full ${
                selectedPriorities.includes(priority)
                  ? "bg-bit-main text-white border-blue-600"
                  : "bg-[#FFFFFF] text-comment border-[#BCBCBC] hover:bg-gray-100"
              }`}
              onClick={() => handlePriorityClick(priority)}
            >
              {priority}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          최대 3개까지 선택할 수 있습니다.
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
          분석하기
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
