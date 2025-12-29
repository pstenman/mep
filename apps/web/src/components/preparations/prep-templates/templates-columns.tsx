"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import type { PrepType } from "@mep/types";
import { MenuItemActions } from "@/components/ui/action-menu";
import { TemplatesCell } from "./templates-cell";

interface TemplateItem {
  id: string;
  name: string;
  prepTypes: PrepType;
  isActive: boolean;
  prepGroupTemplates?: {
    id: string;
    name: string;
    prepItemsTemplates?: {
      id: string;
      name: string;
    }[];
  }[];
}

interface TemplatesColumnsProps {
  prepType: PrepType | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const getTemplatesColumns = ({
  prepType,
  onEdit,
  onDelete,
}: TemplatesColumnsProps): ColumnDef<TemplateItem>[] => [
  {
    accessorKey: "isActive",
    id: "isActive",
    header: "Active",
    enableSorting: false,
    size: 80,
    cell: ({ row }: { row: Row<TemplateItem> }) => (
      <TemplatesCell row={row} prepType={prepType} />
    ),
  },
  {
    accessorKey: "name",
    id: "name",
    header: "Template Name",
    enableResizing: false,
    size: 200,
  },
  {
    accessorKey: "prepTypes",
    id: "prepTypes",
    header: "Prep Type",
    size: 120,
  },
  {
    id: "groups",
    header: "Groups",
    size: 100,
    cell: ({ row }: { row: Row<TemplateItem> }) => {
      const totalGroups = row.original.prepGroupTemplates?.length || 0;
      return <span className="text-sm">{totalGroups}</span>;
    },
  },
  {
    id: "items",
    header: "Items",
    size: 100,
    cell: ({ row }: { row: Row<TemplateItem> }) => {
      const totalItems =
        row.original.prepGroupTemplates?.reduce(
          (total, group) => total + (group.prepItemsTemplates?.length || 0),
          0,
        ) || 0;
      return <span className="text-sm">{totalItems}</span>;
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
        <MenuItemActions
          onEdit={() => onEdit(row.original.id)}
          onDelete={() => onDelete(row.original.id)}
        />
      </div>
    ),
  },
];
