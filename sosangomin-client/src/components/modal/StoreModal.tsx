import React, { useState } from "react";
import SearchableMap from "./SearchableMap";
import useStoreModalStore from "@/store/storeModalStore";
import { StoreModalProps, LocationInfo } from "@/types/store";
import { registerStore } from "@/features/auth/api/mypageApi";
const StoreModal: React.FC<StoreModalProps> = () => {
  const {
    isOpen,
    currentStep,
    storeName,
    businessNumber,
    selectedLocation,
    selectedCategory,
    selectedPaymentOption,
    closeModal,
    setCurrentStep,
    setStoreName,
    setBusinessNumber,
    setSelectedCategory,
    setSelectedLocation,
    setSelectedPaymentOption,
    resetModalData
  } = useStoreModalStore();

  // 매장 위치 선택 핸들러
  const handleSelectLocation = (location: LocationInfo) => {
    setSelectedLocation(location);
  };

  // 이전 단계로 돌아가기
  const goToPreviousStep = () => {
    setCurrentStep(1);
  };

  // 비즈니스 번호 포맷팅 함수
  const formatBusinessNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // xxx-xx-xxxxx 형식으로 변환
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(
        5,
        10
      )}`;
    }
  };

  // 단계별 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">가게 위치 선택</h3>
            <p className="text-sm text-gray-600 mb-2">
              가게 이름을 검색하고 위치를 선택해 주세요.
            </p>
            <SearchableMap
              width="100%"
              height="300px" // 높이 조정
              onSelectLocation={handleSelectLocation}
            />

            {/* 선택된 위치 표시 */}
            {selectedLocation && (
              <div className="bg-gray-50 p-3 rounded-md mt-2 border border-blue-200">
                <div className="flex items-start">
                  <div className="bg-bit-main text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate">
                      {selectedLocation.name}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {selectedLocation.address}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md mb-2 border border-blue-200">
              <div className="flex items-start">
                <div className="bg-bit-main text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate">
                    {selectedLocation?.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {selectedLocation?.address}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="storeName"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                가게 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-bit-main"
              />
            </div>

            <div>
              <label
                htmlFor="businessNumber"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                사업자 등록번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessNumber"
                value={businessNumber}
                onChange={(e) => {
                  // 숫자와 하이픈만 입력 가능하게 설정하고 자동 포맷팅
                  const formattedValue = formatBusinessNumber(e.target.value);
                  setBusinessNumber(formattedValue);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                placeholder="000-00-00000"
                maxLength={12} // xxx-xx-xxxxx 형식에 맞게 최대 길이 제한
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-bit-main"
              />
              <p className="text-xs text-gray-500 mt-1">형식: 000-00-00000</p>
            </div>
            <div>
              <label
                htmlFor="paymentSelect"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                결제 옵션 선택 <span className="text-red-500">*</span>
              </label>
              <select
                id="paymentSelect"
                value={selectedPaymentOption}
                onChange={(e) => {
                  setSelectedPaymentOption(e.target.value);
                }}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-bit-main bg-white"
              >
                <option value="" disabled>
                  결제 옵션을 선택하세요
                </option>
                <option value="키움">키움</option>
                <option value="토스">토스</option>
              </select>
            </div>

            {/* 외식업 카테고리 선택 */}
            <div>
              <label
                htmlFor="categorySelect"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                외식업 카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                id="categorySelect"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-bit-main bg-white"
              >
                {/* 기본값 */}
                <option value="" disabled>
                  카테고리를 선택하세요
                </option>

                {/* 외식업 목록 */}
                {[
                  "한식음식점",
                  "중식음식점",
                  "일식음식점",
                  "양식음식점",
                  "제과점",
                  "패스트푸드점",
                  "치킨전문점",
                  "분식전문점",
                  "호프-간이주점",
                  "커피-음료",
                  "반찬가게"
                ].map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 버튼 텍스트와 유효성 검사 설정
  const getButtonConfig = () => {
    if (currentStep === 1) {
      const isValid = !!selectedLocation;
      return {
        text: "다음",
        isValid
      };
    } else {
      // 사업자 등록번호 형식 검사 (000-00-00000)
      const businessNumberPattern = /^\d{3}-\d{2}-\d{5}$/;
      const isValidBusinessNumber = businessNumberPattern.test(businessNumber);

      // 모든 필수 항목이 입력되었는지 확인
      const isValid =
        !!storeName.trim() && isValidBusinessNumber && !!selectedCategory;
      return {
        text: "가게 등록",
        isValid
      };
    }
  };

  const buttonConfig = getButtonConfig();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!buttonConfig.isValid || isSubmitting) return;
    setIsSubmitting(true);

    if (currentStep === 1) {
      setCurrentStep(2);
      setIsSubmitting(false);
    } else {
      if (!selectedLocation) {
        alert("가게 위치가 선택되지 않았습니다.");
        setIsSubmitting(false);
        return;
      }

      try {
        const payload = {
          store_name: storeName,
          business_number: businessNumber,
          pos_type: selectedPaymentOption,
          category: selectedCategory
        };
        await registerStore(payload);

        alert("가게 등록이 완료되었습니다.");
        closeModal();
        resetModalData();
      } catch (error) {
        alert("가게 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 모달이 닫힌 상태면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto my-4 overflow-hidden">
        <div className="flex justify-between items-center bg-bit-main p-4 border-b">
          <h2 className="text-lg font-bold text-white">가게 등록</h2>
          <button
            onClick={closeModal}
            className="text-white hover:scale-110 transform transition-transform"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {/* 단계 표시 */}
          <div className="mb-4">
            <div className="flex items-center">
              <div
                className={`rounded-full h-6 w-6 flex items-center justify-center ${
                  currentStep >= 1 ? "bg-bit-main text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${
                  currentStep >= 2 ? "bg-bit-main" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`rounded-full h-6 w-6 flex items-center justify-center ${
                  currentStep >= 2 ? "bg-bit-main text-white" : "bg-gray-200"
                }`}
              >
                2
              </div>
            </div>
            <div className="flex justify-between mt-1 text-xs">
              <span>위치 선택</span>
              <span>기본 정보</span>
            </div>
          </div>

          {/* 현재 단계 컨텐츠 */}
          <div className="max-h-[calc(92vh-200px)] overflow-y-auto">
            {renderStep()}
          </div>

          {/* 버튼 영역 */}
          <div className="mt-4 flex justify-end border-t pt-4">
            {currentStep === 2 && (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded mr-2 hover:bg-gray-300 text-sm"
              >
                이전
              </button>
            )}

            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded mr-2 hover:bg-gray-300 text-sm"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!buttonConfig.isValid || isSubmitting}
              className={`px-3 py-1 rounded text-sm ${
                buttonConfig.isValid && !isSubmitting
                  ? "bg-bit-main text-white hover:bg-blue-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "처리 중..." : buttonConfig.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
