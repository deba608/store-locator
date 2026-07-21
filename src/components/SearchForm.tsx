"use client";
import { useEffect, useRef, useState } from "react";
import type { SearchRequest, StoreType } from "@/lib/types";

const STORE_TYPES: { value: StoreType; label: string; emoji: string }[] = [
  { value: "all", label: "All stores", emoji: "🏬" },
  { value: "pharmacy", label: "Pharmacy", emoji: "💊" },
  { value: "grocery", label: "Grocery", emoji: "🛒" },
  { value: "electronics", label: "Electronics", emoji: "🔌" },
  { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { value: "cafe", label: "Cafe", emoji: "☕" },
  { value: "clothing", label: "Clothing", emoji: "👕" },
  { value: "bakery", label: "Bakery", emoji: "🥐" },
  { value: "hospital", label: "Hospital", emoji: "🏥" },
  { value: "bank_atm", label: "Bank / ATM", emoji: "🏦" },
  { value: "gym", label: "Gym", emoji: "🏋️" },
  { value: "hardware", label: "Hardware", emoji: "🔧" },
  { value: "bookstore", label: "Bookstore", emoji: "📚" },
  { value: "furniture", label: "Furniture", emoji: "🛋️" },
  { value: "beauty_salon", label: "Beauty salon", emoji: "💇" },
  { value: "car_repair", label: "Car repair", emoji: "🔩" },
  { value: "pet_store", label: "Pet store", emoji: "🐾" },
  { value: "gas_station", label: "Gas station", emoji: "⛽" },
];

type LocationMode = "address" | "pincode";

interface Suggestion {
  placeId: string;
  text: string;
}

export default function SearchForm({
  onSearch,
  loading,
}: {
  onSearch: (req: SearchRequest) => void;
  loading: boolean;
}) {
  const [mode, setMode] = useState<LocationMode>("address");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<StoreType>("all");
  const [radiusKm, setRadiusKm] = useState(5);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextFetch = useRef(false);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetch(`/api/autocomplete?input=${encodeURIComponent(trimmed)}&mode=${mode}`)
        .then((r) => r.json())
        .then((data) => setSuggestions(data.suggestions ?? []))
        .catch(() => setSuggestions([]));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, mode]);

  function selectSuggestion(s: Suggestion) {
    skipNextFetch.current = true;
    setQuery(s.text);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function switchMode(next: LocationMode) {
    setMode(next);
    setQuery("");
    setSuggestions([]);
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) onSearch({ query: query.trim(), type, radiusKm });
        setShowSuggestions(false);
      }}
    >
      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 text-xs font-medium">
        {(["address", "pincode"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`flex-1 rounded-md py-1.5 transition ${
              mode === m ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
            }`}
          >
            {m === "address" ? "Address" : "PIN code"}
          </button>
        ))}
      </div>

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
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          placeholder={mode === "address" ? "Street, locality, or city" : "e.g. 560001"}
          inputMode={mode === "pincode" ? "numeric" : "text"}
          required
          aria-label={mode === "address" ? "Address" : "PIN code"}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
            {suggestions.map((s) => (
              <li key={s.placeId}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(s)}
                  className="block w-full truncate px-3 py-2 text-left text-sm text-neutral-700 hover:bg-teal-50"
                >
                  {s.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <select
        value={type}
        onChange={(e) => setType(e.target.value as StoreType)}
        className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 px-3 text-sm text-neutral-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20"
        aria-label="Store type"
      >
        {STORE_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.emoji} {t.label}
          </option>
        ))}
      </select>

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
