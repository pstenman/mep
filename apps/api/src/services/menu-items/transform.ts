import type { allergies, menuItems } from "@mep/db";
import type { Allergen } from "@mep/types";
import type { InferSelectModel } from "drizzle-orm";

export interface FormattedMenuItem {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  allergies: Allergen[];
}

export type RawMenuItemWithRelations = InferSelectModel<typeof menuItems> & {
  allergies?: { allergy: InferSelectModel<typeof allergies> }[];
};

export const transformMenuItem = (
  menuItem: RawMenuItemWithRelations,
): FormattedMenuItem => {
  return {
    id: menuItem.id,
    name: menuItem.name,
    category: menuItem.category ?? null,
    description: menuItem.description ?? null,
    allergies: menuItem.allergies?.map((a) => a.allergy.name as Allergen) ?? [],
  };
};

export const transformMenuItems = (
  menuItems: RawMenuItemWithRelations[],
): FormattedMenuItem[] => {
  return menuItems.map(transformMenuItem);
};
