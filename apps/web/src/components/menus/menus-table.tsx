"use client";

import { useMemo } from "react";
import { getMenusColumns } from "./menus-columns";
import { DataTable } from "@/components/ui/data-tables";
import type { MenuType } from "@mep/types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("menus");
  const columns = useMemo(
    () =>
      getMenusColumns({
        menuType,
        onEdit,
        onDelete,
        t,
      }),
    [menuType, onEdit, onDelete, t],
  );

  return (
    <DataTable
      data={menus}
      columns={columns}
      pinnedColumns={{ left: ["name"], right: ["actions"] }}
    />
  );
}
