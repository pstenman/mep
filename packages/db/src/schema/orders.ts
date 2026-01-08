import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { companies } from "./companies";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  updatedBy: uuid("updated_by")
    .notNull()
    .references(() => users.id),
  orderDate: timestamp("order_date").notNull(),
  orderItems:
    jsonb("order_items").$type<
      {
        name: string;
        quantity: number;
        unit: string;
        checked: boolean;
      }[]
    >(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  company: one(companies, {
    fields: [orders.companyId],
    references: [companies.id],
  }),
  createdBy: one(users, { fields: [orders.createdBy], references: [users.id] }),
  updatedBy: one(users, { fields: [orders.updatedBy], references: [users.id] }),
}));
