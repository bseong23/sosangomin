import React, { useEffect, useRef, useState } from "react";
import { MapProps, Marker } from "@/types/map";
import { loadKakaoMapScript } from "@/api/mapApi";

const Map: React.FC<MapProps & { markers?: Marker[] }> = ({
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
      mapInstance.removeOverlayMapTypeId(window.kakao.maps.MapTypeId.OVERLAY);

      markers.forEach((markerData) => {
        const position = new window.kakao.maps.LatLng(
          markerData.position.lat,
          markerData.position.lng
        );

        const marker = new window.kakao.maps.Marker({
          position,
          map: mapInstance
        });

        if (markerData.content) {
          const infowindow = new window.kakao.maps.InfoWindow({
            content: markerData.content
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            infowindow.open(mapInstance, marker);
            if (markerData.onClick) {
              markerData.onClick();
            }
          });
        }
      });
    }
  }, [mapInstance, markers]);

  if (isLoading) {
    return <div>지도를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div>지도를 불러오는데 실패했습니다: {error}</div>;
  }

  return <div ref={mapRef} style={{ width, height }} className=""></div>;
};

export default Map;
