import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { Allergen } from "@mep/types";
import { relations } from "drizzle-orm";
import { menuItemAllergies } from "./menus";

export const allergies = pgTable("allergies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").$type<Allergen>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const allergiesRelations = relations(allergies, ({ many }) => ({
  menuItemAllergies: many(menuItemAllergies),
}));