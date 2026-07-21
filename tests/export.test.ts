import { describe, expect, it } from "vitest";
import { exportFilename, storesToCsv, storesToRows } from "../src/lib/export";
import type { Store } from "../src/lib/types";

const store: Store = {
  id: "1",
  name: "Shop, \"Central\"",
  category: "Grocery",
  address: "1 Main Street\nBengaluru",
  location: { lat: 12.97, lng: 77.59 },
  distanceKm: 1.2,
  phone: null,
  openNow: true,
  hoursToday: "Monday: 9 AM - 9 PM",
  weekdayHours: [],
  rating: 4.5,
  reviewCount: 10,
  website: "https://example.com",
  directionsUrl: "https://maps.example.com",
};

describe("store exports", () => {
  it("maps store fields to a spreadsheet row", () => {
    expect(storesToRows([store])[0]).toEqual([
      'Shop, "Central"',
      "Grocery",
      "1 Main Street\nBengaluru",
      1.2,
      "",
      "Yes",
      "Monday: 9 AM - 9 PM",
      4.5,
      10,
      "https://example.com",
      "https://maps.example.com",
      12.97,
      77.59,
    ]);
  });

  it("quotes CSV cells containing commas, quotes, or newlines", () => {
    const csv = storesToCsv([store]);
    expect(csv).toContain('"Shop, ""Central"""');
    expect(csv).toContain('"1 Main Street\nBengaluru"');
  });

  it("creates a safe location-based filename", () => {
    expect(exportFilename("MG Road, Bengaluru", "xlsx")).toBe(
      "stores-mg-road-bengaluru.xlsx",
    );
  });

  it("neutralizes spreadsheet formulas", () => {
    expect(storesToRows([{ ...store, name: "=1+1" }])[0][0]).toBe("'=1+1");
  });
});
