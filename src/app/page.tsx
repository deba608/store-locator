"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import SearchForm from "@/components/SearchForm";
import StoreList from "@/components/StoreList";
import ExportButtons from "@/components/ExportButtons";
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
    <div className="flex h-screen flex-col overflow-hidden bg-[#FAFAF7] lg:flex-row">
      {/* Sidebar */}
      <aside className="flex min-h-0 w-full flex-col border-neutral-200 bg-white lg:h-full lg:w-[420px] lg:border-r">
        <header className="border-b border-neutral-100 px-4 pb-4 pt-5">
          <h1 className="text-lg font-bold tracking-tight text-neutral-900">
            Store<span className="text-teal-700">Locator</span>
          </h1>
          <p className="mb-4 mt-0.5 text-xs text-neutral-400">
            Find stores near any address or PIN code
          </p>
          <SearchForm onSearch={handleSearch} loading={loading} />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {error && (
            <p className="m-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
          )}

          {result && (
            <>
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-neutral-100 bg-white/95 px-4 py-2 backdrop-blur">
                <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                  {result.stores.length} result{result.stores.length === 1 ? "" : "s"} ·{" "}
                  {result.resolvedAddress}
                </p>
                {result.stores.length > 0 && (
                  <ExportButtons
                    stores={result.stores}
                    resolvedAddress={result.resolvedAddress}
                  />
                )}
              </div>
              {result.stores.length === 0 ? (
                <p className="m-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                  No stores found in this radius. Try increasing the radius.
                </p>
              ) : (
                <StoreList
                  stores={result.stores}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              )}
            </>
          )}

          {!result && !error && !loading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-8 py-16 text-center">
              <span className="text-3xl">📍</span>
              <p className="text-sm font-medium text-neutral-600">Search to find stores</p>
              <p className="text-xs text-neutral-400">
                Enter an address or PIN code, pick a store type, set your radius.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col gap-3 p-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-lg bg-neutral-100 p-4">
                  <div className="h-3.5 w-2/3 rounded bg-neutral-200" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-neutral-200" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-neutral-200" />
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Map */}
      <main className="min-h-0 flex-1">
        {result && result.stores.length > 0 ? (
          <StoreMap
            center={result.center}
            stores={result.stores}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[url('https://tile.openstreetmap.org/5/22/14.png')] bg-cover">
            <div className="hidden rounded-xl bg-white/90 px-6 py-4 text-sm text-neutral-500 shadow-lg backdrop-blur lg:block">
              Map appears here after you search
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
