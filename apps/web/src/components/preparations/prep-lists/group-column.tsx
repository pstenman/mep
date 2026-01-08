"use client";

import { useState } from "react";
import type { PrepListGroup, Recipe } from "@mep/types";
import { PrepItemRow } from "./item-row";
import { MessageSquare } from "lucide-react";
import { Button } from "@mep/ui";
import { NoteDialog } from "./note-dialog";
import { useTranslations } from "next-intl";

interface PrepGroupColumnProps {
  group: PrepListGroup;
  onToggleItem?: (itemId: string) => void;
  onStatusToggle?: (itemId: string) => void;
  onRecipeClick?: (recipe: Recipe) => void;
}

export function PrepGroupColumn({
  group,
  onToggleItem,
  onStatusToggle,
  onRecipeClick,
}: PrepGroupColumnProps) {
  const t = useTranslations("preparations");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const notesCount = group.notes?.length || 0;

  return (
    <>
      <div className="rounded-lg bg-background">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
            {group.name}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 relative"
            onClick={() => setNoteDialogOpen(true)}
            title={
              notesCount > 0
                ? notesCount === 1
                  ? t("noteDialog.tooltip.viewNote")
                  : t("noteDialog.tooltip.viewNotes", { count: notesCount })
                : t("noteDialog.tooltip.addNote")
            }
          >
            <MessageSquare
              className={`h-4 w-4 ${
                notesCount > 0 ? "text-primary" : "text-muted-foreground"
              }`}
            />
            {notesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {notesCount}
              </span>
            )}
          </Button>
        </div>

        <ul className="space-y-0.5">
          {group.items.map((item) => (
            <PrepItemRow
              key={item.id}
              item={item}
              onToggle={onToggleItem}
              onStatusToggle={onStatusToggle}
              onRecipeClick={onRecipeClick}
            />
          ))}
        </ul>
      </div>
      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        prepGroupId={group.id}
        notes={group.notes}
        groupName={group.name}
      />
    </>
  );
}
