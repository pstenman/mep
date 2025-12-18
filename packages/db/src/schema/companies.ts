import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { memberships } from "./memberships";
import { subscriptions } from "./subscriptions";
import { CompanyStatus } from "@mep/types";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  status: text("status")
    .$type<CompanyStatus>()
    .notNull()
    .default(CompanyStatus.PENDING),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const companiesRelations = relations(companies, ({ many }) => ({
  memberships: many(memberships),
  subscriptions: many(subscriptions),
}));
