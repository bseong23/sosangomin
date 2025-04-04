import React, { useState, useEffect } from "react";
import useStoreStore from "@/store/storeStore";
import { useCompetitorStore } from "@/store/useCompetitorStore";
import SearchableMapModal from "@/features/competitor/components/SearchableMapModel";
import ImprovedCompetitorReportSection from "@/features/competitor/components/ImprovedCompetitorReportSection";

const ReviewCompare: React.FC = () => {
  const representativeStore = useStoreStore(
    (state) => state.representativeStore
  );
  const storeId = representativeStore?.store_id;

  const {
    comparisonListCache,
    comparisonDetailCache,
    selectedComparisonId,
    setSelectedComparisonId,
    getComparisonList,
    getComparisonDetail,
    requestAnalysis,
    loading,
    error,
    setError
  } = useCompetitorStore();

  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    name: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const openMapModal = () => setIsMapModalOpen(true);
  const closeMapModal = () => setIsMapModalOpen(false);

  const handleLocationSelect = (location: any) => {
    setSelectedLocation({
      name: location.name,
      address: location.address,
      lat: location.lat,
      lng: location.lng
    });
    closeMapModal();
  };

  useEffect(() => {
    if (storeId) {
      getComparisonList(storeId);
    }
  }, [storeId]);

  const handleAnalyzeCompetitor = async () => {
    if (!storeId) {
      setError("대표 매장이 설정되어 있지 않습니다.");
      return;
    }
    if (!selectedLocation) {
      setError("지도에서 경쟁사 매장을 선택해주세요.");
      return;
    }

    const resultId = await requestAnalysis(storeId, selectedLocation.name);
    if (resultId) {
      await getComparisonDetail(resultId);
      setSelectedComparisonId(resultId);
    }
  };

  const handleSelectComparison = async (comparisonId: string) => {
    if (!comparisonId) return;
    await getComparisonDetail(comparisonId);
    setSelectedComparisonId(comparisonId);
  };

  const selectedComparison = selectedComparisonId
    ? comparisonDetailCache[selectedComparisonId]
    : null;

  const comparisonResults = storeId ? comparisonListCache[storeId] || [] : [];

  const formatDateKorean = (dateString: string): string => {
    const date = new Date(dateString);
    const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Seoul"
    }).format(koreaTime);
  };

  if (!representativeStore) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 rounded-lg">
        <div className="text-center bg-yellow-50 border border-yellow-100 rounded-lg p-8 mb-6">
          <p className="text-yellow-800 text-lg mb-4">
            대표 매장이 설정되지 않았습니다
          </p>
          <p className="text-yellow-600">
            마이페이지에서 대표 매장을 설정한 후 이용해 주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-6 rounded-lg">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">
          {representativeStore.store_name}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold">
          <span className="text-xl text-blue-400">경쟁사</span>와 비교하여 우리
          가게의 장단점을 파악해보세요
        </h3>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {comparisonResults.length > 0 && (
            <div className="relative w-64">
              <select
                onChange={(e) => handleSelectComparison(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="">비교 분석 결과 선택</option>
                {comparisonResults.map((item) => (
                  <option key={item.comparison_id} value={item.comparison_id}>
                    {item.competitor_name} ({formatDateKorean(item.created_at)})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          )}

          <button
            onClick={openMapModal}
            className="btn bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs whitespace-nowrap"
          >
            경쟁사 검색하기
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading && (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6 animate-pulse">
          <p className="text-blue-800 text-lg mb-4">경쟁사 분석 중...</p>
          <p className="text-blue-600">
            리뷰 데이터를 수집하고 AI로 분석하는 중입니다.
            <br />
            잠시만 기다려주세요.
          </p>
        </div>
      )}

      {selectedLocation && !loading && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <h4 className="font-medium">선택한 경쟁사 매장</h4>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="font-bold text-lg mt-1">{selectedLocation.name}</p>
              <p className="text-sm text-gray-600">
                {selectedLocation.address}
              </p>
            </div>
            <button
              onClick={handleAnalyzeCompetitor}
              className="mt-4 md:mt-0 bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs whitespace-nowrap"
              disabled={loading}
            >
              {loading ? "분석 중..." : "비교 분석하기"}
            </button>
          </div>
        </div>
      )}

      {!selectedComparison &&
        !loading &&
        ((comparisonResults.length === 0 && !selectedLocation) || // 아무것도 없는 상태
          (comparisonResults.length > 0 && !selectedComparison)) && ( // 기록은 있는데 아직 안 골랐을 때
          <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6">
            <svg
              className="w-12 h-12 text-blue-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-bit-main text-lg mb-4">
              경쟁사 비교 분석을 통해 우리 매장의 장단점을 알아보세요!
            </p>

            {comparisonResults.length > 0 ? (
              <p className="text-comment mb-4">
                상단의 <strong>[비교 분석 결과 선택]</strong>에서 기존 분석
                기록을 확인하거나, <br />
                새로운 경쟁사를 <strong>검색</strong>해 분석을 시작해보세요.
              </p>
            ) : (
              <p className="text-comment mb-4">
                상단의 <strong>[경쟁사 검색하기]</strong> 버튼을 눌러
                <br />
                주변 경쟁 매장을 선택하고 비교 분석을 시작해보세요.
              </p>
            )}
            {/* <p className="text-sm text-bit-main">
              AI 분석을 통해 우리 매장의 강점과 개선점을 한눈에 파악할 수
              있어요.
            </p> */}
          </div>
        )}

      {selectedComparison && !loading && (
        <div>
          <ImprovedCompetitorReportSection data={selectedComparison} />
        </div>
      )}

      {isMapModalOpen && (
        <SearchableMapModal
          isOpen={isMapModalOpen}
          onClose={closeMapModal}
          onComplete={handleLocationSelect}
        />
      )}
    </div>
  );
};

export default ReviewCompare;
