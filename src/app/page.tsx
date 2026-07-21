"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import SearchForm from "@/components/SearchForm";
import StoreList from "@/components/StoreList";
import type { SearchRequest, SearchResponse } from "@/lib/types";

const StoreMap = dynamic(() => import("@/components/StoreMap"), { ssr: false });

const ERROR_MESSAGES: Record<string, string> = {
  location_not_found: "Couldn't find that location. Check the address or PIN code.",
  invalid_request: "Invalid input. Check your search and try again.",
  upstream_error: "Search service unavailable right now. Try again in a minute.",
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  async function handleSearch(req: SearchRequest) {
    setLoading(true);
    setError(null);
    setSelectedId(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(null);
        setError(ERROR_MESSAGES[data.error] ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setResult(null);
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl bg-gray-50 p-4 sm:p-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Store Locator</h1>
      <p className="mb-4 text-sm text-gray-500">Find nearby stores by address or PIN code.</p>
      <SearchForm onSearch={handleSearch} loading={loading} />

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {result && (
        <>
          <p className="mt-4 text-sm text-gray-600">
            {result.stores.length} result{result.stores.length === 1 ? "" : "s"} near{" "}
            <b>{result.resolvedAddress}</b>
          </p>
          {result.stores.length === 0 ? (
            <p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              No stores found in this radius. Try increasing the radius.
            </p>
          ) : (
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <StoreList stores={result.stores} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
              <div className="h-[50vh] lg:sticky lg:top-4 lg:h-[70vh]">
                <StoreMap
                  center={result.center}
                  stores={result.stores}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </div>
          )}
        </>
      )}

      {!result && !error && !loading && (
        <p className="mt-10 text-center text-gray-400">
          Enter a location and store type to begin.
        </p>
      )}
    </main>
  );
}
