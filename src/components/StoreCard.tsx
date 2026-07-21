"use client";
import type { Store } from "@/lib/types";

export default function StoreCard({
  store,
  selected,
  onSelect,
}: {
  store: Store;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect(store.id)}
      className={`cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition ${
        selected
          ? "border-blue-500 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{store.name}</h3>
          <p className="text-sm text-gray-500">
            {store.category} · {store.distanceKm} km
          </p>
        </div>
        {store.openNow !== null && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              store.openNow ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {store.openNow ? "Open" : "Closed"}
          </span>
        )}
      </div>
      {store.rating !== null && (
        <p className="mt-1 text-sm text-amber-600">
          ★ {store.rating}{" "}
          <span className="text-gray-400">({store.reviewCount} reviews)</span>
        </p>
      )}
      <p className="mt-1 text-sm text-gray-600">{store.address}</p>
      {store.hoursToday && <p className="mt-1 text-sm text-gray-500">{store.hoursToday}</p>}
      <div className="mt-2 flex flex-wrap gap-3 text-sm">
        {store.phone && (
          <a
            href={`tel:${store.phone}`}
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            📞 {store.phone}
          </a>
        )}
        {store.website && (
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Website
          </a>
        )}
        <a
          href={store.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Directions ↗
        </a>
      </div>
    </div>
  );
}
