export interface MapProps {
  width: string;
  height: string;
  center?: {
    lat: number;
    lng: number;
  };
  level?: number;
  minLevel?: number; // 최대 줌인 레벨 추가
  maxLevel?: number; // 최대 줌아웃 레벨 추가
  markers?: Marker[];
  onPolygonSelect?: (adminName: string) => void;
}

export interface Marker {
  position: {
    lat: number;
    lng: number;
  };
  content?: string;
  onClick?: () => void;
}

export interface MapSidebarProps {
  onSearch: (address: string) => void;
  onClose: () => void;
  selectedAdminName: string | null;
  selectedCategory: string | null;
  onMapRecommendation?: (data: any[]) => void; // ✅ optional로 변경
}

export interface KakaoMapAPI {
  maps: any;
}

declare global {
  interface Window {
    kakao: KakaoMapAPI;
  }
}

export interface ToggleSwitchProps {
  options: string[];
  defaultSelected?: string;
  onChange?: (selected: string) => void;
}

export interface KakaomapProps extends MapProps {
  markers?: Marker[];
  geoJsonData?: any;
  recommendedAreas?: RecommendedArea[]; // ✅ 추천된 행정동 이름 목록
}

export interface LegendItem {
  color: string;
  label: string;
  description?: string;
}

export interface ColorLegendProps {
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  title?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  selectedAdminName?: string;
  selectedCategory?: string;
}
export interface AnalysisModalProps extends ModalProps {
  selectedAdminName?: string;
}

export interface LocationItem {
  행정동명: string;
  타겟연령_비율: number;
  타겟연령_수: number;
  업종_평균_매출: number;
  임대료: number;
  유동인구면적당: number;
  직장인구면적당: number;
  거주인구면적당: number;
  동일업종_수면적당: number;
  집객시설면적당: number;
  접근성: number;
  [key: string]: any;
}

export interface AverageValues {
  타겟연령_비율: number;
  타겟연령_수: number;
  업종_평균_매출: number;
  임대료: number;
  유동인구면적당: number;
  직장인구면적당: number;
  거주인구면적당: number;
  동일업종_수면적당: number;
  집객시설면적당: number;
  접근성: number;
  [key: string]: any;
}

// 데이터 구조에 맞는 인터페이스를 정의합니다
export interface RecommendationData {
  top_locations: LocationItem[];
  average_values: AverageValues;
}

export interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RecommendationData | null; // string[] 대신 RecommendationData | null로 변경
}
export interface TabProps {
  selectedAdminName?: string;
}
export interface RecommendedArea {
  adminName: string;
  floatingPopulation: number;
  workingPopulation: number;
  residentialPopulation: number;
}
