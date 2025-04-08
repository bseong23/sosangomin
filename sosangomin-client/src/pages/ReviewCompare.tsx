import React, { useState, useEffect } from "react";
import useStoreStore from "@/store/storeStore";
import { getCompetitorComparisons } from "@/features/competitor/api/competitorApi";
import { ComparisonData } from "@/features/competitor/types/competitor";
import SearchableMapModal from "@/features/competitor/components/SearchableMapModel";
import ImprovedCompetitorReportSection from "@/features/competitor/components/ImprovedCompetitorReportSection";
import { useCompetitorStore } from "@/store/useCompetitorStore";

// ✅ 타입 정의 유지
interface CompetitorComparisonSummaryWithData {
  comparison_id: string;
  competitor_name: string;
  competitor_place_id: string;
  created_at: string;
  summary: string;
  comparison_data: ComparisonData;
}

const ReviewCompare: React.FC = () => {
  const representativeStore = useStoreStore(
    (state) => state.representativeStore
  );
  const storeId = representativeStore?.store_id;
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setIsFetchingList] = useState(false);

  const [loading, setLoading] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<
    CompetitorComparisonSummaryWithData[]
  >([]);

  const comparisonDetailCache = useCompetitorStore(
    (state) => state.comparisonDetailCache
  );
  const setSelectedComparisonId = useCompetitorStore(
    (state) => state.setSelectedComparisonId
  );

  const selectedComparison = useCompetitorStore((state) =>
    state.selectedComparisonId
      ? state.comparisonDetailCache[state.selectedComparisonId]?.comparison_data
      : null
  );

  const selectedComparisonFull = useCompetitorStore((state) =>
    state.selectedComparisonId
      ? state.comparisonDetailCache[state.selectedComparisonId]
      : null
  );

  const [error, setError] = useState("");
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

    // setSelectedComparisonId(null);
    closeMapModal();
  };

  // ✅ 초기 분석 결과 가져오기 - 데이터 검증 강화
  const handleFetchPreviousComparisons = async () => {
    if (!storeId) {
      setError("대표 매장이 없습니다.");
      return;
    }
    try {
      setIsFetchingList(true);
      const response = await getCompetitorComparisons(storeId);

      if (
        response.status === "success" &&
        Array.isArray(response.comparisons)
      ) {
        // 유효한 데이터만 필터링
        const validComparisons = response.comparisons.filter(
          (c: any) => c && typeof c === "object" && c.comparison_id
        );

        // 데이터 매핑 시 필드 존재 여부 확인
        const comparisonsWithData: CompetitorComparisonSummaryWithData[] =
          validComparisons.map((c: any) => ({
            comparison_id:
              c.comparison_id ||
              `unknown-${Math.random().toString(36).substring(7)}`,
            competitor_name: c.competitor_name || "이름 없는 경쟁사",
            competitor_place_id: c.competitor_place_id || "",
            created_at: c.created_at || new Date().toISOString(),
            summary: c.comparison_insight
              ? `${c.comparison_insight.substring(0, 100)}...`
              : "요약 정보 없음",

            comparison_data: c.comparison_data || {}
          }));

        setComparisonResults(comparisonsWithData);
      } else {
        console.warn("API 응답에 comparisons 배열이 없습니다:", response);
        setComparisonResults([]);
      }
    } catch (err) {
      console.error("경쟁사 비교 목록 조회 실패:", err);
      setError("경쟁사 분석 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      handleFetchPreviousComparisons().then(() => {
        useCompetitorStore.getState().setSelectedComparisonId(null);
      });
    }
  }, [storeId]);

  const handleAnalyzeCompetitor = async () => {
    if (!storeId || !selectedLocation) return;

    try {
      setIsAnalyzing(true);
      setError("");

      const comparisonId = await useCompetitorStore
        .getState()
        .requestAnalysis(storeId, selectedLocation.name);

      if (comparisonId) {
        // ✅ 1. 캐시에서 최신 분석 결과 가져오기
        const result =
          useCompetitorStore.getState().comparisonDetailCache[comparisonId];

        // ✅ 2. 드롭다운 리스트에도 추가
        if (result) {
          const newItem = {
            comparison_id: comparisonId,
            competitor_name: result.competitor_name || selectedLocation.name,
            competitor_place_id: result.competitor_place_id || "",
            created_at: result.created_at || new Date().toISOString(),
            summary: result.comparison_insight
              ? `${result.comparison_insight.substring(0, 100)}...`
              : "요약 정보 없음",
            comparison_data: result.comparison_data
          };

          // ✅ 3. 기존 리스트에 추가
          setComparisonResults((prev) => [newItem, ...prev]);
        }

        setSelectedComparisonId(comparisonId);
        setSelectedLocation(null);

        setTimeout(() => {
          const el = document.getElementById("comparison-result");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500);
      } else {
        setError("분석 실패!");
      }
    } catch (err) {
      console.error("분석 중 오류:", err);
      setError("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectComparison = async (comparisonId: string) => {
    if (!comparisonId) return;

    const cached = comparisonDetailCache[comparisonId];
    const getComparisonDetail =
      useCompetitorStore.getState().getComparisonDetail;

    if (!cached) {
      await getComparisonDetail(comparisonId); // 캐시에 없으면 불러오기
    }

    setSelectedComparisonId(comparisonId); // 그 후 상태 설정
  };

  // 날짜 포맷팅 함수 - 한국 시간(UTC+9)으로 변환하여 표시
  const formatDateKorean = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Seoul" // 이게 자동으로 9시간 더해줘!
    }).format(date);
  };

  // If no representative store is set, display guidance
  if (!representativeStore) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 md:p-6 rounded-lg">
        <div className="text-center bg-yellow-50 border border-yellow-100 rounded-lg p-8 mb-6">
          <svg
            className="w-12 h-12 text-yellow-400 mx-auto mb-4"
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
      {/* 매장 정보 영역 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {representativeStore?.store_name || "내 매장"}
        </h2>
        {/* 경쟁사 검색 버튼 */}
        <button
          onClick={openMapModal}
          className="btn bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs whitespace-nowrap"
        >
          경쟁사 검색하기
        </button>
      </div>

      {/* 상단 헤더 및 버튼 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold">
          <span className="text-xl text-blue-400">경쟁사</span>와 비교하여 우리
          가게의 장단점을 파악해보세요
        </h3>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* 분석 결과 선택 드롭다운 */}
          {comparisonResults.length > 0 && (
            <div className="relative w-64">
              <select
                onChange={(e) => handleSelectComparison(e.target.value)}
                className="appearance-none w-full bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="">비교 분석 결과 선택</option>
                {comparisonResults.map((item) => (
                  <option key={item.comparison_id} value={item.comparison_id}>
                    {item.competitor_name || "이름 없음"} (
                    {formatDateKorean(item.created_at || "")})
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
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 text-red-700">
          <p>{error}</p>
        </div>
      )}
      {/* 로딩 중 표시 */}
      {isAnalyzing && (
        <div className="text-center bg-blue-50 border border-blue-100 rounded-lg p-8 mb-6 animate-pulse">
          <svg
            className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          <p className="text-blue-800 text-lg mb-4">
            {selectedLocation
              ? `'${selectedLocation.name}' 분석 중...`
              : "경쟁사 분석 중..."}
          </p>
          <p className="text-blue-600">
            리뷰 데이터를 수집하고 AI로 분석하는 중입니다.
            <br />
            정확한 분석을 위해 약 1분 ~ 2분 정도 소요될 수 있습니다.
            <br />
            잠시만 기다려주세요.
          </p>
        </div>
      )}

      {/* 선택된 경쟁사 정보 표시 영역 */}
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

      {!selectedComparison && !loading && !selectedLocation && (
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
            />
          </svg>
          <p className="text-blue-600 mb-4  text-lg">
            <span className="font-semibold">[경쟁사 검색하기]</span> 버튼을 눌러
            <br />
            주변 매장을 선택하고 비교 분석을 시작해보세요.
          </p>
          <p className="text-base text-blue-500">
            또는 우측 드롭다운에서 이전에 분석했던 기록을 확인해 보세요.
          </p>
        </div>
      )}

      {selectedComparisonFull &&
        !loading &&
        !selectedLocation &&
        useCompetitorStore.getState().selectedComparisonId !== null && (
          <ImprovedCompetitorReportSection data={selectedComparisonFull} />
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
