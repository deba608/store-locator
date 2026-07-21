import { describe, it, expect } from "vitest";
import { searchRequestSchema } from "../src/lib/validation";

describe("searchRequestSchema", () => {
  it("accepts valid input", () => {
    const r = searchRequestSchema.safeParse({ query: "560001", type: "pharmacy", radiusKm: 5 });
    expect(r.success).toBe(true);
  });

  it("rejects empty query", () => {
    expect(searchRequestSchema.safeParse({ query: "  ", type: "pharmacy", radiusKm: 5 }).success).toBe(false);
  });

  it("rejects bad type", () => {
    expect(searchRequestSchema.safeParse({ query: "x", type: "bank", radiusKm: 5 }).success).toBe(false);
  });

  it("rejects radius out of range", () => {
    expect(searchRequestSchema.safeParse({ query: "x", type: "grocery", radiusKm: 25 }).success).toBe(false);
    expect(searchRequestSchema.safeParse({ query: "x", type: "grocery", radiusKm: 1 }).success).toBe(false);
  });
});
