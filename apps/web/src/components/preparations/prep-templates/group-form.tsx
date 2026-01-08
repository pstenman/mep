"use client";

import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Separator,
  useFieldArray,
  type UseFormReturn,
} from "@mep/ui";
import { PreparationItemForm } from "./item-form";
import type { TemplateFormSchema } from "./schema";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface PreparationGroupFormProps {
  groupIndex: number;
  form: UseFormReturn<TemplateFormSchema>;
  onRemove: () => void;
  onAddGroup?: () => void;
  isLast: boolean;
}

export function PreparationGroupForm({
  groupIndex,
  form,
  onRemove,
  onAddGroup,
  isLast,
}: PreparationGroupFormProps) {
  const t = useTranslations("preparations");
  const { control } = form;

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `groups.${groupIndex}.items`,
  });

  return (
    <>
      <div className="rounded-md border border-border/20 p-4 space-y-4">
        <FormLabel>{t("form.group.label")}</FormLabel>
        <div className="flex gap-2 items-center">
          <FormField
            name={`groups.${groupIndex}.name`}
            control={control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder={t("form.group.placeholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
        <Separator className="bg-border/20" />

        <div className="space-y-2">
          {itemFields.map((item, iIndex) => (
            <PreparationItemForm
              key={item.id}
              groupIndex={groupIndex}
              itemIndex={iIndex}
              form={form}
              onRemove={() => removeItem(iIndex)}
              onAddItem={() => appendItem({ name: "", recipeId: undefined })}
              isLast={iIndex === itemFields.length - 1}
            />
          ))}
        </div>
      </div>
      {isLast && onAddGroup && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onAddGroup}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("form.group.button.add")}
        </Button>
      )}
    </>
  );
}
