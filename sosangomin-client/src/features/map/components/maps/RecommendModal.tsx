import React from "react";
import { RecommendModalProps } from "@/features/map/types/map";
import { createPortal } from "react-dom";

const RecommendModal: React.FC<RecommendModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) {
    return null;
  }

  // 데이터 포맷팅 헬퍼 함수
  const formatNumber = (num: number) => {
    return num ? num.toLocaleString("ko-KR") : "0";
  };

  // 데이터가 있는지 확인
  const hasData = data && data.top_locations && data.top_locations.length > 0;
  console.log(data);
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden">
      {/* 모달 컨테이너 */}
      <div className="bg-white w-[90%] md:w-[80%] max-h-[90vh] mx-auto rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-white">
          <h2 className="text-base font-bold">최적의 위치 추천 결과</h2>

          {/* 닫기 버튼 */}
          <button onClick={onClose} className="hover:text-gray-200">
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

        {/* 모달 본문 */}
        <div className="p-6 overflow-y-auto">
          {hasData ? (
            <div className="space-y-8">
              <p className="text-gray-600 mb-4">
                선택한 조건에 맞는 추천 지역 결과입니다. 아래 지역들은 선택하신
                우선 순위에 따라 높은 점수를 받은 지역입니다.
              </p>

              {/* TOP 위치 리스트 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.top_locations.map((location, index) => (
                  <div
                    key={index}
                    className="border rounded-lg shadow-md overflow-hidden"
                  >
                    {/* 지역 헤더 */}
                    <div
                      className={`p-4 ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-amber-600"
                      } text-white`}
                    >
                      <h3 className="text-lg font-bold">
                        {index + 1}위: {location.행정동명}
                      </h3>
                    </div>

                    {/* 지역 상세 정보 */}
                    <div className="p-4 space-y-2 bg-white">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          타겟 연령 비율:
                        </span>
                        <span>
                          {(location.타겟연령_비율 * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          타겟 연령 수:
                        </span>
                        <span>{formatNumber(location.타겟연령_수)}명</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          업종 평균 매출:
                        </span>
                        <span>
                          {formatNumber(Math.round(location.업종_평균_매출))}원
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          임대료:
                        </span>
                        <span>
                          {formatNumber(Math.round(location.임대료))}원/㎡
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          유동인구:
                        </span>
                        <span>
                          {formatNumber(
                            Math.round(location["유동인구(면적당)"])
                          )}
                          명
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          직장인구:
                        </span>
                        <span>
                          {formatNumber(
                            Math.round(location["직장인구(면적당)"])
                          )}
                          명
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          거주인구:
                        </span>
                        <span>
                          {formatNumber(
                            Math.round(location["거주인구(면적당)"])
                          )}
                          명
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          동일업종 수:
                        </span>
                        <span>
                          {formatNumber(
                            Math.round(location["동일업종_수(면적당)"])
                          )}
                          개
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium text-gray-600">
                          집객시설:
                        </span>
                        <span>
                          {formatNumber(
                            Math.round(location["집객시설(면적당)"])
                          )}
                          개
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">
                          접근성:
                        </span>
                        <span>{location.접근성.toFixed(1)}점</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 평균값 정보 */}
              <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-bold text-gray-700 mb-4">
                  서울시 평균 데이터
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">타겟 연령 비율</p>
                    <p className="font-bold text-lg">
                      {(data.average_values.타겟연령_비율 * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">타겟 연령 수</p>
                    <p className="font-bold text-lg">
                      {formatNumber(
                        Math.round(data.average_values.타겟연령_수)
                      )}
                      명
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">업종 평균 매출</p>
                    <p className="font-bold text-lg">
                      {formatNumber(
                        Math.round(data.average_values.업종_평균_매출)
                      )}
                      원
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">평균 임대료</p>
                    <p className="font-bold text-lg">
                      {formatNumber(Math.round(data.average_values.임대료))}원
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                데이터가 없습니다
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                다른 조건으로 다시 시도해 주세요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RecommendModal;
