// src/features/review/components/ErrorMessage.tsx

import React from "react";
import { ErrorMessageProps } from "@/features/review/types/review";

/**
 * 리뷰 분석 오류 메시지 컴포넌트
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <div
      className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-4 ${className}`}
    >
      <strong className="font-bold">분석 오류:</strong>
      <span className="block sm:inline"> {message}</span>
      {actionLabel && onAction && (
        <div className="mt-4">
          <button
            onClick={onAction}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
