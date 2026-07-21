export interface LatLng {
  lat: number;
  lng: number;
}

export interface Store {
  id: string;
  name: string;
  category: string;
  address: string;
  location: LatLng;
  distanceKm: number;
  phone: string | null;
  openNow: boolean | null;
  hoursToday: string | null;
  weekdayHours: string[];
  rating: number | null;
  reviewCount: number | null;
  website: string | null;
  directionsUrl: string;
}

export type StoreType =
  | "all"
  | "pharmacy"
  | "grocery"
  | "electronics"
  | "restaurant"
  | "clothing"
  | "bakery"
  | "hospital"
  | "bank_atm"
  | "gym"
  | "hardware"
  | "bookstore"
  | "furniture"
  | "beauty_salon"
  | "car_repair"
  | "pet_store"
  | "gas_station"
  | "cafe";

export interface SearchRequest {
  query: string;
  type: StoreType;
  radiusKm: number;
}

export interface SearchResponse {
  center: LatLng;
  resolvedAddress: string;
  stores: Store[];
}
