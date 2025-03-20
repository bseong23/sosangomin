import React, { useEffect, useRef, useState } from "react";
import { KakaomapProps } from "@/features/map/types/map";
import {
  loadKakaoMapScript,
  displayGeoJsonPolygon,
  fetchPopulationData,
  getColorByPopulation
} from "@/features/map/api/mapApi";

const Kakaomap: React.FC<KakaomapProps> = ({
  width,
  height,
  center = { lat: 37.501, lng: 127.039 }, // 서울 시청 기본값
  level = 3,
  minLevel = 1,
  maxLevel = 14,
  markers = [],
  geoJsonData // GeoJSON 데이터 prop
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null); // 사용자 위치 마커 참조 추가
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
          // 위치 정보 거부 시 userLocation은 null로 유지되어 기본 center 값이 사용됨
        },
        {
          enableHighAccuracy: true, // 높은 정확도 사용
          timeout: 5000, // 5초 타임아웃
          maximumAge: 0 // 캐시된 위치 정보를 사용하지 않음
        }
      );
    } else {
      console.error("Geolocation이 이 브라우저에서 지원되지 않습니다.");
      // Geolocation을 지원하지 않는 브라우저에서는 기본 center 값이 사용됨
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

  // 사용자 위치 마커 제거 함수
  const removeUserMarker = () => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
      userMarkerRef.current = null;
    }
  };

  // 맵 인스턴스 생성
  useEffect(() => {
    if (!isLoading && !error && mapRef.current && window.kakao) {
      // 초기 레벨이 minLevel과 maxLevel 범위 내에 있는지 확인
      const initialLevel = Math.min(Math.max(level, minLevel), maxLevel);

      // 기본 중심 좌표 (사용자 위치가 있으면 사용자 위치, 없으면 props의 center 값 사용)
      const defaultCenter = userLocation
        ? new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
        : new window.kakao.maps.LatLng(center.lat, center.lng);

      // 기본 옵션으로 지도 생성
      const options = {
        center: defaultCenter,
        level: initialLevel,
        draggable: true
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);

      // 명시적으로 드래그와 줌 기능 활성화
      map.setDraggable(true);
      map.setZoomable(true);

      // 지도 레벨 변경 시 콘솔 출력
      window.kakao.maps.event.addListener(map, "zoom_changed", function () {});

      // 지도 중심 변경 시 콘솔 출력
      window.kakao.maps.event.addListener(
        map,
        "center_changed",
        function () {}
      );

      // 사용자 위치가 있으면 해당 위치로 중심 설정
      if (userLocation) {
        const userPosition = new window.kakao.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        );

        // 지도 중심을 사용자 위치로 설정하고 줌 레벨을 3으로 고정
        map.setCenter(userPosition);
        map.setLevel(3);

        // 현재 위치 마커 추가
        if (markers.length === 0) {
          const userMarker = new window.kakao.maps.Marker({
            position: userPosition,
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

          userMarkerRef.current = userMarker;
        }
      }

      setMapInstance(map);
    }
  }, [isLoading, error, level, minLevel, maxLevel, center, userLocation]);

  // GeoJSON 데이터를 폴리곤으로 표시
  useEffect(() => {
    if (mapInstance && geoJsonData && populationData.size > 0) {
      // 인구 데이터를 기반으로 폴리곤 표시
      displayGeoJsonPolygon(mapInstance, geoJsonData, {
        strokeColor: "#333333", // 경계선 색상을 더 어둡게 설정
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillOpacity: 0.2, // 투명도 조정 (더 선명하게)
        populationData: populationData,
        getColorByPopulation: getColorByPopulation, // 인구 기반 색상 함수 전달
        fitBounds: false
      });
    } else if (mapInstance && geoJsonData) {
      // 인구 데이터가 없는 경우 기본 색상으로 표시
      displayGeoJsonPolygon(mapInstance, geoJsonData, {
        strokeColor: "#FF0000",
        fillColor: "#FF8888",
        fillOpacity: 0.2
      });
    }
  }, [mapInstance, geoJsonData, populationData]);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (mapInstance && markers.length > 0) {
      // 기존 마커 제거
      removeAllMarkers();

      // 사용자 위치 마커 제거 (새 마커가 추가될 때)
      removeUserMarker();

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
      if (markers.length > 0) {
        mapInstance.setBounds(bounds);
        setTimeout(() => mapInstance.setLevel(3), 500); // 레벨 강제 설정
      }
    } else if (mapInstance && markers.length === 0 && userLocation) {
      // 마커가 없고 사용자 위치가 있으면 사용자 위치 마커 다시 표시
      if (!userMarkerRef.current) {
        const userMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(
            userLocation.lat,
            userLocation.lng
          ),
          map: mapInstance
        });

        const infowindow = new window.kakao.maps.InfoWindow({
          content:
            '<div style="padding:5px;width:150px;text-align:center;">현재 위치</div>',
          zIndex: 1
        });

        window.kakao.maps.event.addListener(userMarker, "click", function () {
          infowindow.open(mapInstance, userMarker);
        });

        userMarkerRef.current = userMarker;
      }
    }

    return () => {
      removeAllMarkers();
    };
  }, [mapInstance, markers, userLocation]);

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
    <div ref={mapRef} style={{ width, height }} className="shadow-md"></div>
  );
};

export default Kakaomap;
