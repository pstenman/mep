import { users } from "@/schema/users";
import { db, type Database } from "..";
import { eq } from "drizzle-orm";

type UserRow = typeof users.$inferSelect;
type UserInsert = typeof users.$inferInsert;

export const userQueries = {
  create: async (input: UserInsert, executor?: Database): Promise<UserRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(users).values(input).returning();
    return row[0];
  },

  activate: async (userId: string, db: Database) => {
    return db.update(users).set({ isActive: true }).where(eq(users.id, userId));
  },

  getByEmail: async (email: string, db: Database) => {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },
};
