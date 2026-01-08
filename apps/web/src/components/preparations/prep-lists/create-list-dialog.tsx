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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("preparations");
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
        toast.success(t("createList.toast.createSuccess"));
        onOpenChange(false);
        setSelectedDate(tomorrow);
      },
      onError: (error: Error) => {
        toast.error(error.message || t("createList.toast.createError"));
        console.error("Create list error:", error);
      },
    });

  const handleCreate = async () => {
    if (!activeTemplate?.data?.id) {
      toast.error(t("createList.toast.noActiveTemplateError"));
      return;
    }

    if (!selectedDate) {
      toast.error(t("createList.toast.selectDateError"));
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
          <DialogTitle>{t("createList.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isLoadingTemplate ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("createList.loading")}
            </div>
          ) : activeTemplate?.data ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("createList.usingTemplate")}{" "}
                <span className="font-medium">{activeTemplate.data.name}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {t("createList.prepType")}{" "}
                <span className="font-medium">
                  {activeTemplate.data.prepTypes}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("createList.noActiveTemplate")}
            </p>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("createList.scheduleFor")}
            </Label>
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
              placeholder={t("createList.selectDate")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createFromTemplate.isPending}
            >
              {t("createList.button.cancel")}
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
                  {t("createList.button.creating")}
                </>
              ) : (
                t("createList.button.create")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
