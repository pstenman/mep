import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { prepGroups } from "./preparations";

export const menus = pgTable("menus", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  menuType: text(),
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
  category: text("category"),
  name: text("name").notNull(),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  company: one(companies, { fields: [menuItems.companyId], references: [companies.id] }),
  menu: one(menus, { fields: [menuItems.menuId], references: [menus.id] }),
  prepGroups: many(prepGroups, { relationName: "prepGroups" }),
}));

export const menusRelations = relations(menus, ({ one, many }) => ({
  company: one(companies, { fields: [menus.companyId], references: [companies.id] }),
  menuItems: many(menuItems, { relationName: "menuItems" }),
}));
