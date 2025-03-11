import React, { useState } from "react";
import Map from "@/components/maps/Kakaomap";
import MapSidebar from "@/components/maps/MapSidebar";
import { Marker } from "@/types/map";

const MapPage: React.FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 서울 시청 기본값
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSearch = async (address: string) => {
    try {
      // 여기에 주소 검색 및 좌표 변환 로직 추가
      // 예: const coordinates = await getCoordinatesByAddress(address);
      // setCenter(coordinates);

      // 임시로 좌표 설정 (실제로는 API 호출 결과 사용)
      setCenter({ lat: 37.5032, lng: 127.0447 }); // 강남역 좌표로 예시

      // 검색 위치에 마커 추가
      setMarkers([
        {
          position: { lat: 37.5032, lng: 127.0447 },
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
        <Map
          width="100%"
          height="calc(100vh - 73px)"
          center={center}
          level={3}
          markers={markers}
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
