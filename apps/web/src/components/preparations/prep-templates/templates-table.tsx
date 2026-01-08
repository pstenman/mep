"use client";

import { useMemo } from "react";
import { getTemplatesColumns } from "./templates-columns";
import { DataTable } from "@/components/ui/data-tables";
import type { PrepType } from "@mep/types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("preparations");
  const columns = useMemo(
    () =>
      getTemplatesColumns({
        prepType,
        onEdit,
        onDelete,
        t,
      }),
    [prepType, onEdit, onDelete, t],
  );

  return (
    <DataTable
      data={templates}
      columns={columns}
      pinnedColumns={{ left: ["name"], right: ["actions"] }}
    />
  );
}
