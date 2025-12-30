import { menuItemAllergies } from "@/schema/menus";
import { db, type Database } from "..";
import { eq } from "drizzle-orm";

type MenuItemAllergyRow = typeof menuItemAllergies.$inferSelect;
type MenuItemAllergyInsert = typeof menuItemAllergies.$inferInsert;

export interface MenuItemAllergyFilters {
  companyId: string;
  menuItemId?: string;
  allergyId?: string;
}

export const menuItemAllergyQueries = {
  create: async (
    input: MenuItemAllergyInsert,
    executor?: Database,
  ): Promise<MenuItemAllergyRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx
      .insert(menuItemAllergies)
      .values(input)
      .returning();
    return row[0];
  },

  createMany: async (
    inputs: MenuItemAllergyInsert[],
    executor?: Database,
  ): Promise<MenuItemAllergyRow[]> => {
    const dbOrTx = executor ?? db;
    if (inputs.length === 0) return [];
    const rows = await dbOrTx
      .insert(menuItemAllergies)
      .values(inputs)
      .returning();
    return rows;
  },

  deleteByMenuItemId: async (
    menuItemId: string,
    executor?: Database,
  ): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx
      .delete(menuItemAllergies)
      .where(eq(menuItemAllergies.menuItemId, menuItemId));
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(menuItemAllergies).where(eq(menuItemAllergies.id, id));
  },
};
