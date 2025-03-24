import React, { useState, useEffect, useRef } from "react";
import Kakaomap from "@/features/map/components/maps/Kakaomap";

interface SearchableMapProps {
  width: string;
  height: string;
  onSelectLocation?: (location: {
    address: string;
    name: string;
    lat: number;
    lng: number;
  }) => void;
}

const SearchableMap: React.FC<SearchableMapProps> = ({
  height,
  onSelectLocation
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.501,
    lng: 127.039
  });
  const [selectedPlace, setSelectedPlace] = useState<{
    address: string;
    name: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [isPlacesServiceReady, setIsPlacesServiceReady] =
    useState<boolean>(false);

  const placesService = useRef<any>(null);
  const initAttemptsRef = useRef<number>(0);
  const maxInitAttempts = 5; // 최대 초기화 시도 횟수

  // Places 서비스 초기화 함수
  const initPlacesService = () => {
    // 이미 초기화되었으면 건너뜀
    if (placesService.current) {
      return true;
    }

    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      try {
        placesService.current = new window.kakao.maps.services.Places();
        console.log("Places 서비스 초기화 성공");
        setIsPlacesServiceReady(true);
        return true;
      } catch (error) {
        console.error("Places 서비스 초기화 실패:", error);
        return false;
      }
    } else {
      console.log("카카오맵 서비스가 아직 준비되지 않음");
      return false;
    }
  };

  // 카카오맵 Places 서비스 초기화 - 여러 번 시도
  useEffect(() => {
    // 첫 시도
    const initialized = initPlacesService();
    if (initialized) return;

    // 초기화 실패 시 일정 간격으로 재시도
    const intervalId = setInterval(() => {
      initAttemptsRef.current += 1;
      console.log(
        `Places 서비스 초기화 시도 ${initAttemptsRef.current}/${maxInitAttempts}`
      );

      const success = initPlacesService();

      if (success || initAttemptsRef.current >= maxInitAttempts) {
        clearInterval(intervalId);

        if (!success && initAttemptsRef.current >= maxInitAttempts) {
          console.error("Places 서비스 초기화 최대 시도 횟수 초과");
        }
      }
    }, 1000); // 1초마다 시도

    return () => clearInterval(intervalId);
  }, []);

  // 키워드 검색 함수
  const searchPlaces = () => {
    console.log("검색 함수 호출됨:", keyword);

    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    // 서비스가 준비되지 않았으면 초기화 시도
    if (!placesService.current) {
      const initialized = initPlacesService();
      if (!initialized) {
        alert("지도 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }
    }

    placesService.current.keywordSearch(
      keyword,
      (results: any, status: any) => {
        console.log("검색 결과:", results, "상태:", status);

        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(results);

          // 결과가 있으면 첫 번째 항목 자동 선택
          if (results.length > 0) {
            // 첫 번째 결과 자동 선택
            handleSelectPlace(results[0]);
          }
        } else {
          alert("검색 결과가 없습니다.");
          setSearchResults([]);
          setMarkers([]);
          setSelectedPlace(null);
        }
      }
    );
  };

  // 장소 선택 핸들러
  const handleSelectPlace = (place: any) => {
    console.log("장소 선택:", place);

    const selectedLocation = {
      address: place.address_name,
      name: place.place_name,
      lat: parseFloat(place.y),
      lng: parseFloat(place.x)
    };

    setSelectedPlace(selectedLocation);

    // 선택한 장소로 지도 중심 이동
    setMapCenter({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng
    });

    // 선택한 장소만 마커로 표시
    setMarkers([
      {
        position: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        },
        content: `<div style="padding:5px;width:150px;">${place.place_name}</div>`,
        onClick: () => handleSelectPlace(place)
      }
    ]);

    if (onSelectLocation) {
      onSelectLocation(selectedLocation);
    }
  };

  // 검색 결과 아이템 렌더링
  const renderSearchResultItem = (place: any, index: number) => (
    <li
      key={index}
      className={`p-2 border-b cursor-pointer ${
        selectedPlace &&
        selectedPlace.lat === parseFloat(place.y) &&
        selectedPlace.lng === parseFloat(place.x)
          ? "bg-blue-100 border-l-4 border-l-bit-main"
          : "hover:bg-gray-50"
      }`}
      onClick={() => {
        handleSelectPlace(place);
      }}
    >
      <p className="font-bold text-xs truncate">{place.place_name}</p>
      <p className="text-xs text-gray-600 truncate">{place.address_name}</p>
    </li>
  );

  return (
    <div className="w-full">
      <div className="mb-2">
        <div className="flex mb-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 폼 제출 방지
                e.stopPropagation();
                searchPlaces();
              }
            }}
            placeholder="장소를 검색하세요"
            className="flex-1 p-2 border border-border rounded-l-lg text-xs"
          />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              searchPlaces();
            }}
            className="bg-bit-main text-white py-1 px-3 rounded-r-md hover:bg-blue-900 text-xs"
            disabled={
              !isPlacesServiceReady &&
              initAttemptsRef.current >= maxInitAttempts
            }
          >
            검색
          </button>
        </div>
        {!isPlacesServiceReady &&
          initAttemptsRef.current >= maxInitAttempts && (
            <p className="text-red-500 text-xs mt-1">
              지도 서비스를 불러오는데 실패했습니다. 페이지를 새로고침 해주세요.
            </p>
          )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* 검색 결과 리스트 - 모바일에서는 위, 태블릿 이상에서는 왼쪽 */}
        <div className="sm:w-1/3 order-2 sm:order-1">
          {/* 항상 표시되는 고정 크기 컨테이너 */}
          <div className="border border-border rounded-md h-[300px] overflow-hidden flex flex-col">
            {/* 헤더 영역 */}
            <div className="bg-gray-50 p-2 border-b">
              <h3 className="font-medium text-xs">검색 결과</h3>
            </div>

            {/* 결과 목록 영역 - 내용에 상관없이 스크롤 가능 */}
            <div className="flex-grow overflow-y-auto">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map((place, index) =>
                    renderSearchResultItem(place, index)
                  )}
                </ul>
              ) : (
                <div className="p-3 text-center text-gray-500 text-xs h-full flex items-center justify-center">
                  <p>검색어를 입력하여 장소를 찾아보세요</p>
                </div>
              )}
            </div>

            {/* 선택된 장소 정보 표시 영역 (결과가 있고 선택된 경우) */}
            {/* {selectedPlace && (
              <div className="bg-blue-100 p-2 border-t">
                <p className="text-xs text-gray-500">선택된 장소:</p>
                <p className="font-bold text-xs truncate">
                  {selectedPlace.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {selectedPlace.address}
                </p>
              </div>
            )} */}
          </div>
        </div>

        {/* 지도 - 모바일에서는 아래, 태블릿 이상에서는 오른쪽 */}
        <div className="order-1 sm:order-2 sm:w-2/3">
          <Kakaomap
            width="100%"
            height={height}
            center={mapCenter}
            markers={markers}
            level={3} // 줌 레벨 (낮을수록 더 자세히 보임)
          />
        </div>
      </div>
    </div>
  );
};

export default SearchableMap;
