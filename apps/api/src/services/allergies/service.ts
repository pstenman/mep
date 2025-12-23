import { allergyQueries, type AllergyFilters } from "@mep/db";
import type { CreateAllergySchema, UpdateAllergySchema, allergyFiltersSchema } from "./schema";
import type { z } from "zod";
import type { Allergen } from "@mep/types";

export class AllergyService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof allergyFiltersSchema>;
    },
  ) {
    const { filter } = params || {};
    const filters: AllergyFilters = {
      companyId,
      search: filter?.search,
    };
    const rows = await allergyQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await allergyQueries.getById(id);
  }

  static async create(input: CreateAllergySchema, companyId: string, userId: string) {
    const allergy = await allergyQueries.create({
      companyId,
      name: input.name,
      createdBy: userId,
      updatedBy: userId,
    });
    return allergy;
  }

  static async update(input: UpdateAllergySchema, userId: string) {
    const existing = await allergyQueries.getById(input.id);
    if (!existing) {
      throw new Error("Allergy not found");
    }

    const updateData: Partial<{ name: Allergen; updatedBy: string }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    const allergy = await allergyQueries.update(input.id, updateData);
    return allergy;
  }

  static async delete(id: string, companyId: string) {
    const existing = await allergyQueries.getById(id);
    if (!existing) {
      throw new Error("Allergy not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Allergy does not belong to this company");
    }

    await allergyQueries.delete(id);
    return { success: true };
  }
}

