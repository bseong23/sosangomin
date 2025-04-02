import React, { useState, useEffect } from "react";
import useStoreStore from "@/store/storeStore";
import {
  requestCompetitorAnalysis,
  getCompetitorComparisons
} from "@/features/competitor/api/competitorApi";
import { ComparisonData } from "@/features/competitor/types/competitor";
import CompetitorReportSection from "@/features/competitor/components/CompetitorReportSection";
import { getCompetitorComparisonResult } from "@/features/competitor/api/competitorApi";
import SearchableMapModal from "@/features/competitor/components/SearchableMapModel";

// ✅ 새 타입 정의
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

  const [loading, setLoading] = useState(false);
  const [comparisonResults, setComparisonResults] = useState<
    CompetitorComparisonSummaryWithData[]
  >([]);
  const [selectedComparison, setSelectedComparison] =
    useState<ComparisonData | null>(null);
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
    closeMapModal();
  };

  // ✅ 초기 분석 결과 가져오기
  const handleFetchPreviousComparisons = async () => {
    if (!storeId) {
      setError("대표 매장이 없습니다.");
      return;
    }
    try {
      setLoading(true);
      const response = await getCompetitorComparisons(storeId);
      if (response.status === "success" && response.comparisons) {
        // 서버에서 comparison_data 포함으로 가정
        const comparisonsWithData: CompetitorComparisonSummaryWithData[] =
          response.comparisons.map((c: any) => ({
            ...c,
            summary:
              c.comparison_data?.comparison_insight?.substring(0, 100) +
                "..." || "",
            comparison_data: c.comparison_data
          }));
        setComparisonResults(comparisonsWithData);
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
      handleFetchPreviousComparisons();
    }
  }, [storeId]);

  // ✅ 분석 요청 (신규 분석만)
  const handleAnalyzeCompetitor = async () => {
    if (!storeId) {
      setError(
        "대표 매장이 설정되어 있지 않습니다. 마이페이지에서 설정해주세요."
      );
      return;
    }
    if (!selectedLocation) {
      setError("먼저 지도에서 경쟁사 매장을 선택해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const requestData = {
        store_id: storeId,
        competitor_name: selectedLocation.name
      };

      const response = await requestCompetitorAnalysis(requestData);

      if (response.status === "success" && response.comparisonResult) {
        const newSummary: CompetitorComparisonSummaryWithData = {
          comparison_id:
            response.comparisonResult._id ||
            response.comparisonResult.comparison_id,
          competitor_name: response.comparisonResult.competitor_name,
          competitor_place_id:
            response.comparisonResult.competitor_place_id || "",
          created_at: response.comparisonResult.created_at,
          summary:
            response.comparisonResult.comparison_data.comparison_insight?.substring(
              0,
              100
            ) + "..." || "",
          comparison_data: response.comparisonResult.comparison_data
        };

        setComparisonResults((prev) => [newSummary, ...prev]);
        setSelectedComparison(response.comparisonResult.comparison_data);
      } else {
        setError(response.message || "경쟁사 분석 요청이 실패했습니다.");
      }
    } catch (err: any) {
      console.error("경쟁사 분석 요청 실패:", err);
      setError(
        err?.response?.data?.message || "경쟁사 분석 중 알 수 없는 오류 발생"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComparison = async (comparisonId: string) => {
    if (!comparisonId) return;
    try {
      setLoading(true);
      setError("");
      const res = await getCompetitorComparisonResult(comparisonId);

      if (res.status === "success" && res.comparison_result) {
        setSelectedComparison({
          ...res.comparison_result.comparison_data,
          comparison_insight: res.comparison_result.comparison_insight
        });
        setError("");
      }
    } catch (e) {
      setError("비교 결과 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  const formatDateKorean = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}월 ${String(date.getDate()).padStart(2, "0")}일`;
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold">{representativeStore.store_name}</h2>
      </div>

      {/* 상단 헤더 및 버튼 영역 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold">
          <span className="text-xl text-blue-400">경쟁사 리뷰</span>와 비교하여
          우리 가게의 장단점을 파악해보세요
        </h3>
        <div className="flex flex-col md:flex-row gap-3 items-center">
          {/* 분석 결과 선택 드롭다운 */}
          {comparisonResults.length > 0 && (
            <div className="relative">
              <select
                onChange={(e) => handleSelectComparison(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">비교 분석 결과 선택</option>
                {comparisonResults.map((item) => (
                  <option key={item.comparison_id} value={item.comparison_id}>
                    {item.competitor_name} ({formatDateKorean(item.created_at)})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
          )}

          {/* 경쟁사 검색 버튼 */}
          <button
            onClick={openMapModal}
            className="btn bg-bit-main text-white p-3 rounded-lg hover:bg-blue-900 cursor-pointer text-xs whitespace-nowrap"
          >
            경쟁사 검색하기
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            개발자 콘솔을 확인하여 자세한 오류 정보를 확인하세요.
          </p>
        </div>
      )}

      {/* 로딩 중 표시 */}
      {loading && (
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
          <p className="text-blue-800 text-lg mb-4">경쟁사 분석 중...</p>
          <p className="text-blue-600">
            리뷰 데이터를 수집하고 AI로 분석하는 중입니다.
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

      {/* 분석 결과가 없는 경우 가이드 메시지 */}
      {!selectedComparison &&
        !loading &&
        !selectedLocation &&
        comparisonResults.length === 0 && (
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
            <p className="text-blue-800 text-lg mb-4">
              아직 경쟁사 분석 결과가 없습니다
            </p>
            <p className="text-blue-600 mb-4">
              상단의 [경쟁사 검색하기] 버튼을 눌러
              <br />
              주변 경쟁 매장을 선택하고 비교 분석을 시작해보세요
            </p>
            <p className="text-sm text-blue-500">
              경쟁사 분석을 통해 우리 매장의 강점과 개선점을 더 명확히 파악할 수
              있습니다
            </p>
          </div>
        )}

      {/* 비교 분석 결과 표시 영역 */}
      {selectedComparison && !loading && (
        <div className="bg-basic-white p-6 rounded-md shadow mb-6">
          <h2 className="text-lg font-bold text-comment mb-4">
            경쟁사 비교 분석 결과
          </h2>
          <CompetitorReportSection data={selectedComparison} />
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
