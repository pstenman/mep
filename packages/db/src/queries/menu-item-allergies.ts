import { menuItemAllergies } from "@/schema/menus";
import { db, type Database } from "..";
import { and, eq } from "drizzle-orm";

type MenuItemAllergyRow = typeof menuItemAllergies.$inferSelect;
type MenuItemAllergyInsert = typeof menuItemAllergies.$inferInsert;

export interface MenuItemAllergyFilters {
  companyId: string;
  menuItemId?: string;
  allergyId?: string;
}

export function buildMenuItemAllergyFilters(filters: MenuItemAllergyFilters) {
  const whereConditions = [];

  whereConditions.push(eq(menuItemAllergies.companyId, filters.companyId));

  if (filters.menuItemId) {
    whereConditions.push(eq(menuItemAllergies.menuItemId, filters.menuItemId));
  }

  if (filters.allergyId) {
    whereConditions.push(eq(menuItemAllergies.allergyId, filters.allergyId));
  }

  return and(...whereConditions);
}

export const menuItemAllergyQueries = {
  getAll: async (filters: MenuItemAllergyFilters) => {
    const whereClauses = buildMenuItemAllergyFilters(filters);
    const rows = await db.query.menuItemAllergies.findMany({
      where: whereClauses,
      with: {
        company: true,
        menuItem: true,
        allergy: true,
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.menuItemAllergies.findFirst({
      where: eq(menuItemAllergies.id, id),
      with: {
        company: true,
        menuItem: true,
        allergy: true,
      },
    });
    return row;
  },

  create: async (input: MenuItemAllergyInsert, executor?: Database): Promise<MenuItemAllergyRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(menuItemAllergies).values(input).returning();
    return row[0];
  },

  createMany: async (inputs: MenuItemAllergyInsert[], executor?: Database): Promise<MenuItemAllergyRow[]> => {
    const dbOrTx = executor ?? db;
    if (inputs.length === 0) return [];
    const rows = await dbOrTx.insert(menuItemAllergies).values(inputs).returning();
    return rows;
  },

  deleteByMenuItemId: async (menuItemId: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(menuItemAllergies).where(eq(menuItemAllergies.menuItemId, menuItemId));
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(menuItemAllergies).where(eq(menuItemAllergies.id, id));
  },
};

