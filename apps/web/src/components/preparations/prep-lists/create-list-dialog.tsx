"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc/client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DatePicker,
  Label,
} from "@mep/ui";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { PrepType } from "@mep/types";

interface CreateListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prepType: PrepType;
}

export function CreateListDialog({
  open,
  onOpenChange,
  prepType,
}: CreateListDialogProps) {
  const utils = trpc.useUtils();

  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(tomorrow);

  React.useEffect(() => {
    if (open) {
      setSelectedDate(tomorrow);
    }
  }, [open, tomorrow]);

  const { data: activeTemplate, isLoading: isLoadingTemplate } =
    trpc.preparations.templates.getActive.useQuery(
      { prepType },
      { enabled: open && !!prepType },
    );

  const createFromTemplate =
    trpc.preparations.prepLists.createFromTemplate.useMutation({
      onSuccess: () => {
        utils.preparations.prepLists.getActive.invalidate();
        utils.preparations.prepLists.getAll.invalidate();
        toast.success("List created successfully");
        onOpenChange(false);
        setSelectedDate(tomorrow);
      },
      onError: (error: Error) => {
        toast.error(error.message || "Failed to create list");
        console.error("Create list error:", error);
      },
    });

  const handleCreate = async () => {
    if (!activeTemplate?.data?.id) {
      toast.error(
        "No active template found. Please activate a template first.",
      );
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const normalizedDate = new Date(selectedDate);
    normalizedDate.setHours(0, 0, 0, 0);

    try {
      await createFromTemplate.mutateAsync({
        templateId: activeTemplate.data.id,
        scheduleFor: normalizedDate,
      });
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isLoadingTemplate ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading template...
            </div>
          ) : activeTemplate?.data ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Using template:{" "}
                <span className="font-medium">{activeTemplate.data.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Prep Type:{" "}
                <span className="font-medium">
                  {activeTemplate.data.prepTypes}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No active template found for this prep type. Please activate a
              template first.
            </p>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Schedule For</Label>
            <DatePicker
              value={selectedDate}
              onChange={(date) => {
                if (date) {
                  const normalizedDate = new Date(date);
                  normalizedDate.setHours(0, 0, 0, 0);
                  setSelectedDate(normalizedDate);
                } else {
                  setSelectedDate(undefined);
                }
              }}
              placeholder="Select date"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createFromTemplate.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={
                createFromTemplate.isPending ||
                isLoadingTemplate ||
                !selectedDate ||
                !activeTemplate?.data
              }
            >
              {createFromTemplate.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create List"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

