import { relations } from "drizzle-orm";
import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";
import { subscriptions } from "./subscriptions";

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  interval: text("interval").notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
});

export const planRelations = relations(plans, ({ one }) => ({
  subscriptions: one(subscriptions, {
    fields: [plans.id],
    references: [subscriptions.planId],
  }),
}));