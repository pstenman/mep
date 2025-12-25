import { menuItems } from "@/schema/menus";
import { db, type Database } from "..";
import { and, eq, ilike } from "drizzle-orm";
import type { MenuCategory } from "@mep/types";

export type MenuItemRow = typeof menuItems.$inferSelect;
export type MenuItemInsert = typeof menuItems.$inferInsert;

export interface MenuItemFilters {
  companyId: string;
  menuId?: string;
  category?: MenuCategory;
  search?: string;
}

export function buildMenuItemFilters(filters: MenuItemFilters) {
  const whereConditions = [];

  whereConditions.push(eq(menuItems.companyId, filters.companyId));

  if (filters.menuId) {
    whereConditions.push(eq(menuItems.menuId, filters.menuId));
  }

  if (filters.category) {
    whereConditions.push(eq(menuItems.category, filters.category));
  }

  if (filters.search?.trim()) {
    whereConditions.push(ilike(menuItems.name, `%${filters.search}%`));
  }

  return and(...whereConditions);
}

export const menuItemQueries = {
  getAll: async (filters: MenuItemFilters) => {
    const whereClauses = buildMenuItemFilters(filters);
    const rows = await db.query.menuItems.findMany({
      where: whereClauses,
      orderBy: (menuItems, { asc }) => [asc(menuItems.name)],
      with: {
        allergies: { with: { allergy: true } },
        prepGroups: true,
        menu: { columns: { id: true, name: true } },
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.menuItems.findFirst({
      where: eq(menuItems.id, id),
      with: {
        menu: true,
        prepGroups: true,
        allergies: {
          with: {
            allergy: true,
          },
        },
      },
    });
    return row;
  },

  create: async (
    input: MenuItemInsert,
    executor?: Database,
  ): Promise<MenuItemRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(menuItems).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<MenuItemInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<MenuItemRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(menuItems)
      .set({ ...input, updatedAt })
      .where(eq(menuItems.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(menuItems).where(eq(menuItems.id, id));
  },
};
