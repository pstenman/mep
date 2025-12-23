import { prepItems } from "@/schema/preparations";
import { db, type Database } from "..";
import { and, eq, ilike } from "drizzle-orm";
import type { PrepStatus } from "@mep/types";

type PrepItemRow = typeof prepItems.$inferSelect;
type PrepItemInsert = typeof prepItems.$inferInsert;

export interface PrepItemFilters {
  companyId: string;
  prepGroupId?: string;
  status?: PrepStatus;
  search?: string;
}

export function buildPrepItemFilters(filters: PrepItemFilters) {
  const whereConditions = [];

  whereConditions.push(eq(prepItems.companyId, filters.companyId));

  if (filters.prepGroupId) {
    whereConditions.push(eq(prepItems.prepGroupId, filters.prepGroupId));
  }

  if (filters.status) {
    whereConditions.push(eq(prepItems.status, filters.status));
  }

  if (filters.search?.trim()) {
    whereConditions.push(ilike(prepItems.name, `%${filters.search}%`));
  }

  return and(...whereConditions);
}

export const prepItemQueries = {
  getAll: async (filters: PrepItemFilters) => {
    const whereClauses = buildPrepItemFilters(filters);
    const rows = await db.query.prepItems.findMany({
      where: whereClauses,
      orderBy: (prepItems, { asc, desc }) => [
        desc(prepItems.status),
        asc(prepItems.createdAt),
      ],
      with: {
        company: true,
        prepGroup: true,
        recipe: true,
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.prepItems.findFirst({
      where: eq(prepItems.id, id),
      with: {
        company: true,
        prepGroup: true,
        recipe: true,
      },
    });
    return row;
  },

  create: async (input: PrepItemInsert, executor?: Database): Promise<PrepItemRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(prepItems).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<PrepItemInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<PrepItemRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(prepItems)
      .set({ ...input, updatedAt })
      .where(eq(prepItems.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(prepItems).where(eq(prepItems.id, id));
  },
};

