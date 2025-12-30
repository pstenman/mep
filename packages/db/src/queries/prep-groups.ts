import { prepGroups } from "@/schema/preparations";
import { db, type Database } from "..";
import { and, eq, ilike } from "drizzle-orm";

type PrepGroupInsert = typeof prepGroups.$inferInsert;

export interface PrepGroupFilters {
  prepListId?: string;
  companyId?: string;
  search?: string;
}

export function buildPrepGroupFilters(filters: PrepGroupFilters) {
  const whereConditions = [];

  if (filters.prepListId) {
    whereConditions.push(eq(prepGroups.prepListId, filters.prepListId));
  }

  if (filters.companyId) {
    whereConditions.push(eq(prepGroups.companyId, filters.companyId));
  }

  if (filters.search?.trim()) {
    whereConditions.push(ilike(prepGroups.name, `%${filters.search}%`));
  }

  return whereConditions.length > 0 ? and(...whereConditions) : undefined;
}

export const prepGroupQueries = {
  getAll: async (filters: PrepGroupFilters) => {
    const rows = await db.query.prepGroups.findMany({
      where: buildPrepGroupFilters(filters),
      orderBy: (pg, { asc }) => [asc(pg.name)],
      with: {
        prepItems: true,
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.prepGroups.findFirst({
      where: eq(prepGroups.id, id),
      with: {
        prepItems: true,
      },
    });
    return row;
  },

  create: async (input: PrepGroupInsert, executor?: Database) => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(prepGroups).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<PrepGroupInsert, "id" | "prepListId" | "createdAt">>,
    executor?: Database,
  ) => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(prepGroups)
      .set({ ...input, updatedAt })
      .where(eq(prepGroups.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database) => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(prepGroups).where(eq(prepGroups.id, id));
  },
};
