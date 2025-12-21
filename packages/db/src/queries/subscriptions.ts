import { subscriptions } from "@/schema/subscriptions";
import { db, type Database } from "..";
import { eq } from "drizzle-orm";

type SubscriptionRow = typeof subscriptions.$inferSelect;
type SubscriptionInsert = typeof subscriptions.$inferInsert;

export const subscriptionQueries = {
  create: async (
    input: SubscriptionInsert,
    executor?: Database,
  ): Promise<SubscriptionRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(subscriptions).values(input).returning();
    return row[0];
  },

  update: async (
    stripeSubscriptionId: string,
    input: Partial<SubscriptionInsert>,
    executor?: Database,
  ): Promise<SubscriptionRow | null> => {
    const dbOrTx = executor ?? db;
    const rows = await dbOrTx
      .update(subscriptions)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
    return rows[0] ?? null;
  },

  findByStripeSubscriptionId: async (
    stripeSubscriptionId: string,
    executor?: Database,
  ): Promise<SubscriptionRow | null> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId),
    });
    return row ?? null;
  },

  findByCompanyId: async (
    companyId: string,
    executor?: Database,
  ): Promise<SubscriptionRow | null> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.query.subscriptions.findFirst({
      where: eq(subscriptions.companyId, companyId),
    });
    return row ?? null;
  },
};
