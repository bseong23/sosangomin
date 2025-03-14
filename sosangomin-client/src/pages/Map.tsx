import React, { useState } from "react";
import Kakaomap from "@/features/map/components/maps/Kakaomap";
import MapSidebar from "@/features/map/components/maps/MapSidebar";
import { Marker } from "@/features/map/types/map";
import { searchLocation } from "@/features/map/api/mapApi";
import seoulDistrictsData from "@/assets/sig.json";

const MapPage: React.FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [center, setCenter] = useState({ lat: 37.501, lng: 127.039 }); // 서울 시청 기본값
  const [showSidebar, setShowSidebar] = useState(true);

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

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* 맵 컴포넌트 */}
      <div className="w-full">
        <Kakaomap
          width="100%"
          height="calc(100vh - 73px)"
          center={center}
          level={3}
          minLevel={1} // 최대 줌인 레벨 (숫자가 작을수록 더 확대됨)
          maxLevel={5} // 최대 줌아웃 레벨 (숫자가 클수록 더 축소됨)
          markers={markers}
          geoJsonData={seoulDistrictsData}
        />
      </div>

      {/* 사이드바 컴포넌트 */}
      {showSidebar && (
        <MapSidebar
          onClose={() => setShowSidebar(false)}
          onSearch={handleSearch}
        />
      )}
    </div>
  );
};

export default MapPage;
