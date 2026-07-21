# Store Locator

Find nearby stores by address or PIN code. Enter a location, pick a store type (pharmacy, grocery, electronics, restaurant, clothing) and a search radius (2–20 km) — get a list of stores with distance, phone, opening hours, open/closed status, rating, website, a directions link, and markers on a map.

Search results can be downloaded from the results header as either a CSV file or an Excel (`.xlsx`) workbook.

## How it works

- **Next.js 16 (App Router, TypeScript)** — one app, frontend + backend.
- The browser only talks to `POST /api/search`. The server:
  1. Validates input with zod.
  2. Geocodes the address/PIN via **Google Geocoding API**.
  3. Finds stores via **Google Places API (New)** `searchNearby`.
  4. Maps results to a clean `Store` shape, computes distance (haversine), sorts nearest-first.
  5. Caches responses in memory for 5 minutes.
- The Google API key lives only on the server (`.env.local`) — never shipped to the browser.
- The map is **Leaflet + OpenStreetMap tiles** (free, no key needed for display).

## Setup

### 1. Google Cloud

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com) (billing must be enabled — the monthly free credit easily covers development use).
2. Enable two APIs: **Geocoding API** and **Places API (New)**.
3. Create an API key (APIs & Services → Credentials). Recommended: restrict it to those two APIs.

### 2. Environment

Create `.env.local` in the project root:

```
GOOGLE_MAPS_API_KEY=your_key_here
```

### 3. Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## Scripts

| Command | What |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm test` | unit tests (vitest) |

## Project structure

```
src/
├── app/
│   ├── page.tsx              # main page: search state, list + map layout
│   └── api/search/route.ts   # POST endpoint: validate → geocode → search → respond
├── lib/
│   ├── types.ts              # Store, SearchRequest, SearchResponse
│   ├── distance.ts           # haversine distance
│   ├── validation.ts         # zod request schema
│   ├── google.ts             # Geocoding + Places API calls (server-only)
│   ├── mapper.ts             # Google place → Store
│   └── cache.ts              # in-memory TTL cache
└── components/
    ├── SearchForm.tsx        # address input, type select, radius slider
    ├── StoreCard.tsx         # one result card
    ├── StoreList.tsx         # result list
    └── StoreMap.tsx          # Leaflet map with markers
```

## API errors

| Response | Meaning |
|---|---|
| 400 `invalid_request` | bad input (empty query, unknown type, radius outside 2–20) |
| 404 `location_not_found` | address/PIN could not be geocoded |
| 502 `upstream_error` | Google API failure (bad key, quota, outage) |
