import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { prepGroups } from "./preparations";
import { MenuType } from "@mep/types";
import type { MenuCategory } from "@mep/types/types/menus.js";
import { allergies } from "./allergies";

export const menus = pgTable("menus", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  menuType: text().$type<MenuType>().notNull().default(MenuType.BREAKFAST),
  name: text("name").notNull(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});



export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  menuId: uuid("menu_id").references(() => menus.id),
  category: text("category").$type<MenuCategory>(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const menuItemAllergies = pgTable("menu_item_allergies", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  menuItemId: uuid("menu_item_id").notNull().references(() => menuItems.id, { onDelete: "cascade" }),
  allergyId: uuid("allergy_id").notNull().references(() => allergies.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  company: one(companies, { fields: [menuItems.companyId], references: [companies.id] }),
  menu: one(menus, { fields: [menuItems.menuId], references: [menus.id] }),
  prepGroups: many(prepGroups),
  allergies: many(menuItemAllergies),
}));

export const menusRelations = relations(menus, ({ one, many }) => ({
  company: one(companies, { fields: [menus.companyId], references: [companies.id] }),
  menuItems: many(menuItems),
}));

export const menuItemAllergiesRelations = relations(menuItemAllergies, ({ one }) => ({
  company: one(companies, { fields: [menuItemAllergies.companyId], references: [companies.id] }),
  menuItem: one(menuItems, { fields: [menuItemAllergies.menuItemId], references: [menuItems.id] }),
  allergy: one(allergies, { fields: [menuItemAllergies.allergyId], references: [allergies.id] }),
}));
