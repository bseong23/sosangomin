import React, { useState } from "react";

const Recommendmap: React.FC = () => {
  // 업종 선택 상태 (배열로 변경)
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>(
    []
  );

  // 타겟 연령대 선택 상태 (배열로 변경)
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);

  const handleBusinessTypeClick = (type: string) => {
    setSelectedBusinessTypes((prev) => {
      // 이미 선택된 경우 제거, 아니면 추가
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleAgeGroupClick = (age: string) => {
    setSelectedAgeGroups((prev) => {
      // 이미 선택된 경우 제거, 아니면 추가
      if (prev.includes(age)) {
        return prev.filter((a) => a !== age);
      } else {
        return [...prev, age];
      }
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">내 가게는 어디로 가야할까?</h2>
      </div>

      {/* 업종 선택 */}
      <div className="mb-6">
        <p className="mb-2 font-medium">업종</p>
        <div className="flex flex-wrap gap-2">
          {["한식", "양식", "중식", "일식", "아시아"].map((type) => (
            <button
              key={type}
              className={`p-auto rounded-full text-sm border w-20 h-full ${
                selectedBusinessTypes.includes(type)
                  ? "bg-[#0083E2] text-white border-blue-600"
                  : "bg-[#FFFFFF] text-[#000000] border-[#BCBCBC] hover:bg-gray-100"
              }`}
              onClick={() => handleBusinessTypeClick(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 타겟 연령 */}
      <div className="mb-6">
        <p className="mb-2 font-medium">타겟연령</p>
        <div className="flex flex-wrap gap-2">
          {["10대", "20대", "30대", "40대", "50대", "기타"].map((age) => (
            <button
              key={age}
              className={`p-auto rounded-full text-sm border w-20 h-full ${
                selectedAgeGroups.includes(age)
                  ? "bg-[#0083E2] text-white border-blue-600"
                  : "bg-[#FFFFFF] text-[#000000] border-[#BCBCBC] hover:bg-gray-100"
              }`}
              onClick={() => handleAgeGroupClick(age)}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* 분석하기 버튼 */}
      <button className="w-full bg-blue-800 text-white py-3 rounded-md font-medium">
        분석 하기
      </button>
    </div>
  );
};

export default Recommendmap;
