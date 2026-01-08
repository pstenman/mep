import {
  prepGroups,
  prepItems,
  prepLists,
  prepListTemplates,
} from "@/schema/preparations";
import { db, type Database } from "..";
import { PrepStatus, type PrepType } from "@mep/types";
import { and, eq, ilike, sql, asc } from "drizzle-orm";

type PrepListInsert = typeof prepLists.$inferInsert;

export interface PrepListFilters {
  companyId: string;
  search?: string;
  scheduleFor?: Date;
  prepType?: PrepType;
}

export function buildPrepListFilters(filters: PrepListFilters) {
  const whereConditions = [];

  whereConditions.push(eq(prepLists.companyId, filters.companyId));

  if (filters.search?.trim()) {
    whereConditions.push(ilike(prepLists.name, `%${filters.search}%`));
  }

  if (filters.scheduleFor) {
    whereConditions.push(eq(prepLists.scheduleFor, filters.scheduleFor));
  }

  return and(...whereConditions);
}

export const prepListQueries = {
  getAll: async (filters: PrepListFilters) => {
    const whereClauses = buildPrepListFilters(filters);
    const rows = await db.query.prepLists.findMany({
      where: whereClauses,
      orderBy: (lists, { desc }) => [
        desc(lists.scheduleFor),
        desc(lists.updatedAt),
      ],
      with: {
        prepListTemplate: {
          columns: {
            id: true,
            name: true,
            prepTypes: true,
            isActive: true,
          },
        },
        prepGroups: {
          columns: {
            id: true,
            name: true,
            note: true,
            notes: true,
            menuItemId: true,
            createdAt: true,
          },
          orderBy: [asc(prepGroups.createdAt), asc(prepGroups.id)],
          with: {
            prepItems: {
              columns: {
                id: true,
                name: true,
                status: true,
                recipeId: true,
                createdAt: true,
              },
              orderBy: [asc(prepItems.createdAt), asc(prepItems.id)],
              with: {
                recipe: {
                  columns: {
                    id: true,
                    name: true,
                    instructions: true,
                    ingredients: true,
                  },
                },
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
        prepListTemplate: {
          columns: {
            id: true,
            name: true,
            prepTypes: true,
            isActive: true,
          },
        },
        prepGroups: {
          columns: {
            id: true,
            name: true,
            note: true,
            notes: true,
            menuItemId: true,
            createdAt: true,
          },
          orderBy: [asc(prepGroups.createdAt), asc(prepGroups.id)],
          with: {
            prepItems: {
              columns: {
                id: true,
                name: true,
                status: true,
                recipeId: true,
                createdAt: true,
              },
              orderBy: [asc(prepItems.createdAt), asc(prepItems.id)],
              with: {
                recipe: {
                  columns: {
                    id: true,
                    name: true,
                    instructions: true,
                    ingredients: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return row;
  },

  getActive: async (companyId: string, prepType?: PrepType) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const conditions = [
        eq(prepLists.companyId, companyId),
        sql`${prepLists.scheduleFor} <= ${todayISO}::timestamp`,
      ];

      const whereClause = and(...conditions);

      const row = await db.query.prepLists.findFirst({
        where: whereClause,
        orderBy: (lists, { desc }) => [desc(lists.scheduleFor)],
        with: {
          prepListTemplate: {
            columns: {
              id: true,
              name: true,
              prepTypes: true,
              isActive: true,
            },
          },
          prepGroups: {
            columns: {
              id: true,
              name: true,
              note: true,
              notes: true,
              menuItemId: true,
              createdAt: true,
            },
            orderBy: [asc(prepGroups.createdAt), asc(prepGroups.id)],
            with: {
              prepItems: {
                columns: {
                  id: true,
                  name: true,
                  status: true,
                  recipeId: true,
                  createdAt: true,
                },
                orderBy: [asc(prepItems.createdAt), asc(prepItems.id)],
                with: {
                  recipe: {
                    columns: {
                      id: true,
                      name: true,
                      instructions: true,
                      ingredients: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (prepType && row?.prepListTemplate?.prepTypes !== prepType) {
        return null;
      }

      return row;
    } catch (error) {
      console.error("Error in prepListQueries.getActive:", error);
      throw error;
    }
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

  createFromTemplate: async (
    companyId: string,
    templateId: string,
    scheduleFor: Date,
    userId: string,
  ) => {
    return await db.transaction(async (tx) => {
      const template = await tx.query.prepListTemplates.findFirst({
        where: eq(prepListTemplates.id, templateId),
        with: {
          prepGroupTemplates: {
            with: {
              prepItemsTemplates: true,
            },
          },
        },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      const newList = await tx
        .insert(prepLists)
        .values({
          companyId,
          prepListTemplateId: templateId,
          name: `Prep ${template.prepTypes} ${scheduleFor.toISOString().slice(0, 10)}`,
          scheduleFor,
          createdBy: userId,
          updatedBy: userId,
        })
        .returning();

      for (const groupTemplate of template.prepGroupTemplates || []) {
        const newGroup = await tx
          .insert(prepGroups)
          .values({
            companyId,
            prepListId: newList[0].id,
            name: groupTemplate.name,
            note: groupTemplate.note,
          })
          .returning();

        for (const itemTemplate of groupTemplate.prepItemsTemplates || []) {
          await tx.insert(prepItems).values({
            companyId,
            prepGroupId: newGroup[0].id,
            name: itemTemplate.name,
            recipeId: itemTemplate.recipeId,
            status: PrepStatus.NONE,
          });
        }
      }

      return newList[0];
    });
  },
};
