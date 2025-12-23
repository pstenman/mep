import { z } from "zod";

export const createPrepGroupSchema = z.object({
  name: z.string().min(1),
  menuItemId: z.string().uuid().optional(),
  prepTypes: z.string().optional(),
  note: z.string().optional(),
});

export const updatePrepGroupSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuItemId: z.string().uuid().optional().nullable(),
  prepTypes: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export const prepGroupFiltersSchema = z.object({
  search: z.string().optional(),
});

export type CreatePrepGroupSchema = z.infer<typeof createPrepGroupSchema>;
export type UpdatePrepGroupSchema = z.infer<typeof updatePrepGroupSchema>;
export type PrepGroupFiltersSchema = z.infer<typeof prepGroupFiltersSchema>;

