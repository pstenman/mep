import {
  prepListTemplates,
  prepGroupTemplates,
  prepItemsTemplates,
} from "@/schema/preparations";
import { db, type Database } from "..";
import type { PrepType } from "@mep/types";
import { and, eq, ilike } from "drizzle-orm";

type PrepListTemplateInsert = typeof prepListTemplates.$inferInsert;

export interface TemplateFilters {
  companyId: string;
  prepType?: PrepType;
  search?: string;
}

export function buildTemplateFilters(filters: TemplateFilters) {
  const whereConditions = [eq(prepListTemplates.companyId, filters.companyId)];

  if (filters.prepType) {
    whereConditions.push(eq(prepListTemplates.prepTypes, filters.prepType));
  }

  if (filters.search?.trim()) {
    whereConditions.push(ilike(prepListTemplates.name, `%${filters.search}%`));
  }

  return and(...whereConditions);
}

export const templateQueries = {
  getAll: async (filters: TemplateFilters) => {
    const whereClauses = buildTemplateFilters(filters);
    const rows = await db.query.prepListTemplates.findMany({
      where: whereClauses,
      orderBy: (templates, { desc }) => [
        desc(templates.isActive),
        desc(templates.updatedAt),
      ],
      with: {
        prepGroupTemplates: {
          with: {
            prepItemsTemplates: true,
          },
        },
      },
    });
    return rows;
  },

  getById: async (id: string, companyId: string) => {
    const row = await db.query.prepListTemplates.findFirst({
      where: and(
        eq(prepListTemplates.id, id),
        eq(prepListTemplates.companyId, companyId),
      ),
      with: {
        prepGroupTemplates: {
          with: {
            prepItemsTemplates: true,
          },
        },
      },
    });
    return row;
  },

  getActive: async (companyId: string, prepType: PrepType) => {
    const row = await db.query.prepListTemplates.findFirst({
      where: and(
        eq(prepListTemplates.companyId, companyId),
        eq(prepListTemplates.prepTypes, prepType),
        eq(prepListTemplates.isActive, true),
      ),
      with: {
        prepGroupTemplates: {
          with: {
            prepItemsTemplates: true,
          },
        },
      },
    });
    return row;
  },

  create: async (
    input: Omit<PrepListTemplateInsert, "id">,
    groups: Array<{
      name: string;
      note?: string | null;
      items: Array<{
        name: string;
        recipeId?: string | null;
      }>;
    }>,
    executor?: Database,
  ) => {
    const dbOrTx = executor ?? db;
    return await dbOrTx.transaction(async (tx) => {
      const template = await tx
        .insert(prepListTemplates)
        .values(input)
        .returning();

      for (const group of groups) {
        const groupTemplate = await tx
          .insert(prepGroupTemplates)
          .values({
            companyId: input.companyId,
            prepListTemplateId: template[0].id,
            name: group.name,
            note: group.note ?? null,
          })
          .returning();

        for (const item of group.items) {
          await tx.insert(prepItemsTemplates).values({
            companyId: input.companyId,
            prepGroupTemplateId: groupTemplate[0].id,
            name: item.name,
            recipeId: item.recipeId ?? null,
          });
        }
      }

      return template[0];
    });
  },

  update: async (
    id: string,
    input: Partial<
      Omit<PrepListTemplateInsert, "id" | "companyId" | "createdAt">
    >,
    executor?: Database,
  ) => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(prepListTemplates)
      .set({ ...input, updatedAt })
      .where(eq(prepListTemplates.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, companyId: string, executor?: Database) => {
    const dbOrTx = executor ?? db;
    await dbOrTx
      .delete(prepListTemplates)
      .where(
        and(
          eq(prepListTemplates.id, id),
          eq(prepListTemplates.companyId, companyId),
        ),
      );
  },

  setActive: async (
    templateId: string,
    companyId: string,
    prepType: PrepType,
    executor?: Database,
  ) => {
    const dbOrTx = executor ?? db;
    return await dbOrTx.transaction(async (tx) => {
      await tx
        .update(prepListTemplates)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(
            eq(prepListTemplates.companyId, companyId),
            eq(prepListTemplates.prepTypes, prepType),
          ),
        );
      const updated = await tx
        .update(prepListTemplates)
        .set({ isActive: true, updatedAt: new Date() })
        .where(
          and(
            eq(prepListTemplates.id, templateId),
            eq(prepListTemplates.companyId, companyId),
          ),
        )
        .returning();

      return updated[0];
    });
  },
};
