"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Text,
} from "@mep/ui";
import type { RecipeOutput } from "@mep/api";
import { Dot } from "lucide-react";

interface RecipeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: RecipeOutput | null;
}

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export function RecipeViewDialog({
  open,
  onOpenChange,
  recipe,
}: RecipeViewDialogProps) {
  if (!recipe) return null;

  const ingredients = recipe.ingredients || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {recipe.instructions && (
            <div className="space-y-2">
              <Text className="font-semibold">Instructions</Text>
              <Text className="text-muted-foreground whitespace-pre-wrap">
                {recipe.instructions}
              </Text>
            </div>
          )}

          {ingredients.length > 0 && (
            <div className="space-y-2">
              <Text className="font-semibold">Ingredients</Text>
              <ul className="space-y-1">
                {ingredients.map((ingredient: Ingredient, index: number) => (
                  <li key={index} className="text-muted-foreground">
                    <Text className="flex items-center gap-2">
                      <Dot size={12} /> {ingredient.name} {ingredient.quantity}{" "}
                      {ingredient.unit}
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ingredients.length === 0 && !recipe.instructions && (
            <Text className="text-muted-foreground text-center py-4">
              No details available for this recipe.
            </Text>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
