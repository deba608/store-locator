import { describe, it, expect } from "vitest";
import { haversineKm } from "../src/lib/distance";

describe("haversineKm", () => {
  it("returns 0 for same point", () => {
    expect(haversineKm({ lat: 12.97, lng: 77.59 }, { lat: 12.97, lng: 77.59 })).toBe(0);
  });

  it("computes known distance (Bangalore to Chennai ~290km)", () => {
    const d = haversineKm({ lat: 12.9716, lng: 77.5946 }, { lat: 13.0827, lng: 80.2707 });
    expect(d).toBeGreaterThan(280);
    expect(d).toBeLessThan(300);
  });
});
