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
  selectedAdminName?: string | null;
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
  geoJsonData?: any; // GeoJSON 데이터를 위한 prop 추가
}

export interface LegendItem {
  color: string;
  label: string;
}

export interface ColorLegendProps {
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
  title?: string;
}
