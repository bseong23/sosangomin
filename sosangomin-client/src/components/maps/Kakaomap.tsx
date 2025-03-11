import React, { useEffect, useRef, useState } from "react";
import { MapProps, Marker } from "@/types/map";
import { loadKakaoMapScript } from "@/api/mapApi";

const Kakaomap: React.FC<MapProps & { markers?: Marker[] }> = ({
  width,
  height,
  center = { lat: 37.5665, lng: 126.978 }, // 서울 시청 기본값
  level = 3,
  markers = []
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        if (!apiKey) {
          throw new Error("Kakao Map API key is not defined");
        }

        await loadKakaoMapScript(apiKey);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load Kakao Map");
        setIsLoading(false);
        console.error(err);
      }
    };

    initializeMap();
  }, []);

  // 맵 인스턴스 생성
  useEffect(() => {
    if (!isLoading && !error && mapRef.current && window.kakao) {
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      setMapInstance(map);
    }
  }, [isLoading, error, center, level]);

  // 마커 생성
  useEffect(() => {
    if (mapInstance && markers.length > 0) {
      // 기존 마커 제거
      removeAllMarkers();

      const bounds = new window.kakao.maps.LatLngBounds();

      markers.forEach((markerData) => {
        const position = new window.kakao.maps.LatLng(
          markerData.position.lat,
          markerData.position.lng
        );

        // 경계 확장
        bounds.extend(position);

        const marker = new window.kakao.maps.Marker({
          position,
          map: mapInstance
        });

        // 마커 참조 저장
        markersRef.current.push(marker);

        if (markerData.content) {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: markerData.content,
            zIndex: 1
          });

          // 마커 클릭 시 인포윈도우 표시
          window.kakao.maps.event.addListener(marker, "click", () => {
            infowindow.open(mapInstance, marker);
            if (markerData.onClick) {
              markerData.onClick();
            }
          });

          // 마커에 마우스오버 시 인포윈도우 표시
          window.kakao.maps.event.addListener(marker, "mouseover", function () {
            infowindow.open(mapInstance, marker);
          });

          // 마커에서 마우스아웃 시 인포윈도우 제거
          window.kakao.maps.event.addListener(marker, "mouseout", function () {
            infowindow.close();
          });
        }
      });

      // 모든 마커가 보이도록 지도 범위 재설정
      if (markers.length > 1) {
        mapInstance.setBounds(bounds);
      }
    }

    return () => {
      removeAllMarkers();
    };
  }, [mapInstance, markers]);

  // 모든 마커 제거 함수
  const removeAllMarkers = () => {
    if (markersRef.current.length > 0) {
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    }
  };

  if (isLoading) {
    return <div>지도를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>지도를 불러오는데 실패했습니다: {error}</div>;
  }

  return (
    <div
      ref={mapRef}
      style={{ width, height }}
      className="rounded-lg shadow-md"
    ></div>
  );
};

export default Kakaomap;
