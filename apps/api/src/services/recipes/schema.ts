import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().min(0),
  unit: z.string().min(1),
});

export const createRecipeSchema = z.object({
  name: z.string().min(1),
  instructions: z.string().optional(),
  ingredients: z.array(ingredientSchema).optional(),
});

export const updateRecipeSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).optional(),
  instructions: z.string().optional(),
  ingredients: z.array(ingredientSchema).optional(),
});

export const recipeFiltersSchema = z.object({
  search: z.string().optional(),
});

export type CreateRecipeSchema = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeSchema = z.infer<typeof updateRecipeSchema>;
export type RecipeFiltersSchema = z.infer<typeof recipeFiltersSchema>;
