import { companies, companySettings } from "@/schema/companies";
import { db, type Database } from "..";
import { CompanyStatus } from "@mep/types";
import { eq } from "drizzle-orm";

type CompanyRow = typeof companies.$inferSelect;
type CompanyInsert = typeof companies.$inferInsert;
type CompanySettingsRow = typeof companySettings.$inferSelect;
type CompanySettingsInsert = typeof companySettings.$inferInsert;

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

export const companySettingsQueries = {
  getByCompanyId: async (companyId: string): Promise<CompanySettingsRow | null> => {
    const row = await db.query.companySettings.findFirst({
      where: eq(companySettings.companyId, companyId),
    });
    return row || null;
  },

  getOrCreate: async (
    companyId: string,
    executor?: Database,
  ): Promise<CompanySettingsRow> => {
    const dbOrTx = executor ?? db;
    const existing = await dbOrTx.query.companySettings.findFirst({
      where: eq(companySettings.companyId, companyId),
    });

    if (existing) {
      return existing;
    }

    const row = await dbOrTx.insert(companySettings).values({
      companyId,
    }).returning();
    return row[0];
  },

  update: async (
    companyId: string,
    input: Partial<Omit<CompanySettingsInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ): Promise<CompanySettingsRow> => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(companySettings)
      .set({ ...input, updatedAt })
      .where(eq(companySettings.companyId, companyId))
      .returning();
    return row[0];
  },
};
