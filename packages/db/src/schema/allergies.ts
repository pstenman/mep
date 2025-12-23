import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";
import type { Allergen } from "@mep/types";
import { relations } from "drizzle-orm";

export const allergies = pgTable("allergies", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  name: text("name").$type<Allergen>().notNull(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const allergiesRelations = relations(allergies, ({ one }) => ({
  company: one(companies, { fields: [allergies.companyId], references: [companies.id] }),
  createdBy: one(users, { fields: [allergies.createdBy], references: [users.id] }),
  updatedBy: one(users, { fields: [allergies.updatedBy], references: [users.id] }),
}));