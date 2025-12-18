import { memberships } from "@/schema/memberships";
import { db, type Database } from "..";

type MembershipRow = typeof memberships.$inferSelect;
type MembershipInsert = typeof memberships.$inferInsert;

export const membershipQueries = {
  create: async (
    input: MembershipInsert,
    executor?: Database,
  ): Promise<MembershipRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(memberships).values(input).returning();
    return row[0];
  },
};
