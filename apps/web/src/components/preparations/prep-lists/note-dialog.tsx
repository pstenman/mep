"use client";

import * as React from "react";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Label,
} from "@mep/ui";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { PrepGroupNote } from "@mep/types";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prepGroupId: string;
  notes?: PrepGroupNote[];
  groupName: string;
}

export function NoteDialog({
  open,
  onOpenChange,
  prepGroupId,
  notes = [],
  groupName,
}: NoteDialogProps) {
  const t = useTranslations("preparations");
  const utils = trpc.useUtils();
  const [newMessage, setNewMessage] = useState("");

  React.useEffect(() => {
    if (open) {
      setNewMessage("");
    }
  }, [open]);

  const addNote = trpc.preparations.prepGroups.addNote.useMutation({
    onSuccess: () => {
      utils.preparations.prepLists.getActive.invalidate();
      utils.preparations.prepLists.getAll.invalidate();
      toast.success(t("noteDialog.toast.addSuccess"));
      setNewMessage("");
    },
    onError: (error: Error) => {
      toast.error(error.message || t("noteDialog.toast.addError"));
    },
  });

  const deleteNote = trpc.preparations.prepGroups.deleteNote.useMutation({
    onSuccess: () => {
      utils.preparations.prepLists.getActive.invalidate();
      utils.preparations.prepLists.getAll.invalidate();
      toast.success(t("noteDialog.toast.deleteSuccess"));
    },
    onError: (error: Error) => {
      toast.error(error.message || t("noteDialog.toast.deleteError"));
    },
  });

  const handleAddNote = async () => {
    if (!newMessage.trim()) return;
    await addNote.mutateAsync({
      prepGroupId,
      message: newMessage.trim(),
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote.mutateAsync({
      prepGroupId,
      noteId,
    });
  };

  const sortedNotes = (notes && Array.isArray(notes) ? [...notes] : []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{groupName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {sortedNotes.length > 0 ? (
              <div className="space-y-2">
                {sortedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start justify-between gap-2 p-3 rounded-md border bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm">{note.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.createdAt).toLocaleString("sv-SE")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deleteNote.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("noteDialog.noNotes")}
              </p>
            )}
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="newNote">{t("noteDialog.label")}</Label>
            <Textarea
              id="newNote"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t("noteDialog.placeholder")}
              rows={3}
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {newMessage.length}/500 {t("noteDialog.characterCount")}
              </p>
              <Button
                type="button"
                onClick={handleAddNote}
                disabled={addNote.isPending || !newMessage.trim()}
                size="sm"
              >
                {addNote.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("noteDialog.button.adding")}
                  </>
                ) : (
                  t("noteDialog.button.add")
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
