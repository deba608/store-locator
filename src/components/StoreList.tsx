"use client";
import type { Store } from "@/lib/types";
import StoreCard from "./StoreCard";

export default function StoreList({
  stores,
  selectedId,
  onSelect,
}: {
  stores: Store[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {stores.map((s) => (
        <StoreCard key={s.id} store={s} selected={s.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
