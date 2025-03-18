import React from "react";
import { CategoryFilterProps } from "@/features/board/types/news";

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const categories = [
    { id: "all", name: "전체" },
    { id: "지원정책", name: "지원정책" },
    { id: "창업정보", name: "창업정보" },
    { id: "경영관리", name: "경영관리" },
    { id: "시장동향", name: "시장동향" },
    { id: "플랫폼", name: "플랫폼" },
    { id: "기타", name: "기타" }
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex whitespace-nowrap gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-2 rounded-full border border-[#BCBCBC] flex-shrink-0 min-w-[80px] text-center ${
              activeCategory === category.id
                ? "bg-[#0078D4] text-white border-[#0078D4]"
                : "bg-[#ffffff] text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
