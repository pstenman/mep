"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@mep/ui";
import { parseAsBoolean, parseAsString } from "nuqs";
import { useQueryState } from "nuqs";
import { RecipeForm } from "./form";
import { useTranslations } from "next-intl";

export const useRecipesSheet = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "recipesSheetOpen",
    parseAsBoolean.withDefault(false),
  );
  const [recipeId, setRecipeId] = useQueryState(
    "recipeId",
    parseAsString.withDefault(""),
  );

  const open = (id?: string) => {
    setRecipeId(id || "");
    setIsOpen(true);
  };

  const close = () => {
    setRecipeId("");
    setIsOpen(false);
  };

  return { isOpen, open, close, recipeId: recipeId || null };
};

export function RecipesSheet() {
  const { isOpen, close, recipeId } = useRecipesSheet();
  const t = useTranslations("recipes");

  const handleSuccess = () => {
    close();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <SheetTitle>
            {recipeId ? t("form.title.edit") : t("form.title.create")}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 min-h-0">
          <RecipeForm onSuccess={handleSuccess} onCancel={close} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
