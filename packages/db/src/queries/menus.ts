import { menus } from "@/schema/menus";
import { db, type Database } from "..";
import { and, eq, ilike } from "drizzle-orm";
import type { MenuType } from "@mep/types";

type MenuRow = typeof menus.$inferSelect;
type MenuInsert = typeof menus.$inferInsert;

export interface MenuFilters {
  companyId: string;
  search?: string;
  menuType?: MenuType;
}

export function buildMenuFilters(filters: MenuFilters) {
  const whereConditions = [];

  whereConditions.push(eq(menus.companyId, filters.companyId));

  if (filters.search?.trim()) {
    whereConditions.push(ilike(menus.name, `%${filters.search}%`));
  }

  if (filters.menuType) {
    whereConditions.push(eq(menus.menuType, filters.menuType));
  }

  return and(...whereConditions);
}

export const menuQueries = {
  getAll: async (filters: MenuFilters) => {
    const whereClauses = buildMenuFilters(filters);
    const rows = await db.query.menus.findMany({
      where: whereClauses,
      orderBy: (menus, { desc }) => [
        desc(menus.isActive),
        desc(menus.updatedAt),
      ],
      columns: {
        id: true,
        name: true,
        menuType: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        menuItems: {
          columns: {
            id: true,
            name: true,
            category: true,
            description: true,
          },
        },
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.menus.findFirst({
      where: eq(menus.id, id),
      with: {
        menuItems: {
          with: {
            allergies: {
              with: {
                allergy: true,
              },
            },
          },
        },
      },
    });
    return row;
  },

  getActive: async (companyId: string, menuType: MenuType) => {
    const row = await db.query.menus.findFirst({
      where: and(
        eq(menus.companyId, companyId),
        eq(menus.menuType, menuType),
        eq(menus.isActive, true),
      ),
      with: {
        menuItems: {
          with: {
            allergies: {
              with: {
                allergy: true,
              },
            },
          },
        },
      },
    });
    return row;
  },

  create: async (input: MenuInsert, executor?: Database): Promise<MenuRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(menus).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<MenuInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<MenuRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(menus)
      .set({ ...input, updatedAt })
      .where(eq(menus.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(menus).where(eq(menus.id, id));
  },

  setActive: async (
    menuId: string,
    companyId: string,
    menuType: MenuType,
    executor?: Database,
  ) => {
    const dbOrTx = executor ?? db;
    return await dbOrTx.transaction(async (tx) => {
      await tx
        .update(menus)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(eq(menus.companyId, companyId), eq(menus.menuType, menuType)),
        );
      const updated = await tx
        .update(menus)
        .set({ isActive: true, updatedAt: new Date() })
        .where(and(eq(menus.id, menuId), eq(menus.companyId, companyId)))
        .returning();

      return updated[0];
    });
  },
};
