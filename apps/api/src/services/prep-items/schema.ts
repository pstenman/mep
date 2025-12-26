import { PrepStatus } from "@mep/types";
import { z } from "zod";

export const createPrepItemSchema = z.object({
  name: z.string().min(1),
  prepGroupId: z.uuid(),
  recipeId: z.uuid().optional(),
  status: z.enum(Object.values(PrepStatus)).optional(),
});

export const updatePrepItemSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  recipeId: z.uuid().optional().nullable(),
  status: z.enum(Object.values(PrepStatus)).optional(),
});

export const prepItemFiltersSchema = z.object({
  prepGroupId: z.uuid(),
  search: z.string().optional(),
  status: z.enum(Object.values(PrepStatus)).optional(),
});

export type CreatePrepItemSchema = z.infer<typeof createPrepItemSchema>;
export type UpdatePrepItemSchema = z.infer<typeof updatePrepItemSchema>;
export type PrepItemFiltersSchema = z.infer<typeof prepItemFiltersSchema>;
