"use client";

import { useMemo } from "react";
import { getRecipeColumns } from "./columns";
import type { RecipeOutput } from "@mep/api";
import { DataTable } from "../ui/data-tables";
import { useTranslations } from "next-intl";

interface RecipesTableProps {
  recipes: RecipeOutput[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (recipe: RecipeOutput) => void;
}

export function RecipesTable({
  recipes,
  onEdit,
  onDelete,
  onView,
}: RecipesTableProps) {
  const t = useTranslations("recipes");
  const columns = useMemo(
    () =>
      getRecipeColumns({
        onEdit,
        onDelete,
        onView,
        t,
      }),
    [onEdit, onDelete, onView, t],
  );

  return (
    <DataTable
      data={recipes}
      columns={columns}
      pinnedColumns={{ left: ["name"], right: ["actions"] }}
    />
  );
}
