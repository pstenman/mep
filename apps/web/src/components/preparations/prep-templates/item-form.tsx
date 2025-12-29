"use client";

import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  type UseFormReturn,
  cn,
} from "@mep/ui";
import type { TemplateFormSchema } from "./schema";
import { BookText, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { RecipeSelectDialog } from "./recipe-select-dialog";
import { trpc } from "@/lib/trpc/client";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const recipeId = form.watch(
    `groups.${groupIndex}.items.${itemIndex}.recipeId`,
  );
  const { data: recipeData } = trpc.recipes.getById.useQuery(
    { id: recipeId! },
    { enabled: !!recipeId },
  );

  const handleRecipeSelect = (recipeId: string) => {
    form.setValue(`groups.${groupIndex}.items.${itemIndex}.recipeId`, recipeId);
  };

  const handleRecipeClear = () => {
    form.setValue(
      `groups.${groupIndex}.items.${itemIndex}.recipeId`,
      undefined,
    );
  };

  return (
    <>
      <div className="w-full px-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDialogOpen(true)}
            className={cn("shrink-0", recipeId && "text-primary")}
            title={recipeData?.data?.name || "Select recipe"}
          >
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
          {recipeId && (
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {recipeData?.data?.name}
            </span>
          )}

          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
            >
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

      <RecipeSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedRecipeId={recipeId}
        onSelect={handleRecipeSelect}
        onClear={handleRecipeClear}
      />
    </>
  );
}
