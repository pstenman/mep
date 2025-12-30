"use client";

import { useMemo } from "react";
import { getMenusColumns } from "./menus-columns";
import { DataTable } from "@/components/ui/data-tables";
import type { MenuType } from "@mep/types";

interface MenuItem {
  id: string;
  name: string;
  menuType: MenuType;
  isActive: boolean;
  menuItems?: unknown[];
}

interface MenusTableProps {
  menus: MenuItem[];
  menuType: MenuType | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function MenusTable({
  menus,
  menuType,
  onEdit,
  onDelete,
}: MenusTableProps) {
  const columns = useMemo(
    () =>
      getMenusColumns({
        menuType,
        onEdit,
        onDelete,
      }),
    [menuType, onEdit, onDelete],
  );

  return (
    <DataTable
      data={menus}
      columns={columns}
      pinnedColumns={{ left: ["name"], right: ["actions"] }}
    />
  );
}
