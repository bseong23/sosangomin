import axiosInstance from "@/api/axios";
// 카카오맵 API 스크립트 로드
export const loadKakaoMapScript = (appKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = (e) => {
      reject(e);
    };
    document.head.appendChild(script);
  });
};
// 주소로 좌표 검색
export const getCoordinatesByAddress = (
  address: string
): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error("Kakao maps API not loaded"));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x)
        });
      } else {
        // 주소 검색 실패 시 키워드 검색으로 시도
        searchByKeyword(address).then(resolve).catch(reject);
      }
    });
  });
};

// 키워드로 장소 검색
export const searchByKeyword = (
  keyword: string
): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error("Kakao maps API not loaded"));
      return;
    }

    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(keyword, (result: any, status: any) => {
      if (
        status === window.kakao.maps.services.Status.OK &&
        result.length > 0
      ) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x)
        });
      } else {
        reject(new Error(`No results found for keyword: ${keyword}`));
      }
    });
  });
};

// 통합 검색 함수 - 주소 또는 키워드로 검색
export const searchLocation = (
  query: string
): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    // 먼저 주소 검색 시도
    getCoordinatesByAddress(query)
      .then(resolve)
      .catch(() => {
        // 주소 검색 실패 시 키워드 검색 시도
        searchByKeyword(query)
          .then(resolve)
          .catch(() => {
            reject(new Error(`Location not found: ${query}`));
          });
      });
  });
};

// mapApi.ts 파일에 추가

// 유동인구 데이터를 기반으로 색상 결정 함수
export const getColorByPopulation = (population: number): string => {
  if (population > 150000) return "#800000"; // 빨강 (매우 많음)
  if (population > 70000) return "#FF8C00"; // 주황
  if (population > 40000) return "#FFD700"; // 노랑
  if (population > 10000) return "#32CD32"; // 초록
  return "#0000FF"; // 파랑 (낮음)
};

// 유동인구 데이터를 가져오는 함수
export const fetchPopulationData = async (): Promise<Map<string, number>> => {
  try {
    // ➡️ API 호출
    const response = await axiosInstance.get("/api/proxy/location/heatmap");

    // 데이터를 Map으로 변환 ("행정동명"을 키로 설정)
    const populationMap = new Map<string, number>();
    response.data.forEach((item: any) => {
      populationMap.set(item.행정동명, item.유동인구);
    });

    return populationMap;
  } catch (error) {
    console.error("유동인구 데이터 가져오기 실패:", error);
    return new Map();
  }
};

// GeoJSON 데이터를 지도에 표시하는 함수
export const displayGeoJsonPolygon = (
  map: any,
  geoJsonData: any,
  options: {
    populationData?: Map<string, number>; // 유동인구 데이터
    getColorByPopulation?: (population: number) => string; // 색상 결정 함수
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    fitBounds?: boolean;
    onPolygonClick?: (
      adminName: string,
      center: { lat: number; lng: number }
    ) => void;
  }
) => {
  if (!map || !geoJsonData) return;

  // 기본 스타일
  const defaultStyle = {
    strokeColor: options.strokeColor || "#FF0000",
    strokeOpacity: options.strokeOpacity || 0.8,
    strokeWeight: options.strokeWeight || 2,
    fillColor: options.fillColor || "#FF8888",
    fillOpacity: options.fillOpacity || 0.3
  };

  const bounds = new window.kakao.maps.LatLngBounds();
  const customOverlay = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(0, 0),
    content: "",
    xAnchor: 0.5,
    yAnchor: 1.5,
    zIndex: 3
  });

  // GeoJSON 데이터 처리
  geoJsonData.features.forEach((feature: any) => {
    const coordinates = feature.geometry.coordinates;
    const properties = feature.properties;

    // 행정동 이름 추출
    const adminName = properties.adm_nm || "";
    const simpleName = adminName.split(" ").pop() || adminName;

    // 유동인구 데이터 찾기
    const population = options.populationData?.get(simpleName) || 0;

    // 인구 데이터 기반 색상 결정
    let fillColor = defaultStyle.fillColor;
    if (options.populationData && options.getColorByPopulation) {
      fillColor = options.getColorByPopulation(population);
    }

    let paths: any[] = [];
    let polygonCenter = { lat: 0, lng: 0 };
    let pointCount = 0;

    if (feature.geometry.type === "MultiPolygon") {
      coordinates.forEach((polygon: any) => {
        polygon.forEach((ring: any) => {
          const path = ring.map(
            (coord: number[]) =>
              new window.kakao.maps.LatLng(coord[1], coord[0])
          );
          paths.push(path);

          path.forEach((latLng: any) => {
            bounds.extend(latLng);
            polygonCenter.lat += latLng.getLat();
            polygonCenter.lng += latLng.getLng();
            pointCount++;
          });
        });
      });
    } else if (feature.geometry.type === "Polygon") {
      coordinates.forEach((ring: any) => {
        const path = ring.map(
          (coord: number[]) => new window.kakao.maps.LatLng(coord[1], coord[0])
        );
        paths.push(path);

        path.forEach((latLng: any) => {
          bounds.extend(latLng);
          polygonCenter.lat += latLng.getLat();
          polygonCenter.lng += latLng.getLng();
          pointCount++;
        });
      });
    }

    if (pointCount > 0) {
      polygonCenter.lat /= pointCount;
      polygonCenter.lng /= pointCount;
    }

    const polygon = new window.kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeColor: defaultStyle.strokeColor,
      strokeOpacity: defaultStyle.strokeOpacity,
      strokeWeight: defaultStyle.strokeWeight,
      fillColor: fillColor,
      fillOpacity: defaultStyle.fillOpacity
    });

    const tooltipStyle =
      "background: white; padding: 5px 10px; border-radius: 4px; " +
      "border: 1px solid #ccc; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); " +
      "position: relative; white-space: nowrap;";

    window.kakao.maps.event.addListener(
      polygon,
      "mouseover",
      function (mouseEvent: any) {
        polygon.setOptions({
          fillOpacity: defaultStyle.fillOpacity + 0.2
        });

        customOverlay.setContent(
          `<div style="${tooltipStyle}">${simpleName} (유동인구: ${population.toLocaleString()}명)</div>`
        );
        customOverlay.setPosition(mouseEvent.latLng);
        customOverlay.setMap(map);
      }
    );

    window.kakao.maps.event.addListener(
      polygon,
      "mousemove",
      function (mouseEvent: any) {
        customOverlay.setPosition(mouseEvent.latLng);
      }
    );

    window.kakao.maps.event.addListener(polygon, "mouseout", function () {
      polygon.setOptions({
        fillOpacity: defaultStyle.fillOpacity
      });
      customOverlay.setMap(null);
    });

    window.kakao.maps.event.addListener(polygon, "click", function () {
      if (options.onPolygonClick) {
        options.onPolygonClick(simpleName, polygonCenter);
      }

      polygon.setOptions({
        fillOpacity: defaultStyle.fillOpacity + 0.3,
        strokeWeight: defaultStyle.strokeWeight + 1
      });

      setTimeout(() => {
        polygon.setOptions({
          fillOpacity: defaultStyle.fillOpacity,
          strokeWeight: defaultStyle.strokeWeight
        });
      }, 1500);
    });
  });

  if (options.fitBounds) {
    map.setBounds(bounds);
  }
};
