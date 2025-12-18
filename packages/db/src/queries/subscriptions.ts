import { subscriptions } from "@/schema/subscriptions";
import { db } from "..";

type SubscriptionRow = typeof subscriptions.$inferSelect;
type SubscriptionInsert = typeof subscriptions.$inferInsert;

export const subscriptionQueries = {
  create: async (input: SubscriptionInsert): Promise<SubscriptionRow> => {
    const row = await db.insert(subscriptions).values(input).returning();

    return row[0];
  },
};
