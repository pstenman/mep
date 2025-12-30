import { orders } from "@/schema/orders";
import { db, type Database } from "..";
import { eq } from "drizzle-orm";

type OrderRow = typeof orders.$inferSelect;
type OrderInsert = typeof orders.$inferInsert;

export interface OrderFilters {
  companyId: string;
}

export function buildOrderFilters(filters: OrderFilters) {
  return eq(orders.companyId, filters.companyId);
}

export const orderQueries = {
  getAll: async (filters: OrderFilters) => {
    const whereClauses = buildOrderFilters(filters);
    const rows = await db.query.orders.findMany({
      where: whereClauses,
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      with: {
        company: true,
        createdBy: true,
        updatedBy: true,
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        company: true,
        createdBy: true,
        updatedBy: true,
      },
    });
    return row;
  },

  create: async (
    input: OrderInsert,
    executor?: Database,
  ): Promise<OrderRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(orders).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<OrderInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<OrderRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(orders)
      .set({ ...input, updatedAt })
      .where(eq(orders.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database): Promise<void> => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(orders).where(eq(orders.id, id));
  },
};
