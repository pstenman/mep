"use client";

import { trpc } from "@/lib/trpc/client";
import { EmptyState } from "../empty-state";
import { Loader2, ArrowLeft } from "lucide-react";
import type { PrepType } from "@mep/types";
import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { DynamicButton } from "@/components/ui/dynamic-button";
import { TemplatesTable } from "./templates-table";
import { usePreparationTemplateSheet } from "./sheet";
import { toast } from "sonner";

interface TemplatesPrepViewProps {
  prepType: PrepType | null;
  onBackClick?: () => void;
}

export function TemplatesPrepView({
  prepType,
  onBackClick,
}: TemplatesPrepViewProps) {
  const utils = trpc.useUtils();
  const { open: openSheet } = usePreparationTemplateSheet();

  const { data: templatesData, isLoading: templatesLoading } =
    trpc.preparations.templates.getAll.useQuery({
      filter: prepType
        ? {
            prepType,
          }
        : undefined,
    });

  const deleteTemplate = trpc.preparations.templates.delete.useMutation({
    onSuccess: () => {
      utils.preparations.templates.getAll.invalidate();
      utils.preparations.templates.getActive.invalidate();
      toast.success("Template deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete template");
      console.error("Failed to delete template:", error);
    },
  });

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const templates = templatesData?.data.items ?? [];
  const hasTemplates = templates.length > 0;

  const handleEdit = (id: string) => {
    openSheet(id);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this template? This action cannot be undone.",
      )
    ) {
      deleteTemplate.mutate({ id });
    }
  };

  if (!hasTemplates) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Templates</h2>
            <p className="text-sm text-muted-foreground">
              No templates found. Create one to get started.
            </p>
          </div>
          {onBackClick && (
            <DynamicButton
              icon={ArrowLeft}
              tooltip="Back to Active List"
              size="icon"
              variant="outline"
              onClick={onBackClick}
              buttonClassName="rounded-full w-[32px] h-[32px]"
            />
          )}
        </div>
        <EmptyState
          group={(prepType?.toLowerCase() as PrepGroup) || "breakfast"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Templates</h2>
          <p className="text-sm text-muted-foreground">
            Manage your preparation templates. Check the active template to use
            when creating new lists.
          </p>
        </div>
        {onBackClick && (
          <DynamicButton
            icon={ArrowLeft}
            tooltip="Back to Active List"
            size="icon"
            variant="outline"
            onClick={onBackClick}
            buttonClassName="rounded-full w-[32px] h-[32px]"
          />
        )}
      </div>
      <TemplatesTable
        templates={templates}
        prepType={prepType}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
