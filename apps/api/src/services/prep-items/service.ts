import { prepItemQueries, type PrepItemFilters } from "@mep/db";
import type {
  CreatePrepItemSchema,
  UpdatePrepItemSchema,
  prepItemFiltersSchema,
} from "./schema";
import type { z } from "zod";
import { PrepStatus } from "@mep/types";

export class PrepItemService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof prepItemFiltersSchema>;
    },
  ) {
    const { filter } = params || {};
    const filters: PrepItemFilters = {
      companyId,
      search: filter?.search,
      prepGroupId: filter?.prepGroupId,
      status: filter?.status,
    };
    const rows = await prepItemQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await prepItemQueries.getById(id);
  }

  static async create(input: CreatePrepItemSchema, companyId: string, userId: string) {
    const prepItem = await prepItemQueries.create({
      companyId,
      name: input.name,
      prepGroupId: input.prepGroupId,
      recipeId: input.recipeId,
      status: input.status || PrepStatus.NONE,
      createdBy: userId,
      updatedBy: userId,
    });
    return prepItem;
  }

  static async update(input: UpdatePrepItemSchema, userId: string) {
    const existing = await prepItemQueries.getById(input.id);
    if (!existing) {
      throw new Error("Prep item not found");
    }

    const updateData: Partial<{
      name: string;
      prepGroupId: string | null;
      recipeId: string | null;
      status: PrepStatus;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.prepGroupId !== undefined) {
      updateData.prepGroupId = input.prepGroupId;
    }

    if (input.recipeId !== undefined) {
      updateData.recipeId = input.recipeId;
    }

    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    const prepItem = await prepItemQueries.update(input.id, updateData);
    return prepItem;
  }

  static async delete(id: string, companyId: string) {
    const existing = await prepItemQueries.getById(id);
    if (!existing) {
      throw new Error("Prep item not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Prep item does not belong to this company");
    }

    await prepItemQueries.delete(id);
    return { success: true };
  }
}

