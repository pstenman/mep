import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { memberships } from "./memberships";
import { subscriptions } from "./subscriptions";
import { CompanyStatus } from "@mep/types";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  companyRegistrationNumber: text("company_registration_number")
    .notNull()
    .unique(),
  status: text("status")
    .$type<CompanyStatus>()
    .notNull()
    .default(CompanyStatus.PENDING),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const companySidebarSettings = pgTable("company_sidebar_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  settings: jsonb("settings").notNull().$type<{
    hiddenItemIds: string[];
  }>().default({
    hiddenItemIds: [],
  }),
});

export const companiesRelations = relations(companies, ({ many, one }) => ({
  memberships: many(memberships),
  subscriptions: many(subscriptions),
  sidebarSettings: one(companySidebarSettings, {
    fields: [companies.id],
    references: [companySidebarSettings.companyId],
  }),
}));

export const companySidebarSettingsRelations = relations(companySidebarSettings, ({ one }) => ({
  company: one(companies, {
    fields: [companySidebarSettings.companyId],
    references: [companies.id],
  }),
}));
