import React, { useEffect, useRef, useState } from "react";
import { KakaomapProps } from "@/features/map/types/map";
import {
  loadKakaoMapScript,
  displayGeoJsonPolygon,
  fetchPopulationData
} from "@/features/map/api/mapApi";

const Kakaomap: React.FC<KakaomapProps> = ({
  width,
  height,
  center = { lat: 37.501, lng: 127.039 }, // 서울 시청 기본값
  level = 3,
  markers = [],
  geoJsonData // GeoJSON 데이터 prop
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);
  const [populationData, setPopulationData] = useState<Map<string, number>>(
    new Map()
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("위치 정보 가져오기 실패:", error);
          // 위치 정보 거부 시 기본값 사용 (이미 center로 설정됨)
        }
      );
    } else {
      console.error("Geolocation이 이 브라우저에서 지원되지 않습니다.");
    }
  }, []);

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

  // 인구 데이터 가져오기
  useEffect(() => {
    const getPopulationData = async () => {
      try {
        const data = await fetchPopulationData();
        setPopulationData(data);
      } catch (err) {
        console.error("인구 데이터 로드 실패:", err);
      }
    };

    getPopulationData();
  }, []);

  // 맵 인스턴스 생성
  // 맵 인스턴스 생성
  useEffect(() => {
    if (!isLoading && !error && mapRef.current && window.kakao) {
      // 사용자 위치가 있으면 사용, 없으면 기본 center 사용
      const mapCenter = userLocation || center;

      const options = {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level,
        draggable: true // 드래그 가능하도록 명시적 설정
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);

      // 명시적으로 드래그와 줌 기능 활성화
      map.setDraggable(true);
      map.setZoomable(true);

      // 줌 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 확대/축소 이벤트 리스너 추가
      window.kakao.maps.event.addListener(map, "zoom_changed", function () {
        // 필요한 경우 줌 레벨 변경 시 처리할 로직
      });

      // 사용자 위치가 있으면 해당 위치에 마커 추가
      if (userLocation) {
        const userMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            userLocation.lat,
            userLocation.lng
          ),
          map: map
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content:
            '<div style="padding:5px;width:150px;text-align:center;">현재 위치</div>',
          zIndex: 1
        });

        window.kakao.maps.event.addListener(userMarker, "click", function () {
          infowindow.open(map, userMarker);
        });
      }

      setMapInstance(map);
    }
  }, [isLoading, error, center, level, userLocation]);

  // GeoJSON 데이터를 폴리곤으로 표시
  useEffect(() => {
    if (mapInstance && geoJsonData && populationData.size > 0) {
      // 인구 데이터를 기반으로 폴리곤 표시
      displayGeoJsonPolygon(mapInstance, geoJsonData, {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillOpacity: 0.5,
        populationData: populationData,
        fitBounds: true
      });
    } else if (mapInstance && geoJsonData) {
      // 인구 데이터가 없는 경우 기본 색상으로 표시
      displayGeoJsonPolygon(mapInstance, geoJsonData, {
        strokeColor: "#FF0000",
        fillColor: "#FF8888",
        fillOpacity: 0.3
      });
    }
  }, [mapInstance, geoJsonData, populationData]);

  // 마커 생성 (기존 코드 유지)
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
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    ></div>
  );
};

export default Kakaomap;
