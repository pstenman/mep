"use client";

import type { PrepGroup } from "@/lib/navigation/dashboard/types";
import { PrepType } from "@mep/types";
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
import { templateFormSchema, type TemplateFormSchema } from "./schema";
import { PreparationGroupForm } from "./group-form";

interface PreparationTemplateFormProps {
  type: PrepGroup | "all";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PreparationTemplateForm({
  type: _type,
  onSuccess,
  onCancel,
}: PreparationTemplateFormProps) {
  const utils = trpc.useUtils();
  const t = useTranslations("preparations.form");

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

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control: form.control,
    name: "groups",
  });

  const createTemplate = trpc.preparations.prepLists.createTemplate.useMutation(
    {
      onSuccess: () => {
        utils.preparations.prepLists.getAll.invalidate();
        toast.success(t("form.toast.createSuccess"));
        onSuccess?.();
      },
      onError: () => {
        toast.error(t("form.toast.error"));
      },
    },
  );

  const onSubmit = async (data: TemplateFormSchema) => {
    await createTemplate.mutateAsync({
      name: data.name,
      prepTypes: data.prepTypes,
      date: new Date(),
      isTemplate: true,
      groups: data.groups.map((group) => ({
        name: group.name,
        note: group.note || undefined,
        items: group.items.map((item) => ({
          name: item.name,
          recipeId: item.recipeId || undefined,
        })),
      })),
    });
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
          <Button type="submit">Save Template</Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
