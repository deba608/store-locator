import type { Store } from "./types";

export const EXPORT_HEADERS = [
  "Name",
  "Category",
  "Address",
  "Distance (km)",
  "Phone",
  "Open now",
  "Hours today",
  "Rating",
  "Review count",
  "Website",
  "Directions",
  "Latitude",
  "Longitude",
] as const;

type ExportCell = string | number;

function safeText(value: string | null): string {
  if (!value) return "";
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

export function storesToRows(stores: Store[]): ExportCell[][] {
  return stores.map((store) => [
    safeText(store.name),
    safeText(store.category),
    safeText(store.address),
    store.distanceKm,
    safeText(store.phone),
    store.openNow === null ? "Unknown" : store.openNow ? "Yes" : "No",
    safeText(store.hoursToday),
    store.rating ?? "",
    store.reviewCount ?? "",
    safeText(store.website),
    safeText(store.directionsUrl),
    store.location.lat,
    store.location.lng,
  ]);
}

function csvCell(value: ExportCell): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function storesToCsv(stores: Store[]): string {
  return [EXPORT_HEADERS, ...storesToRows(stores)]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
}

export function exportFilename(resolvedAddress: string, extension: "csv" | "xlsx"): string {
  const location = resolvedAddress
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 50);
  return `stores-${location || "results"}.${extension}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
