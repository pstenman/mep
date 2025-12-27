"use client";

import { useMemo } from "react";
import { getAllergiesColumns } from "./columns";
import type { FormattedMenuItem } from "@mep/api";
import type { Allergen } from "@mep/types";
import { DataTable } from "../ui/data-tables";

interface AllergiesTableProps {
  menuItems: FormattedMenuItem[];
  allergies: Allergen[];
  onEditMenuItem: (id: string) => void;
  onDeleteMenuItem: (id: string) => void;
  menuId: string;
}

export function AllergiesTable({
  menuItems,
  allergies,
  onEditMenuItem,
  onDeleteMenuItem,
  menuId,
}: AllergiesTableProps) {
  const columns = useMemo(
    () =>
      getAllergiesColumns({
        allergies,
        onEditMenuItem,
        onDeleteMenuItem,
        menuId,
      }),
    [allergies, onEditMenuItem, onDeleteMenuItem, menuId],
  );

  return (
    <DataTable
      data={menuItems}
      columns={columns}
      pinnedColumns={{ left: ["name"], right: ["actions"] }}
    />
  );
}
