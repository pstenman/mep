import { MenuCategory, MenuType } from "@mep/types";
import { z } from "zod";

export const menuFormSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("name.required")),
  menuType: z.enum(Object.values(MenuType)).optional().default(MenuType.ALACARTE),
  menuItems: z.array(z.object({
    name: z.string().min(1, t("name.required")),
    category: z.enum(Object.values(MenuCategory)).optional(),
    description: z.string().optional(),
  })),
})

export type MenuFormSchema = z.infer<typeof menuFormSchema>;