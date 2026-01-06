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
import { useTranslations } from "next-intl";

interface RecipeViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe:
    | RecipeOutput
    | {
        id: string;
        name: string;
        instructions?: string | null;
        ingredients?: Array<{
          name: string;
          quantity: number;
          unit: string;
        }> | null;
      }
    | null;
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
  const t = useTranslations("recipes");

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
              <Text className="font-semibold">{t("view.instructions")}</Text>
              <Text className="text-muted-foreground whitespace-pre-wrap">
                {recipe.instructions}
              </Text>
            </div>
          )}

          {ingredients.length > 0 && (
            <div className="space-y-2">
              <Text className="font-semibold">{t("view.ingredients")}</Text>
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
              {t("view.noDetails")}
            </Text>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
