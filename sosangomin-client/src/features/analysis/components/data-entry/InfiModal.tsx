// InfoModal.tsx - Updated to match design
import React from "react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  title,
  content
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
      <div className="bg-basic-white rounded-md shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center border-b border-border p-4">
          <h3 className="text-base font-medium text-bit-main">{title}</h3>
          <button
            onClick={onClose}
            className="text-comment-text hover:text-comment"
            aria-label="닫기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
        <div className="p-5 text-sm text-comment">{content}</div>
        <div className="bg-gray-50 px-4 py-3 flex justify-end">
          <button
            type="button"
            className="bg-bit-main text-basic-white px-4 py-2 rounded-md hover:bg-opacity-90"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
