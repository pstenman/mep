import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";
import { recipes } from "./recipes";
import { PrepStatus } from "@mep/types";
import { relations } from "drizzle-orm";
import { menuItems } from "./menus";

export const prepGroups = pgTable("prep_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  menuItemId: uuid("menu_item_id").references(() => menuItems.id),
  prepTypes: text(),
  name: text("name").notNull(),
  note: text("note"), 
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepItems = pgTable("prep_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  prepGroupId: uuid("prep_group_id").references(() => prepGroups.id),
  recipeId: uuid("recipe_id").references(() => recipes.id),
  name: text("name").notNull(),
  status: text("status").$type<PrepStatus>().notNull().default(PrepStatus.NONE),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepGroupsRelations = relations(prepGroups, ({ many, one }) => ({
  company: one(companies, { fields: [prepGroups.companyId], references: [companies.id] }),
  menuItem: one(menuItems, { fields: [prepGroups.menuItemId], references: [menuItems.id] }),
  prepItems: many(prepItems),
}));

export const prepItemsRelations = relations(prepItems, ({ one }) => ({
  company: one(companies, { fields: [prepItems.companyId], references: [companies.id] }),
  prepGroup: one(prepGroups, { fields: [prepItems.prepGroupId], references: [prepGroups.id] }),
  recipe: one(recipes, { fields: [prepItems.recipeId], references: [recipes.id] }),
}));

