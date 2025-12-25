"use client";

import { trpc } from "@/lib/trpc/client";
import { Loader2 } from "lucide-react";
import { RecipesList } from "./list";
import { EmptyState } from "./empty-state";
import { RecipesSheet } from "./sheet";

export function RecipesView() {
  const { data, isLoading } = trpc.recipes.getAll.useQuery({
    filter: {},
  });

  if (isLoading) {
    return (
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const recipes = data?.data?.items ?? [];
  const hasRecipes = recipes.length > 0;

  return (
    <>
      <div className="flex w-full justify-center">
        <div className="w-full px-3 py-4 md:px-6 lg:px-8 max-w-full lg:max-w-[794px]">
          {hasRecipes ? <RecipesList /> : <EmptyState />}
        </div>
      </div>
      <RecipesSheet />
    </>
  );
}
