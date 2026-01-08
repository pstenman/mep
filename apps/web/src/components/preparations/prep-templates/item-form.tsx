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
import { BookText, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { RecipeSelectDialog } from "./recipe-select-dialog";
import { trpc } from "@/lib/trpc/client";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("preparations");
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
      <div className="w-full space-y-2">
        <div className="flex items-center gap-2">
          <FormField
            name={`groups.${groupIndex}.items.${itemIndex}.name`}
            control={control}
            render={({ field }) => (
              <FormItem className="mb-0">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("form.item.placeholder")}
                    className="border-none"
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
          <div className="flex gap-5 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setDialogOpen(true)}
              className={cn("shrink-0", recipeId && "text-primary")}
              title={recipeData?.data?.name || t("form.item.selectRecipe")}
            >
              <BookText className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onRemove}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
        {isLast && onAddItem && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onAddItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("form.item.button.add")}
          </Button>
        )}
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
