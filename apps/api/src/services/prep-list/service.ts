import {
  db,
  prepListQueries,
  type PrepListFilters,
  prepItemQueries,
  prepGroupQueries,
} from "@mep/db";
import type {
  CreatePrepListSchema,
  UpdatePrepListSchema,
  prepListFiltersSchema,
} from "./schema";
import type { z } from "zod";
import { PrepStatus, type PrepType } from "@mep/types";
import {
  transformPrepList,
  transformPrepLists,
  type RawPrepListWithRelations,
} from "./transform";

export class PrepListService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof prepListFiltersSchema>;
    },
  ) {
    const { filter } = params || {};
    const filters: PrepListFilters = {
      companyId,
      search: filter?.search,
      date: filter?.date,
      type: filter?.type,
      isActive: filter?.isActive,
    };
    const rows = await prepListQueries.getAll(filters);
    return { items: transformPrepLists(rows as RawPrepListWithRelations[]) };
  }

  static async getById(id: string, companyId: string) {
    const prepList = await prepListQueries.getById(id);
    if (!prepList) {
      throw new Error("Prep list not found");
    }
    if (prepList.companyId !== companyId) {
      throw new Error("Prep list does not belong to this company");
    }
    return transformPrepList(prepList as RawPrepListWithRelations);
  }

  static async createTemplate(
    data: CreatePrepListSchema,
    companyId: string,
    userId: string,
  ) {
    const fullList = await db.transaction(async (tx) => {
      const prepList = await prepListQueries.create(
        {
          companyId,
          name: data.name,
          menuId: data.menuId ?? null,
          prepTypes: data.prepTypes,
          date: data.date,
          isActive: data.isActive ?? true,
          createdBy: userId,
          updatedBy: userId,
        },
        tx,
      );

      if (data.groups && data.groups.length > 0) {
        for (const group of data.groups) {
          const newGroup = await prepGroupQueries.create(
            {
              prepListId: prepList.id,
              name: group.name,
              note: group.note ?? null,
              isTemplate: true,
              companyId,
              createdBy: userId,
              updatedBy: userId,
            },
            tx,
          );

          if (group.items && group.items.length > 0) {
            for (const item of group.items) {
              await prepItemQueries.create(
                {
                  prepGroupId: newGroup.id,
                  name: item.name,
                  recipeId: item.recipeId ?? null,
                  isTemplate: true,
                  status: PrepStatus.NONE,
                  companyId,
                  createdBy: userId,
                  updatedBy: userId,
                },
                tx,
              );
            }
          }
        }
      } else {
        const templateGroups =
          await prepListQueries.getTemplateGroups(companyId);
        for (const group of templateGroups) {
          const newGroup = await prepGroupQueries.create(
            {
              prepListId: prepList.id,
              name: group.name,
              note: group.note ?? null,
              isTemplate: true,
              companyId,
              createdBy: userId,
              updatedBy: userId,
            },
            tx,
          );

          for (const item of group.prepItems ?? []) {
            await prepItemQueries.create(
              {
                prepGroupId: newGroup.id,
                name: item.name,
                recipeId: item.recipeId ?? null,
                isTemplate: true,
                status: PrepStatus.NONE,
                companyId,
                createdBy: userId,
                updatedBy: userId,
              },
              tx,
            );
          }
        }
      }

      return prepList;
    });

    const listWithRelations = await prepListQueries.getById(fullList.id);
    if (!listWithRelations)
      throw new Error("Failed to fetch created prep list template");

    return transformPrepList(listWithRelations as RawPrepListWithRelations);
  }

  static async update(
    input: UpdatePrepListSchema,
    companyId: string,
    userId: string,
  ) {
    const existing = await prepListQueries.getById(input.id);
    if (!existing) {
      throw new Error("Prep list not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Prep list does not belong to this company");
    }

    const updateData: Partial<{
      name: string;
      menuId: string | null;
      prepTypes: PrepType;
      date: Date;
      isActive: boolean;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.menuId !== undefined) {
      updateData.menuId = input.menuId;
    }

    if (input.prepTypes !== undefined) {
      updateData.prepTypes = input.prepTypes;
    }

    if (input.date !== undefined) {
      updateData.date = input.date;
    }

    if (input.isActive !== undefined) {
      updateData.isActive = input.isActive;
    }

    await prepListQueries.update(input.id, updateData);
    const fullList = await prepListQueries.getById(input.id);
    if (!fullList) {
      throw new Error("Failed to fetch updated prep list");
    }
    return transformPrepList(fullList as RawPrepListWithRelations);
  }

  static async delete(id: string, companyId: string) {
    const existing = await prepListQueries.getById(id);
    if (!existing) {
      throw new Error("Prep list not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Prep list does not belong to this company");
    }

    await prepListQueries.delete(id);
    return { success: true };
  }

  static async createFromTemplate(
    companyId: string,
    prepType: PrepType,
    date: Date,
    userId: string,
  ) {
    const newList = await db.transaction(async (tx) => {
      const createdList = await prepListQueries.create(
        {
          companyId,
          name: `Prep ${prepType} ${date.toISOString().slice(0, 10)}`,
          prepTypes: prepType,
          date,
          isActive: true,
          createdBy: userId,
          updatedBy: userId,
        },
        tx,
      );

      const templateGroups = await prepListQueries.getTemplateGroups(companyId);

      for (const group of templateGroups) {
        const newGroup = await prepGroupQueries.create(
          {
            companyId,
            prepListId: createdList.id,
            name: group.name,
            note: group.note,
            isTemplate: false,
            createdBy: userId,
            updatedBy: userId,
          },
          tx,
        );

        for (const item of group.prepItems) {
          await prepItemQueries.create(
            {
              companyId,
              prepGroupId: newGroup.id,
              name: item.name,
              recipeId: item.recipeId,
              status: PrepStatus.NONE,
              isTemplate: false,
              createdBy: userId,
              updatedBy: userId,
            },
            tx,
          );
        }
      }

      return createdList;
    });

    const fullList = await prepListQueries.getById(newList.id);
    if (!fullList) {
      throw new Error("Failed to fetch created prep list from template");
    }
    return transformPrepList(fullList as RawPrepListWithRelations);
  }
}
