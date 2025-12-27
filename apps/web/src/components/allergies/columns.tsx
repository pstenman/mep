"use client";
import type { FormattedMenuItem } from "@mep/api";
import type { Allergen } from "@mep/types";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { MenuItemActions } from "../ui/action-menu";
import { AllergiesCell } from "./cell";

interface AllergiesColumnsProps {
  allergies: Allergen[];
  onEditMenuItem: (id: string) => void;
  onDeleteMenuItem: (id: string) => void;
  menuId: string;
}

export const getAllergiesColumns = ({
  allergies,
  onEditMenuItem,
  onDeleteMenuItem,
  menuId,
}: AllergiesColumnsProps): ColumnDef<FormattedMenuItem>[] => [
  {
    accessorKey: "name",
    id: "name",
    header: "Dish",
    enableResizing: false,
    size: 150,
  },
  ...allergies.map((allergy) => ({
    accessorKey: allergy,
    id: allergy,
    header: allergy,
    size: 64,
    enableSorting: false,
    cell: ({ row }: { row: Row<FormattedMenuItem> }) => (
      <AllergiesCell row={row} allergy={allergy} menuId={menuId} />
    ),
  })),
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableResizing: false,
    size: 50,
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
