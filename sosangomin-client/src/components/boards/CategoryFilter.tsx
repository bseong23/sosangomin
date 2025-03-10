import React from "react";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const categories = [
    { id: "policy", name: "지원정책" },
    { id: "startup", name: "창업정보" },
    { id: "management", name: "경영관리" },
    { id: "trend", name: "시장동향" },
    { id: "promotion", name: "플랫폼" }
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-[25px] py-[9px] rounded-full border border-[#BCBCBC] text-sm font-medium ${
            activeCategory === category.id
              ? "bg-[#0078D4] text-white border-[#0078D4]"
              : "bg-[#ffffff] text-gray-700 hover:bg-gray-100"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
