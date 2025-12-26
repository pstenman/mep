import { PrepType } from "@mep/types";
import { z } from "zod";

const prepItemSchema = z.object({
  name: z.string().min(1),
  recipeId: z.uuid().optional(),
});

const prepGroupSchema = z.object({
  name: z.string().min(1),
  note: z.string().optional(),
  items: z.array(prepItemSchema),
});

export const createPrepListSchema = z.object({
  name: z.string().min(1),
  menuId: z.uuid().optional(),
  prepTypes: z.enum(Object.values(PrepType)),
  date: z.coerce.date(),
  isActive: z.boolean().optional(),
  isTemplate: z.boolean().optional(),
  groups: z.array(prepGroupSchema).optional(),
});

export const updatePrepListSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuId: z.uuid().optional().nullable(),
  prepTypes: z.enum(PrepType).optional(),
  date: z.coerce.date().optional(),
  isActive: z.boolean().optional(),
});

export const prepListFiltersSchema = z.object({
  search: z.string().optional(),
  date: z.coerce.date().optional(),
  type: z.enum(Object.values(PrepType)).optional(),
  isActive: z.boolean().optional(),
});

export type CreatePrepListSchema = z.infer<typeof createPrepListSchema>;
export type UpdatePrepListSchema = z.infer<typeof updatePrepListSchema>;
export type PrepListFiltersSchema = z.infer<typeof prepListFiltersSchema>;
