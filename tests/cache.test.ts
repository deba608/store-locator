import { describe, it, expect, vi } from "vitest";
import { TtlCache } from "../src/lib/cache";

describe("TtlCache", () => {
  it("returns stored value before ttl", () => {
    const c = new TtlCache<string>(1000);
    c.set("k", "v");
    expect(c.get("k")).toBe("v");
  });

  it("expires after ttl", () => {
    vi.useFakeTimers();
    const c = new TtlCache<string>(1000);
    c.set("k", "v");
    vi.advanceTimersByTime(1500);
    expect(c.get("k")).toBeUndefined();
    vi.useRealTimers();
  });

  it("returns undefined for missing key", () => {
    const c = new TtlCache<number>(1000);
    expect(c.get("missing")).toBeUndefined();
  });
});
