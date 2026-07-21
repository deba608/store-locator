"use client";
import type { Store } from "@/lib/types";

export default function StoreCard({
  store,
  index,
  selected,
  onSelect,
}: {
  store: Store;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect(store.id)}
      className={`cursor-pointer border-l-2 px-4 py-3.5 transition ${
        selected
          ? "border-teal-700 bg-teal-50/60"
          : "border-transparent hover:bg-neutral-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
            selected ? "bg-teal-700 text-white" : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-neutral-900">{store.name}</h3>
            <span className="shrink-0 text-xs font-medium tabular-nums text-neutral-500">
              {store.distanceKm} km
            </span>
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500">
            {store.rating !== null && (
              <span className="font-medium text-neutral-700">
                Rating {store.rating}
                <span className="font-normal text-neutral-400"> ({store.reviewCount})</span>
              </span>
            )}
            {store.openNow !== null && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  store.openNow ? "text-green-700" : "text-red-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    store.openNow ? "bg-green-600" : "bg-red-500"
                  }`}
                />
                {store.openNow ? "Open" : "Closed"}
              </span>
            )}
            <span className="text-neutral-400">{store.category}</span>
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
            {store.address}
          </p>
          {store.hoursToday && (
            <p className="mt-0.5 text-xs text-neutral-400">
              {store.hoursToday.replace(/^[A-Za-z]+: /, "Today: ")}
            </p>
          )}

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
            {store.phone && (
              <a
                href={`tel:${store.phone}`}
                className="text-teal-700 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Call
              </a>
            )}
            {store.website && (
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Website
              </a>
            )}
            <a
              href={store.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
