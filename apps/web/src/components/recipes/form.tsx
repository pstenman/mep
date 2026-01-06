"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { recipeFormSchema, type RecipeFormSchema } from "./schema";
import { useTranslations } from "next-intl";
import {
  Form,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
  Input,
  useForm,
  FormField,
  Button,
  SheetFooter,
  Textarea,
} from "@mep/ui";
import { useRecipesSheet } from "./sheet";
import { IngredientsFieldArray } from "./field-array";
import { useEffect } from "react";

interface RecipeFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export function RecipeForm({ onSuccess }: RecipeFormProps) {
  const utils = trpc.useUtils();
  const { recipeId } = useRecipesSheet();
  const t = useTranslations("recipes");

  const { data: recipeData } = trpc.recipes.getById.useQuery(
    { id: recipeId! },
    { enabled: !!recipeId },
  );

  const schema = recipeFormSchema;
  const form = useForm<RecipeFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      instructions: "",
      ingredients: [],
    },
  });

  useEffect(() => {
    if (recipeData?.data) {
      form.reset({
        name: recipeData.data.name,
        instructions: recipeData.data.instructions || "",
        ingredients: recipeData.data.ingredients || [],
      });
    }
  }, [recipeData, form]);

  const createRecipe = trpc.recipes.create.useMutation({
    onSuccess: () => {
      toast.success(t("form.toast.createSuccess"));
      utils.recipes.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || t("form.toast.error"));
    },
  });

  const updateRecipe = trpc.recipes.update.useMutation({
    onSuccess: () => {
      toast.success(t("form.toast.updateSuccess"));
      utils.recipes.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || t("form.toast.error"));
    },
  });

  const onSubmit = (data: RecipeFormSchema) => {
    if (recipeId) {
      updateRecipe.mutate({
        id: recipeId,
        name: data.name,
        instructions: data.instructions || undefined,
        ingredients: data.ingredients || [],
      });
    } else {
      createRecipe.mutate({
        name: data.name,
        instructions: data.instructions || undefined,
        ingredients: data.ingredients || [],
      });
    }
  };

  const isLoading = createRecipe.isPending || updateRecipe.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col"
      >
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
          <div className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.label.name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.placeholder.name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="instructions"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.label.instructions")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("form.placeholder.instructions")}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <IngredientsFieldArray form={form} />
          </div>
        </div>
        <SheetFooter className="shrink-0 px-6 pb-4 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("form.button.saving")
              : recipeId
                ? t("form.button.update")
                : t("form.button.create")}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
