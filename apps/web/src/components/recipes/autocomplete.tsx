import { Combobox, type ComboboxOption } from "@mep/ui";
import { trpc } from "@/lib/trpc/client";
import { useMemo } from "react";

interface Recipe {
  id: string;
  name: string;
}

interface RecipeComboboxProps {
  value?: string;
  onChange: (recipeId: string) => void;
  disabled?: boolean;
  onClear?: () => void;
}

export function RecipeCombobox({
  value,
  onChange,
  disabled,
}: RecipeComboboxProps) {
  const { data: recipesData, isLoading } = trpc.recipes.getAll.useQuery({});

  const options: ComboboxOption<Recipe>[] = useMemo(() => {
    if (!recipesData?.data?.items) return [];
    return recipesData.data.items.map((recipe: Recipe) => ({
      value: recipe.id,
      label: recipe.name,
      meta: recipe,
    }));
  }, [recipesData]);

  return (
    <Combobox<Recipe>
      value={value}
      options={options}
      placeholder="Search and select a recipe..."
      disabled={disabled}
      loading={isLoading}
      onValueChange={onChange}
    />
  );
}
