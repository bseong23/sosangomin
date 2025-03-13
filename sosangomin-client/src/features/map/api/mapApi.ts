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

// 인구 데이터 가져오기
export const fetchPopulationData = async (): Promise<Map<string, number>> => {
  try {
    // 여기에 실제 API 호출 코드 작성
    // 예: const response = await fetch('인구데이터API주소');
    // const data = await response.json();

    // 결과를 행정동 코드/이름을 키로 하는 Map으로 변환
    const populationMap = new Map<string, number>();

    // 예시 데이터 처리
    // data.forEach(item => {
    //   populationMap.set(item.adm_cd, item.population);
    // });

    return populationMap;
  } catch (error) {
    console.error("인구 데이터 가져오기 실패:", error);
    return new Map();
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
export const displayGeoJsonPolygon = async (
  map: any,
  geoJsonData: any,
  options = {}
) => {
  if (!window.kakao || !window.kakao.maps) {
    console.error("Kakao maps API not loaded");
    return;
  }

  // 인구 데이터 가져오기
  const populationData = await fetchPopulationData();

  // 인포윈도우 참조 생성
  const infowindowRef = { current: null };

  // 기본 스타일 옵션
  const defaultOptions = {
    strokeColor: "#004c80",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0088ff",
    fillOpacity: 0.7,
    fitBounds: false
  };

  const polygonOptions = { ...defaultOptions, ...options };

  // FeatureCollection 형식 처리
  if (geoJsonData.type === "FeatureCollection" && geoJsonData.features) {
    const bounds = new window.kakao.maps.LatLngBounds();

    geoJsonData.features.forEach((feature: any) => {
      if (feature.geometry) {
        // 행정동 코드 또는 이름 가져오기
        const admCode = feature.properties.adm_cd || "";

        // 인구 데이터에서 해당 행정동의 인구 가져오기
        const population = populationData.get(admCode) || 0;

        // 인구에 따른 색상 결정
        const fillColor = getColorByPopulation(population);

        // 폴리곤 옵션 업데이트
        const customOptions = {
          ...polygonOptions,
          fillColor: fillColor
        };

        if (feature.geometry.type === "Polygon") {
          processPolygon(
            map,
            feature.geometry.coordinates[0],
            feature.properties,
            customOptions,
            bounds,
            population,
            infowindowRef
          );
        } else if (feature.geometry.type === "MultiPolygon") {
          // MultiPolygon은 폴리곤 배열이므로 각각 처리
          feature.geometry.coordinates.forEach((polygonCoords: any) => {
            processPolygon(
              map,
              polygonCoords[0],
              feature.properties,
              customOptions,
              bounds,
              population,
              infowindowRef
            );
          });
        }
      }
    });

    // 폴리곤 영역으로 지도 이동 (옵션)
    if (polygonOptions.fitBounds) {
      map.setBounds(bounds);
    }
  } else {
    console.error("유효하지 않은 GeoJSON 데이터 형식입니다");
  }
};

// 폴리곤 처리 함수 (수정된 버전)
const processPolygon = (
  map: any,
  coordinates: any,
  properties: any,
  options: any,
  bounds: any,
  population: number = 0,
  infowindowRef: React.MutableRefObject<any> // 인포윈도우 참조 추가
) => {
  if (!coordinates || !Array.isArray(coordinates)) {
    return;
  }

  // WGS84 좌표계이므로 경도(x), 위도(y) 순서로 저장되어 있음
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

  // 경계 확장
  if (options.fitBounds) {
    path.forEach((point) => bounds.extend(point));
  }

  // 선택적: 폴리곤 클릭 이벤트 추가 (인구 정보 포함)
  if (properties && properties.adm_nm) {
    window.kakao.maps.event.addListener(polygon, "click", function () {
      // 이전 인포윈도우가 있으면 닫기
      if (infowindowRef.current) {
        infowindowRef.current.close();
      }

      const content = `
        <div style="padding:5px;width:200px;text-align:center;">
          <strong>${properties.adm_nm}</strong><br>
          인구: ${population.toLocaleString()}명
        </div>
      `;

      // 새 인포윈도우 생성 및 열기
      const infowindow = new window.kakao.maps.InfoWindow({
        content: content,
        position: path[0],
        zIndex: 1
      });

      infowindow.open(map);

      // 참조 업데이트
      infowindowRef.current = infowindow;
    });
  }
};
