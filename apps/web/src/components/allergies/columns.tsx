"use client";
import type { FormattedMenuItem } from "@mep/api";
import type { Allergen } from "@mep/types";
import type { ColumnDef } from "@tanstack/react-table";
import { MenuItemActions } from "../ui/action-menu";

interface AllergiesColumnsProps {
  allAllergies: Allergen[];
  onEditMenuItem: (id: string) => void;
  onDeleteMenuItem: (id: string) => void;
}

export const getAllergiesColumns = ({
  allAllergies,
  onEditMenuItem,
  onDeleteMenuItem,
}: AllergiesColumnsProps): ColumnDef<FormattedMenuItem>[] => [
  {
    accessorKey: "name",
    header: "Dish",
    enableSorting: true,
    enableResizing: true,
    size: 150,
    meta: { pinned: "left", className: "text-left" },
  },
  ...allAllergies.map((allergy) => ({
    id: allergy,
    header: allergy,
    accessorFn: (row: FormattedMenuItem) =>
      row.allergies.includes(allergy) ? "✔️" : "",
    enableSorting: false,
    enableResizing: true,
    size: 150,
    meta: { className: "text-center" },
  })),
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableResizing: false,
    size: 50,
    meta: { pinned: "right", className: "text-center" },
    cell: ({ row }) => (
      <div className="flex gap-1 justify-center">
        <MenuItemActions
          onEdit={() => onEditMenuItem(row.original.id)}
          onDelete={() => onDeleteMenuItem(row.original.id)}
        />
      </div>
    ),
  },
];
