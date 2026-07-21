import { z } from "zod";

export const searchRequestSchema = z.object({
  query: z.string().trim().min(1).max(200),
  type: z.enum(["pharmacy", "grocery", "electronics", "restaurant", "clothing"]),
  radiusKm: z.number().min(2).max(20),
});
