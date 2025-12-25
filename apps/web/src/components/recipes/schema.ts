import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  unit: z.string().min(1, "Unit is required"),
});

export const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  instructions: z.string().optional(),
  ingredients: z.array(ingredientSchema).optional(),
});

export type RecipeFormSchema = z.infer<typeof recipeFormSchema>;
export type IngredientSchema = z.infer<typeof ingredientSchema>;
