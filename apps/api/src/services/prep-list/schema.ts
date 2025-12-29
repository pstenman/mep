import { PrepType } from "@mep/types";
import { z } from "zod";

export const updatePrepListSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuId: z.uuid().optional().nullable(),
  scheduleFor: z.coerce.date().optional().nullable(),
});

export const prepListFiltersSchema = z.object({
  search: z.string().optional(),
  scheduleFor: z.coerce.date().optional(),
  type: z.enum(Object.values(PrepType)).optional(),
});

export type UpdatePrepListSchema = z.infer<typeof updatePrepListSchema>;
export type PrepListFiltersSchema = z.infer<typeof prepListFiltersSchema>;
