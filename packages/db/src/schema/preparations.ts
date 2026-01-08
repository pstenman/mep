import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";
import { recipes } from "./recipes";
import { PrepStatus, PrepType } from "@mep/types";
import { relations } from "drizzle-orm";
import { menuItems, menus } from "./menus";

export const prepListTemplates = pgTable("prep_list_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  menuId: uuid("menu_id").references(() => menus.id),
  isActive: boolean("is_active").notNull().default(false),
  prepTypes: text("prep_types")
    .$type<PrepType>()
    .notNull()
    .default(PrepType.BREAKFAST),
  name: text("name").notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepGroupTemplates = pgTable("prep_group_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  prepListTemplateId: uuid("prep_list_template_id").references(
    () => prepListTemplates.id,
  ),
  menuItemId: uuid("menu_item_id").references(() => menuItems.id),
  name: text("name").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepItemsTemplates = pgTable("prep_items_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  prepGroupTemplateId: uuid("prep_group_template_id").references(
    () => prepGroupTemplates.id,
  ),
  recipeId: uuid("recipe_id").references(() => recipes.id),
  name: text("name").notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepLists = pgTable("prep_lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  prepListTemplateId: uuid("prep_list_template_id")
    .notNull()
    .references(() => prepListTemplates.id),
  menuId: uuid("menu_id").references(() => menus.id),
  name: text("name").notNull(),
  scheduleFor: timestamp("schedule_for").notNull().defaultNow(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepGroups = pgTable("prep_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  prepListId: uuid("prep_list_id")
    .notNull()
    .references(() => prepLists.id),
  menuItemId: uuid("menu_item_id").references(() => menuItems.id),
  name: text("name").notNull(),
  note: text("note"),
  notes: jsonb("notes")
    .$type<
      {
        id: string;
        message: string;
        createdBy: string;
        createdAt: string;
      }[]
    >()
    .default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepItems = pgTable("prep_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  prepGroupId: uuid("prep_group_id")
    .notNull()
    .references(() => prepGroups.id),
  recipeId: uuid("recipe_id").references(() => recipes.id),
  name: text("name").notNull(),
  status: text("status").$type<PrepStatus>().notNull().default(PrepStatus.NONE),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const prepGroupsRelations = relations(prepGroups, ({ many, one }) => ({
  company: one(companies, {
    fields: [prepGroups.companyId],
    references: [companies.id],
  }),
  menuItem: one(menuItems, {
    fields: [prepGroups.menuItemId],
    references: [menuItems.id],
  }),
  prepList: one(prepLists, {
    fields: [prepGroups.prepListId],
    references: [prepLists.id],
  }),
  prepItems: many(prepItems),
}));

export const prepItemsRelations = relations(prepItems, ({ one }) => ({
  company: one(companies, {
    fields: [prepItems.companyId],
    references: [companies.id],
  }),
  prepGroup: one(prepGroups, {
    fields: [prepItems.prepGroupId],
    references: [prepGroups.id],
  }),
  recipe: one(recipes, {
    fields: [prepItems.recipeId],
    references: [recipes.id],
  }),
}));

export const prepListsRelations = relations(prepLists, ({ one, many }) => ({
  company: one(companies, {
    fields: [prepLists.companyId],
    references: [companies.id],
  }),
  menu: one(menus, {
    fields: [prepLists.menuId],
    references: [menus.id],
  }),
  prepListTemplate: one(prepListTemplates, {
    fields: [prepLists.prepListTemplateId],
    references: [prepListTemplates.id],
  }),
  prepGroups: many(prepGroups),
}));

export const prepListTemplatesRelations = relations(
  prepListTemplates,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [prepListTemplates.companyId],
      references: [companies.id],
    }),
    menu: one(menus, {
      fields: [prepListTemplates.menuId],
      references: [menus.id],
    }),
    prepLists: many(prepLists),
    prepGroupTemplates: many(prepGroupTemplates),
  }),
);

export const prepGroupTemplatesRelations = relations(
  prepGroupTemplates,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [prepGroupTemplates.companyId],
      references: [companies.id],
    }),
    prepListTemplate: one(prepListTemplates, {
      fields: [prepGroupTemplates.prepListTemplateId],
      references: [prepListTemplates.id],
    }),
    menuItem: one(menuItems, {
      fields: [prepGroupTemplates.menuItemId],
      references: [menuItems.id],
    }),
    prepItemsTemplates: many(prepItemsTemplates),
  }),
);

export const prepItemsTemplatesRelations = relations(
  prepItemsTemplates,
  ({ one }) => ({
    company: one(companies, {
      fields: [prepItemsTemplates.companyId],
      references: [companies.id],
    }),
    prepGroupTemplate: one(prepGroupTemplates, {
      fields: [prepItemsTemplates.prepGroupTemplateId],
      references: [prepGroupTemplates.id],
    }),
    recipe: one(recipes, {
      fields: [prepItemsTemplates.recipeId],
      references: [recipes.id],
    }),
  }),
);
