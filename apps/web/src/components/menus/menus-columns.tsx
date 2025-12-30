"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { MenuType } from "@mep/types";
import { MenuItemActions } from "@/components/ui/action-menu";
import { MenuCell } from "./menu-cell";

interface MenuItem {
  id: string;
  name: string;
  menuType: MenuType;
  isActive: boolean;
  menuItems?: unknown[];
}

interface MenusColumnsProps {
  menuType: MenuType | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const getMenusColumns = ({
  menuType,
  onEdit,
  onDelete,
}: MenusColumnsProps): ColumnDef<MenuItem>[] => {
  return [
    {
      accessorKey: "isActive",
      id: "isActive",
      header: "Active",
      enableSorting: false,
      size: 80,
      cell: ({ row }: { row: Row<MenuItem> }) => (
        <MenuCell row={row} menuType={menuType} />
      ),
    },
    {
      accessorKey: "name",
      id: "name",
      header: "Menu Name",
      enableResizing: false,
      size: 200,
    },
    {
      accessorKey: "menuType",
      id: "menuType",
      header: "Menu Type",
      size: 120,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableResizing: false,
      size: 50,
      cell: ({ row }) => (
        <div className="flex gap-1 justify-center">
          <MenuItemActions
            onEdit={() => onEdit(row.original.id)}
            onDelete={() => onDelete(row.original.id)}
          />
        </div>
      ),
    },
  ];
};
