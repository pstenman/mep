import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { Allergen } from "@mep/types";
import { relations } from "drizzle-orm";
import { menuItemAllergies } from "./menus";
import { users } from "./users";

export const allergies = pgTable("allergies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").$type<Allergen>().notNull().unique(),
  createdBy: uuid("created_by").references(() => users.id),
  updatedBy: uuid("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const allergiesRelations = relations(allergies, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [allergies.createdBy],
    references: [users.id],
    relationName: "createdBy",
  }),
  updatedByUser: one(users, {
    fields: [allergies.updatedBy],
    references: [users.id],
    relationName: "updatedBy",
  }),
  menuItemAllergies: many(menuItemAllergies),
}));
