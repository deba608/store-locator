import type { LatLng, StoreType } from "./types";
import type { GooglePlace } from "./mapper";

const TYPE_MAP: Record<StoreType, string> = {
  pharmacy: "pharmacy",
  grocery: "grocery_store",
  electronics: "electronics_store",
  restaurant: "restaurant",
  clothing: "clothing_store",
};

export class GoogleApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function apiKey(): string {
  const k = process.env.GOOGLE_MAPS_API_KEY;
  if (!k) throw new Error("GOOGLE_MAPS_API_KEY not set");
  return k;
}

export async function geocodeAddress(
  query: string
): Promise<{ location: LatLng; formattedAddress: string } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey()}`;
  const res = await fetch(url);
  if (!res.ok) throw new GoogleApiError(res.status, "geocoding request failed");
  const data = await res.json();
  if (data.status === "ZERO_RESULTS") return null;
  if (data.status !== "OK") throw new GoogleApiError(500, `geocoding error: ${data.status}`);
  if (!data.results?.length) return null;
  const r = data.results[0];
  return {
    location: { lat: r.geometry.location.lat, lng: r.geometry.location.lng },
    formattedAddress: r.formatted_address,
  };
}

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.primaryTypeDisplayName",
  "places.regularOpeningHours",
].join(",");

export async function searchNearbyStores(
  center: LatLng,
  type: StoreType,
  radiusKm: number
): Promise<GooglePlace[]> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: [TYPE_MAP[type]],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: center.lat, longitude: center.lng },
          radius: radiusKm * 1000,
        },
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new GoogleApiError(res.status, `places search failed: ${body}`);
  }
  const data = await res.json();
  return (data.places ?? []) as GooglePlace[];
}
