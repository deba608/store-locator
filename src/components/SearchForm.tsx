"use client";
import { useState } from "react";
import type { SearchRequest, StoreType } from "@/lib/types";

const STORE_TYPES: { value: StoreType; label: string }[] = [
  { value: "pharmacy", label: "Pharmacy" },
  { value: "grocery", label: "Grocery" },
  { value: "electronics", label: "Electronics" },
  { value: "restaurant", label: "Restaurant" },
  { value: "clothing", label: "Clothing" },
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
      className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim()) onSearch({ query: query.trim(), type, radiusKm });
      }}
    >
      <label className="flex-1 text-sm font-medium text-gray-700">
        Address / PIN code
        <input
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 560001 or MG Road, Bengaluru"
          required
        />
      </label>
      <label className="text-sm font-medium text-gray-700">
        Store type
        <select
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
          value={type}
          onChange={(e) => setType(e.target.value as StoreType)}
        >
          {STORE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium text-gray-700">
        Radius: {radiusKm} km
        <input
          type="range"
          min={2}
          max={20}
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          className="mt-2 w-full sm:w-40"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
