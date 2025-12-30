import { z } from "zod";

const menuItemSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  description: z.string().optional(),
  allergyIds: z.array(z.uuid()).optional(),
});

export const createMenuSchema = z.object({
  name: z.string().min(1),
  menuType: z.string().optional(),
  isActive: z.boolean().optional(),
  menuItems: z.array(menuItemSchema).optional(),
});

export const updateMenuSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  menuType: z.string().optional(),
  isActive: z.boolean().optional(),
  menuItems: z.array(menuItemSchema).optional(),
});

export const menuFiltersSchema = z.object({
  search: z.string().optional(),
  menuType: z.string().optional(),
});

export type CreateMenuSchema = z.infer<typeof createMenuSchema>;
export type UpdateMenuSchema = z.infer<typeof updateMenuSchema>;
export type MenuFiltersSchema = z.infer<typeof menuFiltersSchema>;
