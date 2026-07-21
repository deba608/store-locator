import { describe, it, expect } from "vitest";
import { mapPlaceToStore, type GooglePlace } from "../src/lib/mapper";

const place: GooglePlace = {
  id: "abc123",
  displayName: { text: "MedPlus Pharmacy" },
  formattedAddress: "12 MG Road, Bengaluru 560001",
  location: { latitude: 12.975, longitude: 77.6 },
  rating: 4.3,
  userRatingCount: 210,
  nationalPhoneNumber: "080 1234 5678",
  websiteUri: "https://medplus.in",
  primaryTypeDisplayName: { text: "Pharmacy" },
  regularOpeningHours: {
    openNow: true,
    weekdayDescriptions: [
      "Monday: 9:00 AM – 9:00 PM",
      "Tuesday: 9:00 AM – 9:00 PM",
      "Wednesday: 9:00 AM – 9:00 PM",
      "Thursday: 9:00 AM – 9:00 PM",
      "Friday: 9:00 AM – 9:00 PM",
      "Saturday: 9:00 AM – 9:00 PM",
      "Sunday: Closed",
    ],
  },
};

describe("mapPlaceToStore", () => {
  const origin = { lat: 12.9716, lng: 77.5946 };

  it("maps all fields", () => {
    const s = mapPlaceToStore(place, origin);
    expect(s.name).toBe("MedPlus Pharmacy");
    expect(s.category).toBe("Pharmacy");
    expect(s.phone).toBe("080 1234 5678");
    expect(s.openNow).toBe(true);
    expect(s.rating).toBe(4.3);
    expect(s.reviewCount).toBe(210);
    expect(s.website).toBe("https://medplus.in");
    expect(s.distanceKm).toBeGreaterThan(0);
    expect(s.directionsUrl).toContain("google.com/maps/dir");
    expect(s.weekdayHours).toHaveLength(7);
    expect(s.hoursToday).toBeTruthy();
  });

  it("handles missing optional fields", () => {
    const bare: GooglePlace = {
      id: "x",
      displayName: { text: "Shop" },
      formattedAddress: "Somewhere",
      location: { latitude: 12.98, longitude: 77.6 },
    };
    const s = mapPlaceToStore(bare, origin);
    expect(s.phone).toBeNull();
    expect(s.openNow).toBeNull();
    expect(s.hoursToday).toBeNull();
    expect(s.rating).toBeNull();
    expect(s.website).toBeNull();
    expect(s.weekdayHours).toEqual([]);
    expect(s.category).toBe("Store");
  });
});
