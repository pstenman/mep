import { Allergen } from "@mep/types";
import { z } from "zod";

export const createAllergySchema = z.object({
  name: z.enum(Object.values(Allergen)),
});

export const updateAllergySchema = z.object({
  id: z.uuid(),
  name: z.enum(Object.values(Allergen)).optional(),
});

export const allergyFiltersSchema = z.object({
  search: z.string().optional(),
});

export type CreateAllergySchema = z.infer<typeof createAllergySchema>;
export type UpdateAllergySchema = z.infer<typeof updateAllergySchema>;
export type AllergyFiltersSchema = z.infer<typeof allergyFiltersSchema>;
