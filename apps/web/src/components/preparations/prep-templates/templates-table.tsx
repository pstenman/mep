"use client";

import { useMemo } from "react";
import { getTemplatesColumns } from "./templates-columns";
import { DataTable } from "@/components/ui/data-tables";
import type { PrepType } from "@mep/types";

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

interface TemplatesTableProps {
  templates: TemplateItem[];
  prepType: PrepType | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TemplatesTable({
  templates,
  prepType,
  onEdit,
  onDelete,
}: TemplatesTableProps) {
  const columns = useMemo(
    () =>
      getTemplatesColumns({
        prepType,
        onEdit,
        onDelete,
      }),
    [prepType, onEdit, onDelete],
  );

  return (
    <DataTable
      data={templates}
      columns={columns}
      pinnedColumns={{ left: ["name"], right: ["actions"] }}
    />
  );
}
