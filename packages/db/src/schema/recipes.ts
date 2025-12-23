import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { prepItems } from "./preparations";

export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id),
  name: text("name").notNull(),
  instructions: text("instructions"),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  updatedBy: uuid("updated_by").notNull().references(() => users.id),
  ingredients: jsonb("ingredients").$type<{
    name: string;
    quantity: number;
    unit: string;
  }[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  company: one(companies, {
    fields: [recipes.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, {
    fields: [recipes.createdBy],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [recipes.updatedBy],
    references: [users.id],
  }),
  prepItems: many(prepItems),
}));