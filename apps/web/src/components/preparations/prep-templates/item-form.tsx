"use client";

import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  type UseFormReturn,
} from "@mep/ui";
import type { TemplateFormSchema } from "./schema";
import { BookText, Minus, Plus } from "lucide-react";

interface PreparationItemFormProps {
  groupIndex: number;
  itemIndex: number;
  form: UseFormReturn<TemplateFormSchema>;
  onRemove: () => void;
  onAddItem?: () => void;
  isLast: boolean;
}

export function PreparationItemForm({
  groupIndex,
  itemIndex,
  form,
  onRemove,
  onAddItem,
  isLast,
}: PreparationItemFormProps) {
  const { control } = form;
  return (
    <div className="w-full px-4">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon">
          <BookText className="w-4 h-4" />
        </Button>
        <FormField
          name={`groups.${groupIndex}.items.${itemIndex}.name`}
          control={control}
          render={({ field }) => (
            <FormItem className="flex-1 mb-0">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter item name"
                  className="border-none w-60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Minus className="w-4 h-4 text-destructive" />
          </Button>
          {isLast && onAddItem && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onAddItem}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

