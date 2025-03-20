import React, { useState } from "react";
import Kakaomap from "@/features/map/components/maps/Kakaomap";
import MapSidebar from "@/features/map/components/maps/MapSidebar";
import ColorLegend from "@/features/map/components/maps/ColorLegend"; // 새로 추가한 컴포넌트 import
import { Marker } from "@/features/map/types/map";
import { searchLocation } from "@/features/map/api/mapApi";
import seoulDistrictsData from "@/assets/sig.json";

const MapPage: React.FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [center, setCenter] = useState({ lat: 37.501, lng: 127.039 }); // 서울 시청 기본값
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLegend, setShowLegend] = useState(true); // 범례 표시 여부 상태 추가

  const handleSearch = async (address: string) => {
    try {
      // 주소를 좌표로 변환
      const coordinates = await searchLocation(address);
      setCenter(coordinates);

      // 검색 위치에 마커 추가
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

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* 맵 컴포넌트 */}
      <div className="w-full">
        <Kakaomap
          width="100%"
          height="calc(100vh - 73px)"
          center={center}
          level={3}
          minLevel={1}
          maxLevel={6}
          markers={markers}
          geoJsonData={seoulDistrictsData}
        />
      </div>

      {/* 사이드바 토글 버튼 */}
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

      {/* 사이드바 컴포넌트 */}
      {showSidebar && (
        <MapSidebar onClose={toggleSidebar} onSearch={handleSearch} />
      )}

      {/* 색상 범례 컴포넌트 */}
      {showLegend && <ColorLegend position="bottom-right" />}

      {/* 범례 토글 버튼 */}
      <button
        onClick={toggleLegend}
        className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-lg z-10 hover:bg-gray-100"
        aria-label={showLegend ? "범례 숨기기" : "범례 보기"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>
    </div>
  );
};

export default MapPage;
