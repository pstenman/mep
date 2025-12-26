import { z } from "zod";

export const createPrepGroupSchema = z.object({
  name: z.string().min(1),
  prepListId: z.uuid(),
  menuItemId: z.uuid().optional(),
  note: z.string().optional(),
});

export const updatePrepGroupSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuItemId: z.uuid().optional().nullable(),
  note: z.string().optional().nullable(),
});

export const prepGroupFiltersSchema = z.object({
  prepListId: z.uuid(),
  search: z.string().optional(),
});

export type CreatePrepGroupSchema = z.infer<typeof createPrepGroupSchema>;
export type UpdatePrepGroupSchema = z.infer<typeof updatePrepGroupSchema>;
export type PrepGroupFiltersSchema = z.infer<typeof prepGroupFiltersSchema>;
