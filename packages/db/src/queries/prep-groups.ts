import { prepGroups } from "@/schema/preparations";
import { db, type Database } from "..";
import { and, eq, ilike } from "drizzle-orm";

type PrepGroupRow = typeof prepGroups.$inferSelect;
type PrepGroupInsert = typeof prepGroups.$inferInsert;

export interface PrepGroupFilters {
  companyId: string;
  search?: string;
}

export function buildPrepGroupFilters(filters: PrepGroupFilters) {
  const whereConditions = [];

  whereConditions.push(eq(prepGroups.companyId, filters.companyId));

  if (filters.search?.trim()) {
    whereConditions.push(ilike(prepGroups.name, `%${filters.search}%`));
  }

  return and(...whereConditions);
}

export const prepGroupQueries = {
  getAll: async (filters: PrepGroupFilters) => {
    const whereClauses = buildPrepGroupFilters(filters);
    const rows = await db.query.prepGroups.findMany({
      where: whereClauses,
      orderBy: (prepGroups, { asc }) => [asc(prepGroups.name)],
      with: {
        company: true,
        menuItem: true,
        prepItems: true,
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.prepGroups.findFirst({
      where: eq(prepGroups.id, id),
      with: {
        company: true,
        menuItem: true,
        prepItems: true,
      },
    });
    return row;
  },

  create: async (input: PrepGroupInsert, executor?: Database): Promise<PrepGroupRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(prepGroups).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<PrepGroupInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<PrepGroupRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(prepGroups)
      .set({ ...input, updatedAt })
      .where(eq(prepGroups.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(prepGroups).where(eq(prepGroups.id, id));
  },
};

