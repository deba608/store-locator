import { z } from "zod";

export const searchRequestSchema = z.object({
  query: z.string().trim().min(1).max(200),
  type: z.enum([
    "all",
    "pharmacy",
    "grocery",
    "electronics",
    "restaurant",
    "clothing",
    "bakery",
    "hospital",
    "bank_atm",
    "gym",
    "hardware",
    "bookstore",
    "furniture",
    "beauty_salon",
    "car_repair",
    "pet_store",
    "gas_station",
    "cafe",
  ]),
  radiusKm: z.number().min(2).max(20),
});
