import { z } from "zod";

export const createMenuSchema = z.object({
  name: z.string().min(1),
  menuType: z.string().optional(),
});

export const updateMenuSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuType: z.string().optional(),
});

export const menuFiltersSchema = z.object({
  search: z.string().optional(),
});

export type CreateMenuSchema = z.infer<typeof createMenuSchema>;
export type UpdateMenuSchema = z.infer<typeof updateMenuSchema>;
export type MenuFiltersSchema = z.infer<typeof menuFiltersSchema>;

