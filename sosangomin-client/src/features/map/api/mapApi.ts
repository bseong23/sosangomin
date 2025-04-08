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
  if (population > 100000) return "#FF0000"; // 빨강 (매우 많음)
  if (population > 50000) return "#FF8C00"; // 주황
  if (population > 30000) return "#FFD700"; // 노랑
  if (population > 10000) return "#32CD32"; // 초록
  return "#0000FF"; // 파랑 (낮음)
};

export const getColorByGrade = (grade: string): string => {
  switch (grade) {
    case "1등급":
      return "#FF0000"; // 빨강 (최상위 등급)
    case "2등급":
      return "#FF8C00"; // 주황
    case "3등급":
      return "#FFD700"; // 노랑
    case "4등급":
      return "#32CD32"; // 초록
    case "5등급":
      return "#0000FF"; // 파랑
    default:
      return "#808080"; // 기본값 (회색)
  }
};
// 유동인구 데이터를 가져오는 함수
export const fetchPopulationData = async (): Promise<Map<string, number>> => {
  try {
    // ➡️ API 호출
    const response = await axiosInstance.get("/api/proxy/location/heatmap");

    // 데이터를 Map으로 변환 ("행정동명"을 키로 설정)
    const populationMap = new Map<string, number>();
    response.data.forEach((item: any) => {
      const adminName = item.행정동명;
      populationMap.set(`${adminName}_유동인구`, item.유동인구);
      populationMap.set(`${adminName}_직장인구`, item.직장인구);
      populationMap.set(`${adminName}_거주인구`, item.거주인구);
      // '총 업소 수' 속성을 populationMap에 저장
      populationMap.set(`${adminName}_총 업소 수`, item["총 업소 수"]);
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
    polygonsRef?: React.MutableRefObject<any[]>;
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
    fillOpacity: options.fillOpacity || 0.1
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
    const population =
      options.populationData?.get(`${simpleName}_유동인구`) || 0;
    const workplacePopulation =
      options.populationData?.get(`${simpleName}_직장인구`) || 0;
    const residentPopulation =
      options.populationData?.get(`${simpleName}_거주인구`) || 0;
    const storecount =
      options.populationData?.get(`${simpleName}_총 업소 수`) || 0;

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

    const tooltipStyle = `
    background: rgba(255, 255, 255, 0.9);
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    position: relative;
    white-space: nowrap;
    line-height: 1.5;
  `;
    window.kakao.maps.event.addListener(
      polygon,
      "mouseover",
      function (mouseEvent: any) {
        polygon.setOptions({
          fillOpacity: defaultStyle.fillOpacity + 0.2
        });

        customOverlay.setContent(`
      <div style="${tooltipStyle}">
    
        <strong style="color: #333; font-size: 14px;">${simpleName}</strong><br/>
        <span style="color: #ff5733;">유동인구:</span> ${population.toLocaleString()}명<br/>
       <span style="color: #3399ff;">직장인구:</span> ${workplacePopulation.toLocaleString()}명<br/>
    <span style="color: #33cc33;">거주인구:</span> ${residentPopulation.toLocaleString()}명<br/>
      <span style="color: #33cc33;">총 업소 수:</span> ${storecount.toLocaleString()}개
      </div>
    `);

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
        fillOpacity: defaultStyle.fillOpacity + 0.2,
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

// 추천 지역 데이터를 이용해 폴리곤 표시 함수
export const displayrecommendPolygon = (
  map: any,
  geoJsonData: any,
  recommendedAreas: any[],
  options: {
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    fillColor?: string;
    fillOpacity?: number;
    fitBounds?: boolean;
    polygonsRef?: React.MutableRefObject<any[]>;
    onPolygonClick?: (
      adminName: string,
      center: { lat: number; lng: number }
    ) => void;
  }
) => {
  if (
    !map ||
    !geoJsonData ||
    !recommendedAreas ||
    !Array.isArray(recommendedAreas)
  ) {
    console.error("Invalid map, geoJsonData or recommendedAreas data");
    return;
  }

  // 기본 스타일
  const defaultStyle = {
    strokeColor: options.strokeColor || "#FFFFFF",
    strokeOpacity: options.strokeOpacity || 0.5,
    strokeWeight: options.strokeWeight || 2,
    fillColor: options.fillColor || "#808080",
    fillOpacity: options.fillOpacity || 0.1 // 여기를 0.1로 변경
  };

  // 추천 지역 데이터를 Map으로 변환 (조회 성능 향상)
  const recommendedMap = new Map<string, any>();
  recommendedAreas.forEach((area) => {
    recommendedMap.set(area.행정동명, area);
  });

  const bounds = new window.kakao.maps.LatLngBounds();
  const customOverlay = new window.kakao.maps.CustomOverlay({
    position: new window.kakao.maps.LatLng(0, 0),
    content: "",
    xAnchor: 0.5,
    yAnchor: 1.5,
    zIndex: 3
  });

  // 숫자 포맷팅 함수
  const formatNumber = (num: number | undefined): string => {
    return num !== undefined ? num.toLocaleString() : "0";
  };

  // 생성된 폴리곤 저장 배열
  const polygons: any[] = [];

  // GeoJSON 데이터 처리
  geoJsonData.features.forEach((feature: any) => {
    const coordinates = feature.geometry.coordinates;
    const properties = feature.properties;

    // 행정동 이름 추출
    const adminName = properties.adm_nm || "";
    const simpleName = adminName.split(" ").pop() || adminName;

    // 추천 지역 데이터에서 해당 행정동 정보 찾기
    const recommendedArea = recommendedMap.get(simpleName);

    // 해당 행정동이 추천 지역에 없으면 건너뛰기 (선택적)
    if (!recommendedArea) return;

    // 데이터 추출
    const floatingPopulation = recommendedArea["유동인구(면적당)"] || 0;
    const workplacePopulation = recommendedArea["직장인구(면적당)"] || 0;
    const residentPopulation = recommendedArea["거주인구(면적당)"] || 0;
    const grade = recommendedArea.등급 || "";
    const targetAgeRatio = recommendedArea.타겟연령_수 || 0;
    const rent = recommendedArea.임대료 || 0;
    // const similarBusinessCount = recommendedArea["동일업종_수(면적당)"] || 0;
    // const facilities = recommendedArea["집객시설(면적당)"] || 0;

    // 등급 기반 색상 결정
    let fillColor = defaultStyle.fillColor;
    if (grade) {
      fillColor = getColorByGrade(grade);
    }

    let paths: any[] = [];
    let polygonCenter = { lat: 0, lng: 0 };
    let pointCount = 0;

    // 다각형 경로 생성
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

    // 폴리곤 생성
    const polygon = new window.kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeColor: defaultStyle.strokeColor,
      strokeOpacity: defaultStyle.strokeOpacity,
      strokeWeight: defaultStyle.strokeWeight,
      fillColor: fillColor,
      fillOpacity: defaultStyle.fillOpacity // 0.1 + 0.1 대신 그냥 defaultStyle.fillOpacity 사용
    });

    // 생성된 폴리곤을 배열에 저장
    polygons.push(polygon);

    // 툴팁 스타일
    const tooltipStyle = `
      background: rgba(255, 255, 255, 0.95);
      padding: 10px 15px;
      border-radius: 8px;
      border: 1px solid #ddd;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      position: relative;
      min-width: 200px;
      line-height: 1.6;
    `;

    // 등급 뱃지 스타일
    const getBadgeStyle = (grade: string) => {
      const color = getColorByGrade(grade);
      return `
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        background-color: ${color};
        color: white;
        font-weight: bold;
        margin-left: 6px;
        font-size: 11px;
      `;
    };

    window.kakao.maps.event.addListener(
      polygon,
      "mouseover",
      function (mouseEvent: any) {
        polygon.setOptions({
          fillOpacity: defaultStyle.fillOpacity + 0.1
        });

        // 상세 정보를 포함한 툴팁 (등급 정보 포함)
        customOverlay.setContent(`
          <div style="${tooltipStyle}">
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
              ${simpleName} ${
          grade ? `<span style="${getBadgeStyle(grade)}">${grade}</span>` : ""
        }
            </div>
            <div>
              <span style="color: #ff5733;">유동인구:</span> ${formatNumber(
                floatingPopulation
              )}/㎢<br/>
              <span style="color: #3399ff;">직장인구:</span> ${formatNumber(
                workplacePopulation
              )}/㎢<br/>
              <span style="color: #33cc33;">거주인구:</span> ${formatNumber(
                residentPopulation
              )}/㎢<br/>
              <span style="color: #9966cc;">타겟연령 수:</span> ${(
                targetAgeRatio * 100
              ).toFixed(1)}명<br/>
              <span style="color: #ff9900;">임대료:</span> ${formatNumber(
                rent
              )}원/평
            </div>
          </div>
        `);

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
        fillOpacity: defaultStyle.fillOpacity // 원래 투명도로 복귀
      });
      customOverlay.setMap(null);
    });

    window.kakao.maps.event.addListener(polygon, "click", function () {
      if (options.onPolygonClick) {
        options.onPolygonClick(simpleName, polygonCenter);
      }

      polygon.setOptions({
        fillOpacity: defaultStyle.fillOpacity + 0.1,
        strokeWeight: defaultStyle.strokeWeight + 1
      });

      setTimeout(() => {
        polygon.setOptions({
          fillOpacity: defaultStyle.fillOpacity + 0.1,
          strokeWeight: defaultStyle.strokeWeight
        });
      }, 1500);
    });
  });

  // polygonsRef에 생성된 폴리곤 저장
  if (options.polygonsRef) {
    options.polygonsRef.current = [...polygons];
  }

  if (options.fitBounds && bounds.toString() !== "((-180, -90), (180, 90))") {
    map.setBounds(bounds);
  }

  return polygons;
};
