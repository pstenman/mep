import {
  prepGroupQueries,
  prepListQueries,
  type PrepGroupFilters,
} from "@mep/db";
import type {
  CreatePrepGroupSchema,
  UpdatePrepGroupSchema,
  prepGroupFiltersSchema,
} from "./schema";
import type { z } from "zod";

export class PrepGroupService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof prepGroupFiltersSchema>;
    },
  ) {
    const { filter } = params || {};

    if (filter?.prepListId) {
      const prepList = await prepListQueries.getById(filter.prepListId);
      if (!prepList) {
        throw new Error("Prep list not found");
      }
      if (prepList.companyId !== companyId) {
        throw new Error("Prep list does not belong to this company");
      }
    }

    const filters: PrepGroupFilters = {
      prepListId: filter?.prepListId ?? undefined,
      companyId: companyId,
      search: filter?.search,
    };

    const rows = await prepGroupQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string, companyId: string) {
    const prepGroup = await prepGroupQueries.getById(id);
    if (!prepGroup) {
      throw new Error("Prep group not found");
    }
    if (prepGroup.companyId !== companyId) {
      throw new Error("Prep group does not belong to this company");
    }
    return prepGroup;
  }

  static async create(
    input: CreatePrepGroupSchema,
    companyId: string,
    userId: string,
  ) {
    const prepList = await prepListQueries.getById(input.prepListId);
    if (!prepList) {
      throw new Error("Prep list not found");
    }
    if (prepList.companyId !== companyId) {
      throw new Error("Prep list does not belong to this company");
    }

    const prepGroup = await prepGroupQueries.create({
      companyId: prepList.companyId,
      prepListId: input.prepListId,
      name: input.name,
      menuItemId: input.menuItemId ?? null,
      note: input.note ?? null,
      createdBy: userId,
      updatedBy: userId,
    });
    return prepGroup;
  }

  static async update(
    input: UpdatePrepGroupSchema,
    companyId: string,
    userId: string,
  ) {
    const existing = await prepGroupQueries.getById(input.id);
    if (!existing) {
      throw new Error("Prep group not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Prep group does not belong to this company");
    }

    const updateData: Partial<{
      name: string;
      menuItemId: string | null;
      note: string | null;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.menuItemId !== undefined) {
      updateData.menuItemId = input.menuItemId;
    }

    if (input.note !== undefined) {
      updateData.note = input.note;
    }

    const prepGroup = await prepGroupQueries.update(input.id, updateData);
    return prepGroup;
  }

  static async delete(id: string, companyId: string) {
    const existing = await prepGroupQueries.getById(id);
    if (!existing) {
      throw new Error("Prep group not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Prep group does not belong to this company");
    }

    await prepGroupQueries.delete(id);
    return { success: true };
  }
}
