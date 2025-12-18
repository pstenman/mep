import { companies } from "@/schema/companies";
import { db, type Database } from "..";

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
};
