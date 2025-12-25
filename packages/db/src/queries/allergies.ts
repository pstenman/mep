import { allergies } from "@/schema/allergies";
import { db, type Database } from "..";
import { and, eq, ilike } from "drizzle-orm";

type AllergyRow = typeof allergies.$inferSelect;
type AllergyInsert = typeof allergies.$inferInsert;

export interface AllergyFilters {
  companyId: string;
  search?: string;
}

export function buildAllergyFilters(filters: AllergyFilters) {
  const whereConditions = [];

  whereConditions.push(eq(allergies.companyId, filters.companyId));

  if (filters.search?.trim()) {
    whereConditions.push(ilike(allergies.name, `%${filters.search}%`));
  }

  return and(...whereConditions);
}

export const allergyQueries = {
  getAll: async (filters: AllergyFilters) => {
    const whereClauses = buildAllergyFilters(filters);
    const rows = await db.query.allergies.findMany({
      where: whereClauses,
      orderBy: (allergies, { asc }) => [asc(allergies.name)],
      columns: {
      id: true,
      name: true,
    },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.allergies.findFirst({
      where: eq(allergies.id, id),
    });
    return row;
  },

  create: async (input: AllergyInsert, executor?: Database): Promise<AllergyRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(allergies).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<AllergyInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<AllergyRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(allergies)
      .set({ ...input, updatedAt })
      .where(eq(allergies.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(allergies).where(eq(allergies.id, id));
  },
};

