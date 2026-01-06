"use client";

import { Popover, PopoverTrigger, Button, PopoverContent } from "@mep/ui";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useTranslations } from "next-intl";

interface RecipeActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RecipeActions({
  onView,
  onEdit,
  onDelete,
}: RecipeActionsProps) {
  const t = useTranslations("recipes");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-40 p-1">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onView}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("actions.view")}
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onEdit}
        >
          <Pencil className="mr-2 h-4 w-4" />
          {t("actions.edit")}
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
          {t("actions.delete")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
