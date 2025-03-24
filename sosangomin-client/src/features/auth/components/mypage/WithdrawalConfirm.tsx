// src/components/withdrawal/WithdrawalConfirm.tsx
import React, { useState } from "react";

interface WithdrawalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

const WithdrawalConfirm: React.FC<WithdrawalConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing
}) => {
  const [confirmText, setConfirmText] = useState<string>("");

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 안전장치: "회원탈퇴" 텍스트 입력 확인
    if (confirmText !== "회원탈퇴") {
      alert('확인 텍스트가 일치하지 않습니다. "회원탈퇴"를 입력해주세요.');
      return;
    }

    // 회원 탈퇴 진행
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-basic-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-red-600">회원 탈퇴</h2>

        <div className="mb-6">
          <p className="text-comment mb-4">
            회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다. 정말로
            탈퇴하시겠습니까?
          </p>

          <div className="bg-gray-100 p-3 rounded mb-4">
            <ul className="list-disc pl-5 text-sm text-comment-text">
              <li className="mb-1">
                계정 정보 및 개인 데이터가 모두 삭제됩니다.
              </li>
              <li className="mb-1">
                작성한 게시글 및 댓글은 삭제되지 않습니다.
              </li>
              <li className="mb-1">
                탈퇴 후에는 같은 계정으로 재가입이 가능합니다.
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-comment mb-1">
                확인을 위해 "회원탈퇴"를 입력해주세요
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:border-bit-main"
                placeholder="회원탈퇴"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-comment bg-gray-200 rounded hover:bg-gray-300 focus:outline-none"
                disabled={isProcessing}
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-basic-white bg-red-600 rounded hover:bg-red-700 focus:outline-none"
                disabled={isProcessing || confirmText !== "회원탈퇴"}
              >
                {isProcessing ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalConfirm;
