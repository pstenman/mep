"use client";

import type { RecipeFormSchema } from "./schema";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  useFieldArray,
  type UseFormReturn,
} from "@mep/ui";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface IngredientsFieldArrayProps {
  form: UseFormReturn<RecipeFormSchema>;
}

export function IngredientsFieldArray({ form }: IngredientsFieldArrayProps) {
  const { control } = form;
  const t = useTranslations("recipes");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const defaultIngredient = {
    name: "",
    quantity: 0,
    unit: "",
  };

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <FormField
              control={control}
              name={`ingredients.${index}.name`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.placeholder.ingredientName")}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`ingredients.${index}.quantity`}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      placeholder={t("form.placeholder.quantity")}
                      className="h-9"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`ingredients.${index}.unit`}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("form.placeholder.unit")}
                      className="h-9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(index)}
            className="h-9 w-9 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => append(defaultIngredient)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("form.button.addIngredient")}
      </Button>
    </div>
  );
}
