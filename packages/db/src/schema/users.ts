import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { memberships } from "./memberships";
import { orders } from "./orders";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseId: text("supabase_id").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("name_firstname").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  image: jsonb("image").$type<{
    src: string;
    base64?: string | null;
    blurhash?: string | null;
  } | null>(),
});

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
}));


export const usersOrders = pgTable("users_orders", {
  userId: uuid("user_id").notNull().references(() => users.id),
  orderId: uuid("order_id").notNull().references(() => orders.id),
});


export const usersOrdersRelations = relations(usersOrders, ({ one }) => ({
  user: one(users, { fields: [usersOrders.userId], references: [users.id] }),
  order: one(orders, { fields: [usersOrders.orderId], references: [orders.id] }),
}));


