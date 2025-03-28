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
import workingPopData from "@/assets/residentpop.json";

export const fetchPopulationData = async (): Promise<Map<string, number>> => {
  try {
    // Map 객체 생성하여 행정동 이름과 인구수 매핑
    const populationMap = new Map<string, number>();

    workingPopData.forEach(
      (item: { adstrd_cd_nm: string; tot_repop: number }) => {
        populationMap.set(item.adstrd_cd_nm, item.tot_repop);
      }
    );
    return populationMap;
  } catch (error) {
    console.error("인구 데이터를 가져오는 중 오류 발생:", error);
    return new Map<string, number>();
  }
};

// 인구 수에 따른 색상 결정 함수
export const getColorByPopulation = (population: number): string => {
  // 인구 단계별 색상 설정
  if (population > 30000) return "#FF0000"; // 빨강 - 인구 많음
  if (population > 20000) return "#FF8C00"; // 주황
  if (population > 10000) return "#FFFF00"; // 노랑
  if (population > 5000) return "#00FF00"; // 초록
  return "#0000FF"; // 파랑 - 인구 적음
};

// GeoJSON 데이터를 카카오맵 폴리곤으로 변환하여 표시 (수정된 버전)
export const displayGeoJsonPolygon = (
  map: any,
  geoJsonData: any,
  options: {
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    populationData?: Map<string, number>;
    getColorByPopulation?: (population: number) => string;
    fitBounds?: boolean;
    onPolygonClick?: (
      adminName: string,
      center: { lat: number; lng: number }
    ) => void; // 클릭 이벤트 핸들러 추가
  }
) => {
  if (!map || !geoJsonData) return;

  // 기본 스타일 설정
  const defaultStyle = {
    strokeColor: options.strokeColor || "#FF0000",
    strokeOpacity: options.strokeOpacity || 0.8,
    strokeWeight: options.strokeWeight || 2,
    fillColor: options.fillColor || "#FF8888",
    fillOpacity: options.fillOpacity || 0.3
  };

  // 경계 계산을 위한 객체
  const bounds = new window.kakao.maps.LatLngBounds();

  // 커스텀 오버레이 생성 (툴팁용)
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

    // 행정동 이름 추출 (예: "서울특별시 종로구 사직동" -> "사직동")
    const adminName = properties.adm_nm || "";
    const simpleName = adminName.split(" ").pop() || adminName;

    // 인구 데이터 찾기
    const population = options.populationData?.get(simpleName) || 0;

    // 인구 데이터 기반 색상 결정
    let fillColor = defaultStyle.fillColor;
    if (options.populationData && options.getColorByPopulation) {
      fillColor = options.getColorByPopulation(population);
    }

    // 다각형 경로 생성
    let paths: any[] = [];
    let polygonCenter = { lat: 0, lng: 0 };
    let pointCount = 0;

    if (feature.geometry.type === "MultiPolygon") {
      // 다중 다각형 처리
      coordinates.forEach((polygon: any) => {
        polygon.forEach((ring: any) => {
          const path = ring.map(
            (coord: number[]) =>
              new window.kakao.maps.LatLng(coord[1], coord[0])
          );
          paths.push(path);

          // 경계 확장 및 중심점 계산을 위한 좌표 합산
          path.forEach((latLng: any) => {
            bounds.extend(latLng);
            polygonCenter.lat += latLng.getLat();
            polygonCenter.lng += latLng.getLng();
            pointCount++;
          });
        });
      });
    } else if (feature.geometry.type === "Polygon") {
      // 단일 다각형 처리
      coordinates.forEach((ring: any) => {
        const path = ring.map(
          (coord: number[]) => new window.kakao.maps.LatLng(coord[1], coord[0])
        );
        paths.push(path);

        // 경계 확장 및 중심점 계산을 위한 좌표 합산
        path.forEach((latLng: any) => {
          bounds.extend(latLng);
          polygonCenter.lat += latLng.getLat();
          polygonCenter.lng += latLng.getLng();
          pointCount++;
        });
      });
    }

    // 중심점 계산
    if (pointCount > 0) {
      polygonCenter.lat /= pointCount;
      polygonCenter.lng /= pointCount;
    }

    // 다각형 생성 및 지도에 추가
    const polygon = new window.kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeColor: defaultStyle.strokeColor,
      strokeOpacity: defaultStyle.strokeOpacity,
      strokeWeight: defaultStyle.strokeWeight,
      fillColor: fillColor,
      fillOpacity: defaultStyle.fillOpacity
    });

    // 툴팁 스타일 정의
    const tooltipStyle =
      "background: white; padding: 5px 10px; border-radius: 4px; " +
      "border: 1px solid #ccc; font-size: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); " +
      "position: relative; white-space: nowrap;";

    // 마우스 오버 시 툴팁 표시
    window.kakao.maps.event.addListener(
      polygon,
      "mouseover",
      function (mouseEvent: any) {
        // 폴리곤 스타일 변경
        polygon.setOptions({
          fillOpacity: defaultStyle.fillOpacity + 0.2
        });

        // 툴팁 내용 설정
        customOverlay.setContent(
          `<div style="${tooltipStyle}">${simpleName} (인구: ${population.toLocaleString()}명)</div>`
        );

        // 툴팁 위치 설정
        customOverlay.setPosition(mouseEvent.latLng);

        // 툴팁 표시
        customOverlay.setMap(map);
      }
    );

    // 마우스 이동 시 툴팁 위치 업데이트
    window.kakao.maps.event.addListener(
      polygon,
      "mousemove",
      function (mouseEvent: any) {
        customOverlay.setPosition(mouseEvent.latLng);
      }
    );

    // 마우스 아웃 시 툴팁 제거
    window.kakao.maps.event.addListener(polygon, "mouseout", function () {
      // 폴리곤 스타일 복원
      polygon.setOptions({
        fillOpacity: defaultStyle.fillOpacity
      });

      // 툴팁 제거
      customOverlay.setMap(null);
    });

    // 폴리곤 클릭 이벤트 추가
    window.kakao.maps.event.addListener(polygon, "click", function () {
      // 폴리곤 클릭 시 콜백 함수 호출
      if (options.onPolygonClick) {
        options.onPolygonClick(simpleName, polygonCenter);
      }

      // 클릭한 폴리곤 강조 표시
      polygon.setOptions({
        fillOpacity: defaultStyle.fillOpacity + 0.3,
        strokeWeight: defaultStyle.strokeWeight + 1
      });

      // 일정 시간 후 스타일 복원
      setTimeout(() => {
        polygon.setOptions({
          fillOpacity: defaultStyle.fillOpacity,
          strokeWeight: defaultStyle.strokeWeight
        });
      }, 1500);
    });
  });
};

// 인구 데이터 가져오기
// export const fetchPopulationData = async (): Promise<Map<string, number>> => {
//   try {
//     // 여기에 실제 API 호출 코드 작성
//     // 예: const response = await fetch('인구데이터API주소');
//     // const data = await response.json();

//     // 결과를 행정동 코드/이름을 키로 하는 Map으로 변환
//     const populationMap = new Map<string, number>();

//     // 예시 데이터 처리
//     // data.forEach(item => {
//     //   populationMap.set(item.adm_cd, item.population);
//     // });

//     return populationMap;
//   } catch (error) {
//     console.error("인구 데이터 가져오기 실패:", error);
//     return new Map();
//   }
// };
