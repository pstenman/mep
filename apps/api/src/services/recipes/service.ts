import { recipeQueries, type RecipeFilters } from "@mep/db";
import type {
  CreateRecipeSchema,
  UpdateRecipeSchema,
  recipeFiltersSchema,
} from "./schema";
import type { z } from "zod";

export class RecipeService {
  static async getAll(
    companyId: string,
    params?: {
      filter?: z.infer<typeof recipeFiltersSchema>;
    },
  ) {
    const { filter } = params || {};
    const filters: RecipeFilters = {
      companyId,
      search: filter?.search,
    };
    const rows = await recipeQueries.getAll(filters);
    return { items: rows };
  }

  static async getById(id: string) {
    return await recipeQueries.getById(id);
  }

  static async create(
    input: CreateRecipeSchema,
    companyId: string,
    userId: string,
  ) {
    const recipe = await recipeQueries.create({
      companyId,
      name: input.name,
      instructions: input.instructions,
      ingredients: input.ingredients,
      createdBy: userId,
      updatedBy: userId,
    });
    return recipe;
  }

  static async update(input: UpdateRecipeSchema, userId: string) {
    const existing = await recipeQueries.getById(input.id);
    if (!existing) {
      throw new Error("Recipe not found");
    }

    const updateData: Partial<{
      name: string;
      instructions: string | null;
      ingredients: Array<{
        name: string;
        quantity: number;
        unit: string;
      }> | null;
      updatedBy: string;
    }> = {
      updatedBy: userId,
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }

    if (input.instructions !== undefined) {
      updateData.instructions = input.instructions || null;
    }

    if (input.ingredients !== undefined) {
      updateData.ingredients = input.ingredients || null;
    }

    const recipe = await recipeQueries.update(input.id, updateData);
    return recipe;
  }

  static async delete(id: string, companyId: string) {
    const existing = await recipeQueries.getById(id);
    if (!existing) {
      throw new Error("Recipe not found");
    }
    if (existing.companyId !== companyId) {
      throw new Error("Recipe does not belong to this company");
    }

    await recipeQueries.delete(id);
    return { success: true };
  }
}
