import { memberships } from "@/schema/memberships";
import { db, type Database } from "..";
import { MembershipStatus } from "@mep/types";
import { and, eq } from "drizzle-orm";

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

  activate: async (membershipId: string, db: Database) => {
    return db
      .update(memberships)
      .set({ status: MembershipStatus.ACTIVE })
      .where(eq(memberships.id, membershipId));
  },

  findCompanyByUserId: async (
    userId: string,
    executor?: Database,
  ) => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.query.memberships.findFirst({
      where: eq(memberships.userId, userId),
    });
  
    return row ?? null;
  },
  

  findByUserAndCompany: async (
    userId: string,
    companyId: string,
    executor?: Database,
  ): Promise<MembershipRow | null> => {
    const dbOrTx = executor ?? db;

    const row = await dbOrTx.query.memberships.findFirst({
      where: and(
        eq(memberships.userId, userId),
        eq(memberships.companyId, companyId),
      ),
    });

    return row ?? null;
  },
};
