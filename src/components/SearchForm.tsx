"use client";
import { useState } from "react";
import type { SearchRequest, StoreType } from "@/lib/types";

const STORE_TYPES: { value: StoreType; label: string; emoji: string }[] = [
  { value: "pharmacy", label: "Pharmacy", emoji: "💊" },
  { value: "grocery", label: "Grocery", emoji: "🛒" },
  { value: "electronics", label: "Electronics", emoji: "🔌" },
  { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { value: "clothing", label: "Clothing", emoji: "👕" },
];

export default function SearchForm({
  onSearch,
  loading,
}: {
  onSearch: (req: SearchRequest) => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<StoreType>("pharmacy");
  const [radiusKm, setRadiusKm] = useState(5);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) onSearch({ query: query.trim(), type, radiusKm });
      }}
    >
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Address or PIN code"
          required
          aria-label="Address or PIN code"
        />
      </div>

      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Store type">
        {STORE_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={type === t.value}
            onClick={() => setType(t.value)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              type === t.value
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex flex-1 items-center gap-3 text-xs font-medium text-neutral-500">
          <span className="whitespace-nowrap tabular-nums">Within {radiusKm} km</span>
          <input
            type="range"
            min={2}
            max={20}
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 accent-teal-700"
            aria-label="Search radius in kilometers"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600/40 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
