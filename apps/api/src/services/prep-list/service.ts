import { prepListQueries, type PrepListFilters } from "@mep/db";
import type { UpdatePrepListSchema, prepListFiltersSchema } from "./schema";
import type { z } from "zod";
import type { PrepType } from "@mep/types";
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
      scheduleFor: filter?.scheduleFor,
      prepType: filter?.type,
    };
    const rows = await prepListQueries.getAll(filters);
    let filteredRows = rows;
    if (filter?.type) {
      filteredRows = rows.filter(
        (row) => row.prepListTemplate?.prepTypes === filter?.type,
      );
    }
    return {
      items: transformPrepLists(filteredRows as RawPrepListWithRelations[]),
    };
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

  static async getActive(companyId: string, prepType?: PrepType) {
    try {
      const rawList = await prepListQueries.getActive(
        companyId,
        prepType ?? undefined,
      );
      if (!rawList) return null;

      const transformed = transformPrepList(
        rawList as RawPrepListWithRelations,
      );
      return transformed;
    } catch (error) {
      console.error("Error in getActive:", error);
      throw error;
    }
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
      scheduleFor: Date;
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

    if (input.scheduleFor !== undefined) {
      updateData.scheduleFor = input.scheduleFor as Date;
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

  static async setActive(
    listId: string,
    companyId: string,
    userId: string,
    scheduleFor?: Date,
  ) {
    const existing = await prepListQueries.getById(listId);
    if (!existing) {
      throw new Error("Prep list not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Prep list does not belong to this company");
    }

    const targetDate = scheduleFor ?? new Date();
    targetDate.setHours(0, 0, 0, 0);

    await prepListQueries.update(listId, {
      scheduleFor: targetDate,
      updatedBy: userId,
    });

    const fullList = await prepListQueries.getById(listId);
    if (!fullList) {
      throw new Error("Failed to fetch updated prep list");
    }
    return transformPrepList(fullList as RawPrepListWithRelations);
  }

  static async createFromTemplate(
    companyId: string,
    templateId: string,
    scheduleFor: Date,
    userId: string,
  ) {
    const newList = await prepListQueries.createFromTemplate(
      companyId,
      templateId,
      scheduleFor,
      userId,
    );

    const fullList = await prepListQueries.getById(newList.id);
    if (!fullList) {
      throw new Error("Failed to fetch created prep list from template");
    }
    return transformPrepList(fullList as RawPrepListWithRelations);
  }
}
