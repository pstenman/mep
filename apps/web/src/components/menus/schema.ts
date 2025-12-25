import { MenuCategory, MenuType } from "@mep/types";
import { z } from "zod";

export const menuFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("name.required")),
  menuType: z.enum(Object.values(MenuType)),
  isActive: z.boolean().optional(),
  menuItems: z.array(z.object({
    name: z.string().min(1, t("name.required")),
    category: z.enum(Object.values(MenuCategory)),
    description: z.string(),
    allergies: z.array(z.string().uuid()),
  })),
});

export type MenuFormSchema = z.infer<ReturnType<typeof menuFormSchema>>;