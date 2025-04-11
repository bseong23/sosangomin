import React, { useState, useEffect } from "react";

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: (agreed: boolean) => void;
  initialAgreed?: boolean; // 초기 동의 상태를 받을 수 있도록 추가
}

const AgreementModal: React.FC<AgreementModalProps> = ({
  isOpen,
  onClose,
  onAgree,
  initialAgreed = false // 기본값은 false
}) => {
  // useState에 initialAgreed 값을 직접 사용
  const [personalInfoAgreed, setPersonalInfoAgreed] = useState(initialAgreed);

  // 모달이 열릴 때마다 initialAgreed 값으로 상태 업데이트
  useEffect(() => {
    if (isOpen) {
      setPersonalInfoAgreed(initialAgreed);
    }
  }, [isOpen, initialAgreed]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!personalInfoAgreed) {
      alert("필수 동의 항목에 동의해주세요.");
      return;
    }

    onAgree(true);
    onClose(); // 동의 후 모달 닫기
  };

  const handleCancel = () => {
    // 취소 시 이전 동의 상태를 유지
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">개인정보 수집·이용 동의서</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded mb-4 text-sm text-gray-700 max-h-60 overflow-y-auto">
            <p className="mb-2">
              <strong>수집 항목:</strong> 연락처(이메일), 비밀번호, 사업자명,
              사업자등록번호, 매장 주소
            </p>
            <p className="mb-2">
              <strong>이용 목적:</strong> 회원 식별, 가게 등록, POS 데이터 기반
              분석 서비스 제공, 고객 지원
            </p>
            <p className="mb-2">
              <strong>보유 기간:</strong> 회원 탈퇴 시 또는 관련 법령에 따른
              보존 기간까지
            </p>
            <p className="text-xs text-red-500">
              ※ 위 항목에 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다.
            </p>
          </div>

          <div className="flex items-center mb-4">
            <input
              id="personalInfo"
              type="checkbox"
              checked={personalInfoAgreed}
              onChange={(e) => setPersonalInfoAgreed(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label
              htmlFor="personalInfo"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              동의합니다 (필수)<span className="text-red-500 ml-1">*</span>
            </label>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!personalInfoAgreed}
              className={`px-6 py-2.5 rounded-md text-sm font-medium text-white ${
                personalInfoAgreed
                  ? "bg-bit-main hover:bg-blue-900"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              동의하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgreementModal;
