import React from "react";
import { PaginationProps } from "@/types/common";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
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

  // 항상 5개의 페이지 번호가 표시되도록 로직 수정
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // 총 페이지가 5개 이하인 경우
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }
    // 총 페이지가 5개 초과인 경우
    else {
      // 현재 페이지가 1, 2인 경우 -> 1~5 표시
      if (currentPage < 3) {
        pageNumbers.push(1, 2, 3, 4, 5);
      }
      // 현재 페이지가 마지막 또는 마지막-1인 경우 -> 마지막-4 ~ 마지막 표시
      else if (currentPage > totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      }
      // 그 외의 경우 -> 현재 페이지 중심으로 -2 ~ +2 표시
      else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers.map((number) => (
      <button
        key={number}
        onClick={() => onPageChange(number)}
        className={`px-3 py-1 mx-1 ${
          currentPage === number ? "font-bold" : ""
        }`}
      >
        {number}
      </button>
    ));
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <button onClick={() => onPageChange(1)} className="px-3 py-1 mx-1">
        &laquo;
      </button>
      <button onClick={handlePrev} className="px-3 py-1 mx-1">
        &lt;
      </button>
      {renderPageNumbers()}
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
