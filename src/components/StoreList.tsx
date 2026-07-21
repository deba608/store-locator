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
    <div className="divide-y divide-neutral-100">
      {stores.map((s, i) => (
        <StoreCard
          key={s.id}
          store={s}
          index={i}
          selected={s.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
