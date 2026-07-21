import { haversineKm } from "./distance";
import type { LatLng, Store } from "./types";

export interface GooglePlace {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  primaryTypeDisplayName?: { text: string };
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
}

// JS getDay(): 0=Sunday. Google weekdayDescriptions start Monday.
function todayLine(weekday: string[]): string | null {
  if (weekday.length !== 7) return null;
  const jsDay = new Date().getDay();
  const idx = (jsDay + 6) % 7;
  return weekday[idx] ?? null;
}

export function mapPlaceToStore(p: GooglePlace, origin: LatLng): Store {
  const loc = { lat: p.location.latitude, lng: p.location.longitude };
  const weekdayHours = p.regularOpeningHours?.weekdayDescriptions ?? [];
  return {
    id: p.id,
    name: p.displayName.text,
    category: p.primaryTypeDisplayName?.text ?? "Store",
    address: p.formattedAddress,
    location: loc,
    distanceKm: Math.round(haversineKm(origin, loc) * 100) / 100,
    phone: p.nationalPhoneNumber ?? p.internationalPhoneNumber ?? null,
    openNow: p.regularOpeningHours?.openNow ?? null,
    hoursToday: todayLine(weekdayHours),
    weekdayHours,
    rating: p.rating ?? null,
    reviewCount: p.userRatingCount ?? null,
    website: p.websiteUri ?? null,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&destination_place_id=${p.id}`,
  };
}
