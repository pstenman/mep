"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { RecipeOutput } from "@mep/api";
import { RecipeActions } from "./recipe-actions";

interface RecipeColumnsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (recipe: RecipeOutput) => void;
  t: (key: string) => string;
}

export const getRecipeColumns = ({
  onEdit,
  onDelete,
  onView,
  t,
}: RecipeColumnsProps): ColumnDef<RecipeOutput>[] => [
  {
    accessorKey: "name",
    id: "name",
    header: t("columns.name"),
    enableResizing: false,
    size: 200,
  },
  {
    accessorKey: "createdBy",
    id: "createdBy",
    header: t("columns.createdBy"),
    enableResizing: false,
    size: 150,
    cell: ({ row }: { row: Row<RecipeOutput> }) => {
      const createdBy = row.original.createdBy;
      return (
        <span className="text-muted-foreground">
          {createdBy?.firstName || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedBy",
    id: "updatedBy",
    header: t("columns.updatedBy"),
    enableResizing: false,
    size: 150,
    cell: ({ row }: { row: Row<RecipeOutput> }) => {
      const updatedBy = row.original.updatedBy;
      return (
        <span className="text-muted-foreground">
          {updatedBy?.firstName || "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: t("columns.createdAt"),
    enableResizing: false,
    size: 150,
    cell: ({ row }: { row: Row<RecipeOutput> }) => {
      const createdAt = row.original.createdAt;
      return (
        <span className="text-muted-foreground">
          {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    id: "updatedAt",
    header: t("columns.updatedAt"),
    enableResizing: false,
    size: 150,
    cell: ({ row }: { row: Row<RecipeOutput> }) => {
      const updatedAt = row.original.updatedAt;
      return (
        <span className="text-muted-foreground">
          {updatedAt ? new Date(updatedAt).toLocaleDateString() : "N/A"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableResizing: false,
    size: 50,
    cell: ({ row }) => (
      <div className="flex gap-1 justify-center">
        <RecipeActions
          onView={() => onView(row.original)}
          onEdit={() => onEdit(row.original.id)}
          onDelete={() => onDelete(row.original.id)}
        />
      </div>
    ),
  },
];
