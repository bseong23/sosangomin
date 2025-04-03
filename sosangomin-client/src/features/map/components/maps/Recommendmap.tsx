import React, { useState } from "react";
import { getTopRecommendedLocations } from "@/features/map/api/recommendApi"; // API 호출 함수 가져오기
import RecommendModal from "./RecommendModal";

const Recommendmap: React.FC = () => {
  // 업종 선택 상태 (하나만 선택 가능)
  const [selectedBusinessType, setSelectedBusinessType] = useState<
    string | null
  >(null);

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

      {/* 분석하기 버튼 */}
      <button
        onClick={handleAnalyze}
        className="w-full bg-bit-main hover:bg-blue-900 text-white py-3 rounded-md font-medium"
      >
        분석 하기
      </button>

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
