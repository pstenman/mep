import { relations } from "drizzle-orm";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { memberships } from "./memberships";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseId: text("supabase_id").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("name_firstname").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
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