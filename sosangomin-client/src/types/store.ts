export interface StoreModalProps {
  onSubmit?: (storeData: StoreData) => void;
}

export interface LocationInfo {
  address: string;
  name: string;
  lat: number;
  lng: number;
}

export interface StoreData {
  name: string;
  description: string;
  businessNumber: string;
  location: LocationInfo | null;
}
