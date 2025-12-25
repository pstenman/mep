"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Text, Button } from "@mep/ui";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useRecipesSheet } from "./sheet";
import { toast } from "sonner";
import { DeleteDialog } from "../ui/delete-dialog";
import type { RecipeOutput, RecipesOutput } from "@mep/api";
import { Searchbar } from "../ui/searchbar";
import { useDebouncedSearch } from "@/hooks/search/use-debounce";

export function RecipesList() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const { open: openRecipeSheet } = useRecipesSheet();
  const utils = trpc.useUtils();

  const { rawSearch, setRawSearch, debouncedSearch } = useDebouncedSearch(300);

  const { data, isLoading } = trpc.recipes.getAll.useQuery<RecipesOutput>(
    {
      filter: debouncedSearch ? { search: debouncedSearch } : undefined,
    },
    {
      placeholderData: (previousData: RecipesOutput) => previousData,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );

  const recipes = data?.data?.items ?? [];

  const deleteRecipe = trpc.recipes.delete.useMutation({
    onSuccess: () => {
      toast.success("Recipe deleted successfully");
      utils.recipes.getAll.invalidate();
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || "Failed to delete recipe");
    },
  });

  const handleDeleteClick = (recipeId: string) => {
    setRecipeToDelete(recipeId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (recipeToDelete) {
      deleteRecipe.mutate({ id: recipeToDelete });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between gap-4 mb-4">
        <div>
          <Searchbar
            value={rawSearch}
            onChange={setRawSearch}
            placeholder="Search recipes..."
          />
        </div>
      </div>

      <div className="w-full h-screen border rounded-lg p-4 shadow-md bg-background flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {recipes.length > 0 ? (
            <div className="space-y-2">
              {recipes.map((recipe: RecipeOutput) => {
                const ingredients = recipe.ingredients || [];
                const ingredientCount = ingredients.length;

                return (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between py-3 px-4 border-b hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <Text className="font-medium">{recipe.name}</Text>
                        {ingredientCount > 0 && (
                          <Text className="text-sm text-muted-foreground">
                            {ingredientCount} ingredient
                            {ingredientCount !== 1 ? "s" : ""}
                          </Text>
                        )}
                      </div>
                      {recipe.instructions && (
                        <Text className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {recipe.instructions}
                        </Text>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-[40px] h-[40px]"
                        onClick={() => openRecipeSheet(recipe.id)}
                      >
                        <Pencil size={16} className="text-primary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full w-[40px] h-[40px]"
                        onClick={() => handleDeleteClick(recipe.id)}
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Text className="text-muted-foreground">
                {debouncedSearch.trim().length > 0
                  ? "No recipes found"
                  : "No recipes"}
              </Text>
            </div>
          )}
        </div>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteRecipe.isPending}
      />
    </div>
  );
}
