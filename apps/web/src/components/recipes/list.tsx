"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Text } from "@mep/ui";
import { Loader2 } from "lucide-react";
import { useRecipesSheet } from "./sheet";
import { toast } from "sonner";
import { DeleteDialog } from "../ui/delete-dialog";
import type { RecipeOutput, RecipesOutput } from "@mep/api";
import { Searchbar } from "../ui/searchbar";
import { useDebouncedSearch } from "@/hooks/search/use-debounce";
import { RecipesTable } from "./table";
import { RecipeViewDialog } from "./view-dialog";
import { RecipeActions } from "./recipe-actions";
import { useTranslations } from "next-intl";

export function RecipesList() {
  const t = useTranslations("recipes");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [recipeToView, setRecipeToView] = useState<RecipeOutput | null>(null);
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
      toast.success(t("form.toast.deleteSuccess"));
      utils.recipes.getAll.invalidate();
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || t("form.toast.deleteError"));
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

  const handleViewClick = (recipe: RecipeOutput) => {
    setRecipeToView(recipe);
    setViewDialogOpen(true);
  };

  const handleEditClick = (recipeId: string) => {
    openRecipeSheet(recipeId);
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
            placeholder={t("list.searchPlaceholder")}
          />
        </div>
      </div>

      <div className="hidden md:block w-full">
        {recipes.length > 0 ? (
          <RecipesTable
            recipes={recipes}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={handleViewClick}
          />
        ) : (
          <div className="w-full border rounded-lg p-4 shadow-md bg-background">
            <div className="flex items-center justify-center py-8">
              <Text className="text-muted-foreground">
                {debouncedSearch.trim().length > 0
                  ? t("list.noRecipesFound")
                  : t("list.noRecipes")}
              </Text>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden w-full h-screen border rounded-lg p-4 shadow-md bg-background flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {recipes.length > 0 ? (
            <div className="space-y-2">
              {recipes.map((recipe: RecipeOutput) => {
                const createdAt = recipe.createdAt
                  ? new Date(recipe.createdAt).toLocaleDateString()
                  : "N/A";

                return (
                  <div
                    key={recipe.id}
                    className="flex items-center justify-between py-3 px-4 border-b hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                        <Text className="font-medium">{recipe.name}</Text>
                        <Text className="text-sm text-muted-foreground">
                          {createdAt}
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center ml-4">
                      <RecipeActions
                        onView={() => handleViewClick(recipe)}
                        onEdit={() => handleEditClick(recipe.id)}
                        onDelete={() => handleDeleteClick(recipe.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Text className="text-muted-foreground">
                {debouncedSearch.trim().length > 0
                  ? t("list.noRecipesFound")
                  : t("list.noRecipes")}
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
        title={t("delete.title")}
        description={t("delete.description")}
        confirmText={t("delete.confirm")}
        cancelText={t("delete.cancel")}
      />

      <RecipeViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        recipe={recipeToView}
      />
    </div>
  );
}
