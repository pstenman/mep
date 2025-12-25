import type { MenuFormSchema } from "./schema";
import {
  Button,
  Checkbox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useFieldArray,
  type UseFormReturn,
} from "@mep/ui";
import { MenuCategory } from "@mep/types";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

interface MenuFieldArrayProps {
  form: UseFormReturn<MenuFormSchema>;
  allergies: { id: string; name: string }[];
}

export function MenuFieldArray({ form, allergies }: MenuFieldArrayProps) {
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "menuItems",
  });

  const defaultItem = {
    name: "",
    category: MenuCategory.MAIN,
    description: "",
    allergies: [] as string[],
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => append(defaultItem)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              Item {index + 1}
            </h4>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <FormField
            control={control}
            name={`menuItems.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Item name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`menuItems.${index}.category`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(MenuCategory).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`menuItems.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Item description"
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`menuItems.${index}.allergies`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergies</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span>
                          {field.value.length > 0
                            ? `${field.value.length} selected`
                            : "Select allergies"}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <div className="max-h-[300px] overflow-y-auto p-2">
                      {allergies.map((allergy) => {
                        const checkboxId = `allergy-${allergy.id}`;

                        return (
                          <div
                            key={allergy.id}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-accent"
                          >
                            <Checkbox
                              id={checkboxId}
                              checked={field.value?.includes(allergy.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, allergy.id]
                                    : current.filter((id) => id !== allergy.id),
                                );
                              }}
                            />

                            <label
                              htmlFor={checkboxId}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {allergy.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      {fields.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-lg">
          No menu items. Click "Add Item" to get started.
        </div>
      )}
    </div>
  );
}
