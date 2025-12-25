import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z.string().min(1),
  menuId: z.uuid().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  allergyIds: z.array(z.uuid()).optional(),
});

export const updateMenuItemSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuId: z.uuid().optional().nullable(),
  category: z.string().optional().nullable(),
});

export const menuItemFiltersSchema = z.object({
  search: z.string().optional(),
  menuId: z.uuid().optional(),
  category: z.string().optional(),
});

export type CreateMenuItemSchema = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemSchema = z.infer<typeof updateMenuItemSchema>;
export type MenuItemFiltersSchema = z.infer<typeof menuItemFiltersSchema>;

