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

// GeoJSON 데이터를 카카오맵 폴리곤으로 변환하여 표시
export const displayGeoJsonPolygon = (
  map: any,
  geoJsonData: any,
  options = {}
) => {
  if (!window.kakao || !window.kakao.maps) {
    console.error("Kakao maps API not loaded");
    return;
  }

  // 기본 스타일 옵션
  const defaultOptions = {
    strokeColor: "#004c80",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0088ff",
    fillOpacity: 0.7
  };

  const polygonOptions = { ...defaultOptions, ...options };

  // GeometryCollection 형식 처리
  if (geoJsonData.type === "GeometryCollection" && geoJsonData.geometries) {
    geoJsonData.geometries.forEach((geometry: any) => {
      processGeometry(map, geometry, polygonOptions);
    });
  }
  // FeatureCollection 형식 처리
  else if (geoJsonData.type === "FeatureCollection" && geoJsonData.features) {
    geoJsonData.features.forEach((feature: any) => {
      if (feature.geometry) {
        processGeometry(
          map,
          feature.geometry,
          polygonOptions,
          feature.properties
        );
      }
    });
  }
  // 단일 Geometry 형식 처리
  else if (
    geoJsonData.type === "Polygon" ||
    geoJsonData.type === "MultiPolygon"
  ) {
    processGeometry(map, geoJsonData, polygonOptions);
  } else {
    console.error("유효하지 않은 GeoJSON 데이터 형식입니다");
  }
};

// 지오메트리 처리 함수
const processGeometry = (
  map: any,
  geometry: any,
  options: any,
  properties?: any
) => {
  if (geometry.type === "Polygon") {
    // 폴리곤 좌표 추출
    const coordinates = geometry.coordinates[0];
    if (!coordinates || !Array.isArray(coordinates)) {
      console.error("유효하지 않은 좌표 데이터");
      return;
    }

    // 카카오맵 LatLng 객체 배열로 변환
    const path = coordinates.map(
      (coord: number[]) => new window.kakao.maps.LatLng(coord[1], coord[0])
    );

    // 폴리곤 생성
    const polygon = new window.kakao.maps.Polygon({
      path: path,
      strokeColor: options.strokeColor,
      strokeOpacity: options.strokeOpacity,
      strokeWeight: options.strokeWeight,
      fillColor: options.fillColor,
      fillOpacity: options.fillOpacity
    });

    // 지도에 폴리곤 표시
    polygon.setMap(map);

    // 선택적: 폴리곤 클릭 이벤트 추가
    if (properties && properties.name) {
      window.kakao.maps.event.addListener(polygon, "click", function () {
        alert(properties.name);
      });
    }
  } else if (geometry.type === "MultiPolygon") {
    // 멀티폴리곤 처리
    geometry.coordinates.forEach((polygonCoords: any) => {
      const modifiedGeometry = {
        type: "Polygon",
        coordinates: polygonCoords
      };
      processGeometry(map, modifiedGeometry, options, properties);
    });
  }
};

// 서울 지역으로 지도 범위 설정하기
export const setSeoulBounds = (map: any) => {
  if (!window.kakao || !window.kakao.maps) {
    console.error("Kakao maps API not loaded");
    return;
  }

  // 서울의 북동쪽과 남서쪽 좌표 (서울 경계)
  const northEast = new window.kakao.maps.LatLng(37.701, 127.1824); // 서울 북동쪽
  const southWest = new window.kakao.maps.LatLng(37.4273, 126.764); // 서울 남서쪽

  // 좌표로 영역 객체 생성
  const bounds = new window.kakao.maps.LatLngBounds(southWest, northEast);

  // 지도 범위 재설정
  map.setBounds(bounds);
};
