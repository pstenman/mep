"use client";

import type { Row } from "@tanstack/react-table";
import { trpc } from "@/lib/trpc/client";
import { Checkbox } from "@mep/ui";
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

interface TemplatesCellProps {
  row: Row<TemplateItem>;
  prepType: PrepType | null;
}

export function TemplatesCell({ row, prepType }: TemplatesCellProps) {
  const utils = trpc.useUtils();

  const setActive = trpc.preparations.templates.setActive.useMutation({
    onSuccess: () => {
      utils.preparations.templates.getAll.invalidate();
      utils.preparations.templates.getActive.invalidate();
    },
    onError: (error: Error) => {
      console.error("Failed to set active template:", error);
    },
  });

  const handleCheckedChange = (checked: boolean) => {
    if (!prepType || !checked) {
      return;
    }

    setActive.mutate({
      id: row.original.id,
      prepType,
    });
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <Checkbox
        checked={row.original.isActive}
        disabled={setActive.isPending || !prepType}
        onCheckedChange={handleCheckedChange}
      />
    </div>
  );
}
