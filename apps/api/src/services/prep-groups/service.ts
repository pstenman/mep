import { prepGroupQueries, type PrepGroupFilters } from "@mep/db";
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
    const filters: PrepGroupFilters = {
      companyId,
      search: filter?.search,
    };
    const rows = await prepGroupQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await prepGroupQueries.getById(id);
  }

  static async create(input: CreatePrepGroupSchema, companyId: string, userId: string) {
    const prepGroup = await prepGroupQueries.create({
      companyId,
      name: input.name,
      menuItemId: input.menuItemId,
      prepTypes: input.prepTypes,
      note: input.note,
      createdBy: userId,
      updatedBy: userId,
    });
    return prepGroup;
  }

  static async update(input: UpdatePrepGroupSchema, userId: string) {
    const existing = await prepGroupQueries.getById(input.id);
    if (!existing) {
      throw new Error("Prep group not found");
    }

    const updateData: Partial<{
      name: string;
      menuItemId: string | null;
      prepTypes: string | null;
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

    if (input.prepTypes !== undefined) {
      updateData.prepTypes = input.prepTypes;
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

