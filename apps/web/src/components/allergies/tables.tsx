"use client";
import { useMemo } from "react";
import { getAllergiesColumns } from "./columns";
import type { FormattedMenuItem } from "@mep/api";
import type { Allergen } from "@mep/types";
import { Table } from "../ui/table";

interface AllergiesTableProps {
  menuItems: FormattedMenuItem[];
  allAllergies: Allergen[];
  onEditMenuItem: (id: string) => void;
  onDeleteMenuItem: (id: string) => void;
}

export function AllergiesTableOne({
  menuItems,
  allAllergies,
  onEditMenuItem,
  onDeleteMenuItem,
}: AllergiesTableProps) {
  const columns = useMemo(
    () =>
      getAllergiesColumns({
        allAllergies,
        onEditMenuItem,
        onDeleteMenuItem,
      }),
    [allAllergies, onEditMenuItem, onDeleteMenuItem],
  );

  return (
    <Table
      data={menuItems}
      columns={columns}
      pinnedColumns={{ left: ["name"], right: ["actions"] }}
    />
  );
}
