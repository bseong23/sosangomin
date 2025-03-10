import React from "react";
import { PaginationProps } from "@/types/common";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const pages = [];

  // 처음 페이지와 이전 페이지 버튼
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 다음 페이지와 마지막 페이지 버튼
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 페이지 번호 생성
  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`px-3 py-1 mx-1 ${currentPage === i ? "font-bold" : ""}`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex justify-center items-center mt-6">
      <button onClick={() => onPageChange(1)} className="px-3 py-1 mx-1">
        &laquo;
      </button>
      <button onClick={handlePrev} className="px-3 py-1 mx-1">
        &lt;
      </button>
      {pages}
      <button onClick={handleNext} className="px-3 py-1 mx-1">
        &gt;
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        className="px-3 py-1 mx-1"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
