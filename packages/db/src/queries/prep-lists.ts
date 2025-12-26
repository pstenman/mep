import { prepGroups, prepItems, prepLists } from "@/schema/preparations";
import { db, type Database } from "..";
import { PrepStatus, type PrepType } from "@mep/types";
import { and, eq, ilike } from "drizzle-orm";

type PrepListRow = typeof prepLists.$inferSelect;
type PrepListInsert = typeof prepLists.$inferInsert;

export interface PrepListFilters {
  companyId: string;
  search?: string;
  date?: Date;
  type?: PrepType;
  isActive?: boolean;
}
interface DeactivateByTypeParams {
  companyId: string;
  prepType: PrepType;
  userId: string;
  executor?: Database;
}

export function buildPrepListFilters(filters: PrepListFilters) {
  const whereConditions = [];

  whereConditions.push(eq(prepLists.companyId, filters.companyId));

  if (filters.search?.trim()) {
    whereConditions.push(ilike(prepLists.name, `%${filters.search}%`));
  }

  if (filters.date) {
    whereConditions.push(eq(prepLists.date, filters.date));
  }

  if (filters.type) {
    whereConditions.push(eq(prepLists.prepTypes, filters.type));
  }

  if (filters.isActive !== undefined) {
    whereConditions.push(eq(prepLists.isActive, filters.isActive));
  }

  return and(...whereConditions);
}

export const prepListQueries = {
  getAll: async (filters: PrepListFilters) => {
    const whereClauses = buildPrepListFilters(filters);
    const rows = await db.query.prepLists.findMany({
      where: whereClauses,
      orderBy: (lists, { desc }) => [
        desc(lists.isActive),
        desc(lists.updatedAt),
      ],
      columns: {
        id: true,
        name: true,
        prepTypes: true,
        date: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        prepGroups: {
          columns: {
            id: true,
            name: true,
            note: true,
            menuItemId: true,
          },
          with: {
            prepItems: {
              columns: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });
    return rows;
  },

  getById: async (id: string) => {
    const row = await db.query.prepLists.findFirst({
      where: eq(prepLists.id, id),
      with: {
        prepGroups: {
          columns: {
            id: true,
            name: true,
            note: true,
            menuItemId: true,
          },
          with: {
            prepItems: {
              columns: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });
    return row;
  },

  getActive: async (companyId: string, prepType?: PrepType) => {
    const conditions = [
      eq(prepLists.companyId, companyId),
      eq(prepLists.isActive, true),
    ];

    if (prepType) {
      conditions.push(eq(prepLists.prepTypes, prepType));
    }

    const row = await db.query.prepLists.findFirst({
      where: and(...conditions),
      with: {
        prepGroups: {
          columns: {
            id: true,
            name: true,
            note: true,
            menuItemId: true,
          },
          with: {
            prepItems: {
              columns: {
                id: true,
                name: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return row;
  },

  create: async (input: Omit<PrepListInsert, "id">, executor?: Database) => {
    const dbOrTx = executor ?? db;
    const row = await dbOrTx.insert(prepLists).values(input).returning();
    return row[0];
  },

  update: async (
    id: string,
    input: Partial<Omit<PrepListInsert, "id" | "companyId" | "createdAt">>,
    executor?: Database,
  ) => {
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    const row = await dbOrTx
      .update(prepLists)
      .set({ ...input, updatedAt })
      .where(eq(prepLists.id, id))
      .returning();
    return row[0];
  },

  delete: async (id: string, executor?: Database) => {
    const dbOrTx = executor ?? db;
    await dbOrTx.delete(prepLists).where(eq(prepLists.id, id));
  },

  getTemplateGroups: async (companyId: string) => {
    const rows = await db.query.prepGroups.findMany({
      where: and(
        eq(prepGroups.companyId, companyId),
        eq(prepGroups.isTemplate, true),
      ),
      with: {
        prepItems: {
          where: eq(prepItems.isTemplate, true),
        },
      },
    });
    return rows;
  },

  createFromTemplate: async (
    companyId: string,
    prepType: PrepType,
    date: Date,
    userId: string,
  ) => {
    return await db.transaction(async (tx) => {
      const newList = await tx
        .insert(prepLists)
        .values({
          companyId,
          name: `Prep ${prepType} ${date.toISOString().slice(0, 10)}`,
          prepTypes: prepType,
          date,
          isActive: true,
          createdBy: userId,
          updatedBy: userId,
        })
        .returning();

      const templateGroups = await prepListQueries.getTemplateGroups(companyId);

      for (const group of templateGroups) {
        const newGroup = await tx
          .insert(prepGroups)
          .values({
            companyId,
            prepListId: newList[0].id,
            name: group.name,
            note: group.note,
            isTemplate: false,
            createdBy: userId,
            updatedBy: userId,
          })
          .returning();

        for (const item of group.prepItems) {
          await tx.insert(prepItems).values({
            companyId,
            prepGroupId: newGroup[0].id,
            name: item.name,
            recipeId: item.recipeId,
            status: PrepStatus.NONE,
            isTemplate: false,
            createdBy: userId,
            updatedBy: userId,
          });
        }
      }

      return newList[0];
    });
  },

  deactivateByType: async (params: DeactivateByTypeParams) => {
    const { companyId, prepType, userId, executor } = params;
    const dbOrTx = executor ?? db;
    const updatedAt = new Date();
    await dbOrTx
      .update(prepLists)
      .set({
        isActive: false,
        updatedBy: userId,
        updatedAt,
      })
      .where(
        and(
          eq(prepLists.companyId, companyId),
          eq(prepLists.prepTypes, prepType),
          eq(prepLists.isActive, true),
        ),
      );
  },
};
