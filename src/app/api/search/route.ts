import { NextResponse } from "next/server";
import { searchRequestSchema } from "@/lib/validation";
import { geocodeAddress, searchNearbyStores, GoogleApiError } from "@/lib/google";
import { mapPlaceToStore } from "@/lib/mapper";
import { TtlCache } from "@/lib/cache";
import type { SearchResponse } from "@/lib/types";

const cache = new TtlCache<SearchResponse>(5 * 60 * 1000);

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = searchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { query, type, radiusKm } = parsed.data;

  const cacheKey = `${query.toLowerCase()}|${type}|${radiusKm}`;
  const hit = cache.get(cacheKey);
  if (hit) return NextResponse.json(hit);

  try {
    const geo = await geocodeAddress(query);
    if (!geo) return NextResponse.json({ error: "location_not_found" }, { status: 404 });

    const places = await searchNearbyStores(geo.location, type, radiusKm);
    const stores = places
      .map((p) => mapPlaceToStore(p, geo.location))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const response: SearchResponse = {
      center: geo.location,
      resolvedAddress: geo.formattedAddress,
      stores,
    };
    cache.set(cacheKey, response);
    return NextResponse.json(response);
  } catch (e) {
    console.error("search failed:", e);
    const status = e instanceof GoogleApiError ? 502 : 500;
    return NextResponse.json({ error: "upstream_error" }, { status });
  }
}
