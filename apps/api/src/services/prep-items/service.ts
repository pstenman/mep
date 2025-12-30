import {
  prepItemQueries,
  prepGroupQueries,
  type PrepItemFilters,
} from "@mep/db";
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
    if (!filter?.prepGroupId) {
      throw new Error("prepGroupId is required in filter");
    }
    const prepGroup = await prepGroupQueries.getById(filter.prepGroupId);
    if (!prepGroup) {
      throw new Error("Prep group not found");
    }
    if (prepGroup.companyId !== companyId) {
      throw new Error("Prep group does not belong to this company");
    }

    const filters: PrepItemFilters = {
      prepGroupId: filter.prepGroupId,
      search: filter?.search,
      status: filter?.status,
    };
    const rows = await prepItemQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string, companyId: string) {
    const prepItem = await prepItemQueries.getById(id);
    if (!prepItem) {
      throw new Error("Prep item not found");
    }
    if (prepItem.companyId !== companyId) {
      throw new Error("Prep item does not belong to this company");
    }
    return prepItem;
  }

  static async create(input: CreatePrepItemSchema, companyId: string) {
    const prepGroup = await prepGroupQueries.getById(input.prepGroupId);
    if (!prepGroup) {
      throw new Error("Prep group not found");
    }
    if (prepGroup.companyId !== companyId) {
      throw new Error("Prep group does not belong to this company");
    }

    const prepItem = await prepItemQueries.create({
      companyId: prepGroup.companyId,
      prepGroupId: input.prepGroupId,
      name: input.name,
      recipeId: input.recipeId ?? null,
      status: input.status || PrepStatus.NONE,
    });
    return prepItem;
  }

  static async update(input: UpdatePrepItemSchema, companyId: string) {
    const existing = await prepItemQueries.getById(input.id);
    if (!existing) {
      throw new Error("Prep item not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Prep item does not belong to this company");
    }

    const updateData: Partial<{
      name: string;
      recipeId: string | null;
      status: PrepStatus;
    }> = {};

    if (input.name !== undefined) {
      updateData.name = input.name;
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
