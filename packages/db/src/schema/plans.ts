import { relations } from "drizzle-orm";
import { pgTable, text, integer, uuid } from "drizzle-orm/pg-core";

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  price: integer("price").notNull(),
  interval: text("interval").notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
});

export const planTranslations = pgTable("plan_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  locale: text("locale").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const planRelations = relations(plans, ({ many }) => ({
  translations: many(planTranslations),
}));

export const planTranslationRelations = relations(
  planTranslations,
  ({ one }) => ({
    plan: one(plans, {
      fields: [planTranslations.planId],
      references: [plans.id],
    }),
  }),
);
