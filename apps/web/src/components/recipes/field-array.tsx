import type { RecipeFormSchema } from "./schema";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useFieldArray,
  type UseFormReturn,
} from "@mep/ui";
import { Plus, Trash2 } from "lucide-react";

interface IngredientsFieldArrayProps {
  form: UseFormReturn<RecipeFormSchema>;
}

export function IngredientsFieldArray({ form }: IngredientsFieldArrayProps) {
  const { control } = form;

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel>Ingredients</FormLabel>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append(defaultIngredient)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              Ingredient {index + 1}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField
              control={control}
              name={`ingredients.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingredient name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`ingredients.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="0"
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
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="kg, g, ml, etc." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
          No ingredients. Click "Add Ingredient" to get started.
        </div>
      )}
    </div>
  );
}
