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

  const placesService = useRef<any>(null);

  // 카카오맵 Places 서비스 초기화
  useEffect(() => {
    console.log("카카오맵 서비스 체크:", window.kakao?.maps?.services);
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      placesService.current = new window.kakao.maps.services.Places();
      console.log("Places 서비스 초기화 성공");
    } else {
      console.error("카카오맵 서비스를 사용할 수 없습니다");
    }
  }, []);

  // 키워드 검색 함수
  const searchPlaces = () => {
    console.log("검색 함수 호출됨:", keyword);

    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    if (placesService.current) {
      placesService.current.keywordSearch(
        keyword,
        (results: any, status: any) => {
          console.log("검색 결과:", results, "상태:", status);

          if (status === window.kakao.maps.services.Status.OK) {
            setSearchResults(results);
            // 선택된 장소 초기화
            setSelectedPlace(null);

            // 검색 결과를 마커로 변환
            const newMarkers = results.map((place: any) => ({
              position: {
                lat: parseFloat(place.y),
                lng: parseFloat(place.x)
              },
              content: `<div style="padding:5px;width:150px;">${place.place_name}</div>`,
              onClick: () => handleSelectPlace(place)
            }));

            setMarkers(newMarkers);

            // 첫 번째 결과로 지도 중심 이동
            if (results.length > 0) {
              setMapCenter({
                lat: parseFloat(results[0].y),
                lng: parseFloat(results[0].x)
              });
            }
          } else {
            alert("검색 결과가 없습니다.");
            setSearchResults([]);
            setMarkers([]);
          }
        }
      );
    } else {
      console.error("Places 서비스가 초기화되지 않았습니다");
      alert("지도 서비스를 사용할 수 없습니다. 페이지를 새로고침 해보세요.");
    }
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
            type="button" // 명시적으로 버튼 타입 지정
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              searchPlaces();
            }}
            className="bg-bit-main text-white py-1 px-3 rounded-r-md hover:bg-blue-900 text-xs"
          >
            검색
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* 검색 결과 리스트 - 모바일에서는 위, 태블릿 이상에서는 왼쪽 */}
        <div className="sm:w-1/3 order-2 sm:order-1">
          <div
            className={`border border-border rounded-md overflow-hidden ${
              searchResults.length === 0 ? "hidden" : "max-h-40 sm:max-h-full"
            } overflow-y-auto`}
          >
            {searchResults.length > 0 ? (
              <ul>
                {searchResults.map((place, index) =>
                  renderSearchResultItem(place, index)
                )}
              </ul>
            ) : (
              <div className="p-3 text-center text-gray-500 text-xs">
                검색 결과가 없습니다
              </div>
            )}
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
