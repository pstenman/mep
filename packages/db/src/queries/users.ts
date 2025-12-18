import { users } from "@/schema/users";
import { db, type Database } from "..";

type UserRow = typeof users.$inferSelect;
type UserInsert = typeof users.$inferInsert;

export const userQueries = {
  create: async (input: UserInsert, executor?: Database): Promise<UserRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(users).values(input).returning();
    return row[0];
  },
};
