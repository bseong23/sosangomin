import React, { useState } from "react";
import SearchableMap from "./SearchableMap";

interface StoreModalProps {
  onClose: () => void;
}

interface LocationInfo {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

const StoreModal: React.FC<StoreModalProps> = ({ onClose }) => {
  const [storeName, setStoreName] = useState<string>("");
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [storeDescription, setStoreDescription] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(
    null
  );
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 매장 위치 선택 핸들러
  const handleSelectLocation = (location: LocationInfo) => {
    setSelectedLocation(location);
    setStoreName(location.name); // 선택한 장소 이름을 가게 이름으로 자동 설정
  };

  // 이전 단계로 돌아가기
  const goToPreviousStep = () => {
    // 선택된 가게 정보는 유지하면서 단계만 이동
    setCurrentStep(1);
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-md mb-2">
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
                가게 이름
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
                사업자 등록번호
              </label>
              <input
                type="text"
                id="businessNumber"
                value={businessNumber}
                onChange={(e) => {
                  // 숫자와 하이픈만 입력 가능하게 설정
                  const value = e.target.value.replace(/[^0-9-]/g, "");
                  setBusinessNumber(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                placeholder="000-00-00000"
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-bit-main"
              />
            </div>

            <div>
              <label
                htmlFor="storeDescription"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                가게 설명
              </label>
              <textarea
                id="storeDescription"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-bit-main"
                rows={3} // 줄 수 감소
              />
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
      const isValid = !!storeName.trim() && !!businessNumber.trim();
      return {
        text: "가게 등록",
        isValid
      };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto my-4 overflow-hidden">
        <div className="flex justify-between items-center bg-bit-main p-4 border-b">
          <h2 className="text-lg font-bold text-white">가게 등록</h2>
          <button
            onClick={onClose}
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
          <div className="max-h-[calc(80vh-200px)] overflow-y-auto">
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
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded mr-2 hover:bg-gray-300 text-sm"
            >
              취소
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (buttonConfig.isValid) {
                  if (currentStep === 1) {
                    if (selectedLocation) {
                      setCurrentStep(2);
                    } else {
                      alert("가게 위치를 선택해주세요.");
                    }
                  } else {
                    // 최종 제출 처리
                    const storeData = {
                      name: storeName,
                      description: storeDescription,
                      businessNumber: businessNumber,
                      location: selectedLocation
                    };
                    console.log("등록할 가게 정보:", storeData);
                    // 여기에 API 호출 등의 저장 로직 추가
                    // 성공 후 모달 닫기
                    onClose();
                  }
                }
              }}
              disabled={!buttonConfig.isValid}
              className={`px-3 py-1 rounded text-sm ${
                buttonConfig.isValid
                  ? "bg-bit-main text-white hover:bg-blue-900"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {buttonConfig.text}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
