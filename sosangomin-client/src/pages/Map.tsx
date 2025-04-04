import React, { useState, useEffect } from "react";
import Kakaomap from "@/features/map/components/maps/Kakaomap";
import MapSidebar from "@/features/map/components/maps/MapSidebar";
import ColorLegend from "@/features/map/components/maps/ColorLegend";
import { Marker } from "@/features/map/types/map";
import { searchLocation } from "@/features/map/api/mapApi";
import seoulDistrictsData from "@/assets/sig.json";
// 주소에서 행정동을 추출하는 함수
const extractAdminDong = (address: string): string | null => {
  // 행정동 패턴: 숫자가 포함될 수 있는 ~동, ~가
  const match = address.match(/([가-힣]+\d*[동가])(?=[^가-힣\d동가]|$)/);
  return match ? match[1] : null;
};

const MapPage: React.FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [center, setCenter] = useState({ lat: 37.501, lng: 127.039 }); // 서울 시청 기본값
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedAdminName, setSelectedAdminName] = useState<string | null>(
    "역삼2동"
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recommendationData, setRecommendationData] = useState<any[]>([]);
  // 로컬스토리지에서 대표 가게 정보 가져오기
  useEffect(() => {
    try {
      const storeData = localStorage.getItem("store-storage");
      if (storeData) {
        const parsedData = JSON.parse(storeData);
        const representativeStore = parsedData.state.representativeStore;

        if (
          representativeStore &&
          representativeStore.latitude &&
          representativeStore.longitude
        ) {
          // 대표 가게 위치를 지도 중심으로 설정
          setCenter({
            lat: representativeStore.latitude,
            lng: representativeStore.longitude
          });

          // 대표 가게 위치에 마커 추가
          setMarkers([
            {
              position: {
                lat: representativeStore.latitude,
                lng: representativeStore.longitude
              },
              content: `<div style="padding:5px;width:150px;text-align:center;">${representativeStore.store_name}</div>`
            }
          ]);

          // 주소에서 행정동 추출
          const adminDong = extractAdminDong(representativeStore.address);
          if (adminDong) {
            setSelectedAdminName(adminDong);
          }

          // 카테고리 정보 저장
          if (representativeStore.category) {
            setSelectedCategory(representativeStore.category);
          }
        }
      }
    } catch (error) {
      console.error("로컬스토리지 데이터 파싱 실패:", error);
    }
  }, []);

  // 모바일 화면 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  // 사이드바 상태에 따라 범례 표시 여부 결정 (모바일에서만)
  useEffect(() => {
    if (isMobile) {
      setShowLegend(!showSidebar);
    } else {
      setShowLegend(true);
    }
  }, [showSidebar, isMobile]);

  const handleSearch = async (address: string) => {
    try {
      const coordinates = await searchLocation(address);
      setCenter(coordinates);

      setMarkers([
        {
          position: coordinates,
          content: `<div style="padding:5px;width:150px;text-align:center;">${address}</div>`
        }
      ]);
    } catch (error) {
      console.error("주소 검색 실패:", error);
      alert("주소를 찾을 수 없습니다. 다시 시도해주세요.");
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handlePolygonSelect = (adminName: string) => {
    setSelectedAdminName(adminName);
    if (isMobile && !showSidebar) {
      setShowSidebar(true);
    }
  };
  const handleMapRecommendation = (data: any[]) => {
    if (!data || !data.length) return;
    setRecommendationData(data); // ✅ 추천 데이터 상태 저장
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="w-full">
        <Kakaomap
          width="100%"
          height="calc(100vh - 73px)"
          center={center}
          level={6}
          markers={markers}
          geoJsonData={seoulDistrictsData}
          recommendedAreas={recommendationData} // ✅ 전달
          onPolygonSelect={handlePolygonSelect}
        />
      </div>

      {!showSidebar && (
        <button
          onClick={toggleSidebar}
          className="absolute top-6 left-6 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-100"
          aria-label="사이드바 열기"
        >
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}
      {showSidebar && (
        <MapSidebar
          onSearch={handleSearch}
          onClose={toggleSidebar}
          selectedAdminName={selectedAdminName}
          selectedCategory={selectedCategory}
          onMapRecommendation={handleMapRecommendation} // ✅ 꼭 있어야 함!
        />
      )}

      {showLegend && <ColorLegend position="bottom-right" />}
    </div>
  );
};

export default MapPage;
