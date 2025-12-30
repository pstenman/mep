import { recipes } from "@/schema/recipes";
import { db, type Database } from "..";
import { and, eq, ilike } from "drizzle-orm";

type RecipeRow = typeof recipes.$inferSelect;
type RecipeInsert = typeof recipes.$inferInsert;

export interface RecipeFilters {
  companyId: string;
  search?: string;
}

export function buildRecipeFilters(filters: RecipeFilters) {
  const whereConditions = [];

  whereConditions.push(eq(recipes.companyId, filters.companyId));

  if (filters.search?.trim()) {
    whereConditions.push(ilike(recipes.name, `%${filters.search}%`));
  }

  return and(...whereConditions);
}

export const recipeQueries = {
  getAll: async (filters: RecipeFilters) => {
    const whereClauses = buildRecipeFilters(filters);
    const rows = await db.query.recipes.findMany({
      where: whereClauses,
      orderBy: (recipes, { asc }) => [asc(recipes.name)],
      with: {
        company: true,
        createdBy: true,
        updatedBy: true,
        prepItems: true,
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.recipes.findFirst({
      where: eq(recipes.id, id),
      with: {
        company: true,
        createdBy: true,
        updatedBy: true,
        prepItems: true,
      },
    });
    return row;
  },

  create: async (
    input: RecipeInsert,
    executor?: Database,
  ): Promise<RecipeRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(recipes).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<RecipeInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<RecipeRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(recipes)
      .set({ ...input, updatedAt })
      .where(eq(recipes.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(recipes).where(eq(recipes.id, id));
  },
};
