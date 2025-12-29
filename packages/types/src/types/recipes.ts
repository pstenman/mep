export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  instructions?: string | null;
  ingredients?: RecipeIngredient[] | null;
}
