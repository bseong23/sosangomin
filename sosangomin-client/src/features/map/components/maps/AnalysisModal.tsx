import React, { useEffect } from "react";
import { AnalysisModalProps } from "@/features/map/types/map";
import { createPortal } from "react-dom";
const AnalysisModal: React.FC<AnalysisModalProps> = ({
  isOpen,
  onClose,
  title,
  selectedAdminName
}) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden"; // 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto"; // 원래 상태로 복구
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white h-[80%] w-[90%] rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center border-b px-6 py-4">
          {selectedAdminName && (
            <p className="font-medium">{selectedAdminName}</p>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <p>인구 분포 상세 정보를 여기에 표시합니다.</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AnalysisModal;
