import { companies } from "@/schema/companies";
import { db, type Database } from "..";
import { CompanyStatus } from "@mep/types";
import { eq } from "drizzle-orm";

type CompanyRow = typeof companies.$inferSelect;
type CompanyInsert = typeof companies.$inferInsert;

export const companyQueries = {
  create: async (
    input: CompanyInsert,
    executor?: Database,
  ): Promise<CompanyRow> => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(companies).values(input).returning();
    return row[0];
  },

  activate: async (companyId: string, db: Database) => {
    return db
      .update(companies)
      .set({ status: CompanyStatus.ACTIVE })
      .where(eq(companies.id, companyId));
  },
};
