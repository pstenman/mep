"use client";

import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { PrepType } from "@mep/types";
import type { PrepGroupTemplate, PrepItemTemplate } from "@mep/api";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetFooter,
  useFieldArray,
  useForm,
} from "@mep/ui";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { templateFormSchema, type TemplateFormSchema } from "./schema";
import { PreparationGroupForm } from "./group-form";

interface PreparationTemplateFormProps {
  type: PrepGroup | "all";
  templateId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PreparationTemplateForm({
  type: _type,
  templateId,
  onSuccess,
  onCancel,
}: PreparationTemplateFormProps) {
  const utils = trpc.useUtils();
  const t = useTranslations("preparations.form");

  const { data: templateData, isLoading: isLoadingTemplate } =
    trpc.preparations.templates.getById.useQuery(
      { id: templateId! },
      { enabled: !!templateId },
    );

  const form = useForm<TemplateFormSchema>({
    resolver: zodResolver(templateFormSchema(t)),
    defaultValues: {
      name: "",
      prepTypes: PrepType.BREAKFAST,
      groups: [
        {
          name: "",
          note: "",
          items: [{ name: "", recipeId: undefined }],
        },
      ],
    },
  });

  useEffect(() => {
    if (templateData?.data && templateId) {
      const template = templateData.data;
      form.reset({
        name: template.name || "",
        prepTypes: template.prepTypes || PrepType.BREAKFAST,
        groups: template.prepGroupTemplates?.map(
          (group: PrepGroupTemplate) => ({
            name: group.name || "",
            note: group.note || "",
            items: group.prepItemsTemplates?.map((item: PrepItemTemplate) => ({
              name: item.name || "",
              recipeId: item.recipeId || undefined,
            })) || [{ name: "", recipeId: undefined }],
          }),
        ) || [
          {
            name: "",
            note: "",
            items: [{ name: "", recipeId: undefined }],
          },
        ],
      });
    }
  }, [templateData, templateId, form]);

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  const createTemplate = trpc.preparations.templates.create.useMutation({
    onSuccess: () => {
      utils.preparations.templates.getAll.invalidate();
      toast.success(
        t("form.toast.createSuccess") || "Template created successfully",
      );
      form.reset();
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("form.toast.error") || "Failed to create template",
      );
    },
  });

  const updateTemplate = trpc.preparations.templates.update.useMutation({
    onSuccess: () => {
      utils.preparations.templates.getAll.invalidate();
      utils.preparations.templates.getById.invalidate({ id: templateId! });
      toast.success(
        t("form.toast.updateSuccess") || "Template updated successfully",
      );
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(
        error.message || t("form.toast.error") || "Failed to update template",
      );
    },
  });

  const onSubmit = async (data: TemplateFormSchema) => {
    try {
      const templateData = {
        name: data.name,
        prepTypes: data.prepTypes,
        groups: data.groups
          .filter((group) => group.name.trim() !== "")
          .map((group) => ({
            name: group.name,
            note: group.note || undefined,
            items: group.items
              .filter((item) => item.name.trim() !== "")
              .map((item) => ({
                name: item.name,
                recipeId: item.recipeId || undefined,
              })),
          })),
      };

      if (templateId) {
        await updateTemplate.mutateAsync({
          id: templateId,
          ...templateData,
        });
      } else {
        await createTemplate.mutateAsync(templateData);
      }
    } catch (error) {
      console.error("Template save error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Template Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter template name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="prepTypes"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prep Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select prep type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(PrepType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {groupFields.map((group, gIndex) => (
            <PreparationGroupForm
              key={group.id}
              groupIndex={gIndex}
              form={form}
              onRemove={() => removeGroup(gIndex)}
              onAddGroup={() =>
                appendGroup({
                  name: "",
                  note: "",
                  items: [{ name: "", recipeId: undefined }],
                })
              }
              isLast={gIndex === groupFields.length - 1}
            />
          ))}
        </div>

        <SheetFooter className="shrink-0 px-6 pb-4 pt-4 border-t flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={
              createTemplate.isPending ||
              updateTemplate.isPending ||
              isLoadingTemplate
            }
          >
            {createTemplate.isPending || updateTemplate.isPending
              ? templateId
                ? "Updating..."
                : "Creating..."
              : templateId
                ? "Update Template"
                : "Save Template"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
