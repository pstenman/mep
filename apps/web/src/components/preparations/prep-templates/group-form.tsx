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
    <div className="rounded-md border border-border/20 p-4 space-y-4">
      <FormLabel>Group Name</FormLabel>
      <div className="flex gap-2 items-center">
        <FormField
          name={`groups.${groupIndex}.name`}
          control={control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input {...field} placeholder="Enter group name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center">
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
          {isLast && onAddGroup && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onAddGroup}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
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
  );
}

